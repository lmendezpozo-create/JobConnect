// js/services/api.js
// Cliente HTTP mínimo encima de fetch para comunicarse con el json-server.
// Todas las demás capas (servicios) dependen de estas funciones.
//
// Incluye un MODO LOCAL DE RESPALDO: si el backend (json-server) no está
// levantado, la petición falla con "Failed to fetch" (TypeError). Para evitar
// bloquear la app, en ese caso se atiende la petición contra una copia en
// memoria de db.json, persistida en localStorage, de modo que el módulo de
// Tareas y de Entrevistas siguen siendo funcionales sin servidor.

export const BASE_URL = 'http://localhost:3000';

// Clave usada en localStorage para guardar la copia local (respaldada por db.json).
const STORAGE_KEY = 'jobconnect-local-db';

// Cache en memoria de la base local.
let localDb = null;

// ── Ayudantes del modo local ──────────────────────────────────────────
const parseLocalPath = (endpoint) => {
  const url = new URL(endpoint, 'http://local');
  const parts = url.pathname.split('/').filter(Boolean);
  return {
    resource: parts[0] || '',
    id: parts[1] || null,
    params: url.searchParams,
  };
};

const readStoredDb = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

const loadLocalDb = async () => {
  if (localDb) return localDb;
  const stored = readStoredDb();
  if (stored) {
    localDb = stored;
  } else {
    // Mismo mecanismo de respaldo que usa el dashboard (src/main.js).
    const mod = await import('../../db.json');
    localDb = mod.default || mod;
  }
  // Garantizar que todas las colecciones sean arrays.
  Object.keys(localDb).forEach((key) => {
    if (!Array.isArray(localDb[key])) localDb[key] = [];
  });
  return localDb;
};

const persistLocalDb = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localDb));
  } catch (_) {
    /* almacenamiento no disponible (p.ej. modo privado) */
  }
};

// Filtro básico de colección a partir de los query params (?campo=valor).
const matchesParams = (item, params) => {
  for (const [key, value] of params) {
    if (String(item[key]) !== String(value)) return false;
  }
  return true;
};

const nextLocalId = (collection) => {
  let max = 0;
  collection.forEach((x) => {
    const n = Number(x.id);
    if (Number.isFinite(n) && n > max) max = n;
  });
  return String(max + 1);
};

const localRequest = async (endpoint, options = {}) => {
  const db = await loadLocalDb();
  const { resource, id, params } = parseLocalPath(endpoint);
  const method = (options.method || 'GET').toUpperCase();

  db[resource] = db[resource] || [];
  const collection = db[resource];
  const body = options.body ? JSON.parse(options.body) : null;

  if (method === 'GET') {
    if (id) {
      const found = collection.find((x) => String(x.id) === String(id));
      if (!found) {
        // Emula el 404 de json-server.
        throw new Error(`Error 404: no se encontró ${resource}/${id}`);
      }
      return found;
    }
    return collection.filter((x) => matchesParams(x, params));
  }

  if (method === 'POST') {
    const record = { ...(body || {}) };
    record.id = record.id ?? nextLocalId(collection);
    collection.push(record);
    persistLocalDb();
    return record;
  }

  if (method === 'PUT') {
    const index = collection.findIndex((x) => String(x.id) === String(id));
    if (index === -1) throw new Error(`Error 404: no se encontró ${resource}/${id}`);
    collection[index] = { ...(body || {}), id };
    persistLocalDb();
    return collection[index];
  }

  if (method === 'PATCH') {
    const index = collection.findIndex((x) => String(x.id) === String(id));
    if (index === -1) throw new Error(`Error 404: no se encontró ${resource}/${id}`);
    collection[index] = { ...collection[index], ...(body || {}) };
    persistLocalDb();
    return collection[index];
  }

  if (method === 'DELETE') {
    db[resource] = collection.filter((x) => String(x.id) !== String(id));
    persistLocalDb();
    return null; // equivale a un 204 sin contenido
  }

  throw new Error(`Método no soportado en modo local: ${method}`);
};

const isNetworkError = (err) =>
  err instanceof TypeError ||
  (err && /fetch|network/i.test(err && err.message || ''));

/**
 * Petición HTTP con JSON.
 * @param {string} endpoint - Ruta tras el BASE_URL, p.ej. "/comments".
 * @param {object} [options] - Opciones de fetch (method, body, headers…).
 */
export const fetchApi = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    // 204 = sin contenido
    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (err) {
    // "Failed to fetch" (backend caído/inaccesible) → modo local.
    if (isNetworkError(err)) {
      const methodName = (options.method || 'GET').toUpperCase();
      console.warn(
        `[api] Backend no disponible para ${methodName} ${endpoint}. Usando datos locales (${STORAGE_KEY}).`,
        err
      );
      return localRequest(endpoint, options);
    }
    // Los demás errores (p. ej. 4xx/5xx con respuesta) se propagan.
    throw err;
  }
};