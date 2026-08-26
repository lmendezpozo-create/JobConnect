// js/pages/interviews.controller.js
// Orquestador de la página interviews.html.
// Gestiona: listado, estado vacío, indicador de carga, alerta de error,
// modal crear/editar y diálogo de confirmación de borrado.
// Recurso esperado por el server: /entrevistas (db.json), con campos
// fecha, hora, lugar, postulante (id) y vacante (id).
// Los catálogos /usuarios y /vacantes permiten mostrar el nombre del
// postulante y el título de la vacante en las tarjetas.

import * as service from '../services/interviewService.js';
import { useCrud } from '../hooks/useCrud.js';
import { fetchApi } from '../services/api.js';
import { openModal, closeModal } from '../components/modal.js';
import { askConfirm } from '../components/confirmDialog.js';

// ── Referencias al DOM ─────────────────────────────────────────────
const listEl = document.querySelector('#interviews-list');
const loadingEl = document.querySelector('#loading-indicator');
const emptyEl = document.querySelector('#empty-state');
const errorBanner = document.querySelector('#error-banner');
const errorMessage = document.querySelector('#error-message');
const btnCloseError = document.querySelector('#btn-close-error');

const modal = document.querySelector('#interview-modal');
const modalTitle = modal?.querySelector('#modal-title');
const form = document.querySelector('#interview-form');
const submitBtn = document.querySelector('#btn-submit-form');
const btnOpenCreate = document.querySelector('#btn-open-create-modal');
const deleteDialog = document.querySelector('#delete-dialog');

const fieldId = form?.querySelector('#field-id');
const fieldFecha = form?.querySelector('#field-fecha');
const fieldHora = form?.querySelector('#field-hora');
const fieldLugar = form?.querySelector('#field-lugar');
const fieldPostulante = form?.querySelector('#field-postulante');
const fieldVacante = form?.querySelector('#field-vacante');

const errorFecha = document.querySelector('#error-fecha');
const errorHora = document.querySelector('#error-hora');
const errorLugar = document.querySelector('#error-lugar');
const errorPostulante = document.querySelector('#error-postulante');
const errorVacante = document.querySelector('#error-vacante');

// ── Catálogos para resolver nombres ────────────────────────────────
let usuarios = [];
let vacantes = [];

// ── Utilidades de presentación ─────────────────────────────────────
const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));

const formatFecha = (value) => {
  if (!value) return 'Pendiente';
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
};

const postulanteName = (id) => {
  const u = usuarios.find((x) => String(x.id) === String(id));
  return u ? `${u.nombre || ''} ${u.apellido || ''}`.trim() : id;
};

const vacanteName = (id) => {
  const v = vacantes.find((x) => String(x.id) === String(id));
  return v ? v.titulo : id;
};

let items = [];

// ── Manejo de errores ──────────────────────────────────────────────
const clearError = () => {
  if (errorBanner) errorBanner.hidden = true;
  if (errorMessage) errorMessage.textContent = '';
};
btnCloseError?.addEventListener('click', clearError);

const showError = (msg) => {
  if (errorMessage) errorMessage.textContent = msg;
  if (errorBanner) errorBanner.hidden = false;
};

const setFieldError = (el, msg) => {
  if (el) {
    el.textContent = msg;
    el.hidden = !msg;
  }
};

// ── Llenado de los selects con los catálogos ──────────────────────
const fillSelect = (select, placeholder, options, labelFn) => {
  if (!select) return;
  select.length = 0;
  if (placeholder) select.appendChild(new Option(placeholder, ''));
  options.forEach((o) => select.appendChild(new Option(labelFn(o), o.id)));
};

const loadCatalogs = async () => {
  try {
    const [users, jobs] = await Promise.all([fetchApi('/usuarios'), fetchApi('/vacantes')]);
    usuarios = users || [];
    vacantes = jobs || [];
    fillSelect(
      fieldPostulante,
      'Selecciona un postulante',
      usuarios,
      (u) => `${u.nombre || ''} ${u.apellido || ''}`.trim() || u.id
    );
    fillSelect(fieldVacante, 'Selecciona una vacante', vacantes, (v) => v.titulo || v.id);
  } catch (err) {
    // Si los catálogos fallan, el resto del CRUD sigue funcionando.
    console.error('No se pudieron cargar los catálogos', err);
  }
};

// ── Render del listado ─────────────────────────────────────────────
const render = (list) => {
  items = list || [];
  if (loadingEl) loadingEl.hidden = true;
  if (!listEl) return;
  listEl.innerHTML = '';
  if (emptyEl) emptyEl.hidden = items.length > 0;

  items.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'interview-card';
    article.dataset.id = item.id;
    article.dataset.entity = 'interview';

    article.innerHTML = `
      <div class="interview-card__content">
        <h3 class="interview-card__candidate">${escapeHtml(postulanteName(item.postulante))}</h3>
        <p class="interview-card__position">${escapeHtml(vacanteName(item.vacante))}</p>
        <p class="interview-card__date">Fecha: ${formatFecha(item.fecha)}</p>
        <p class="interview-card__hora">Hora: ${escapeHtml(item.hora || '')}</p>
        <p class="interview-card__lugar">Lugar: ${escapeHtml(item.lugar || '')}</p>
      </div>
      <div class="interview-card__actions">
        <button class="btn btn--small" data-action="edit">Editar</button>
        <button class="btn btn--danger btn--small" data-action="delete">Eliminar</button>
      </div>
    `;
    listEl.appendChild(article);
  });
};
// ── Modal: relleno según modo ──────────────────────────────────────
const resetForm = () => {
  form?.reset();
  setFieldError(errorFecha, '');
  setFieldError(errorHora, '');
  setFieldError(errorLugar, '');
  setFieldError(errorPostulante, '');
  setFieldError(errorVacante, '');
  if (submitBtn) {
    submitBtn.textContent = 'Crear';
    submitBtn.disabled = false;
  }
};

const openCreate = () => {
  resetForm();
  if (modal) modal.dataset.mode = 'create';
  if (modalTitle) modalTitle.textContent = 'Nueva Entrevista';
  openModal(modal);
};

const openEdit = (item) => {
  resetForm();
  if (modal) modal.dataset.mode = 'edit';
  if (modalTitle) modalTitle.textContent = 'Editar Entrevista';
  if (submitBtn) submitBtn.textContent = 'Actualizar';
  if (fieldId) fieldId.value = item.id;
  if (fieldFecha) fieldFecha.value = item.fecha || '';
  if (fieldHora) fieldHora.value = item.hora || '';
  if (fieldLugar) fieldLugar.value = item.lugar || '';
  if (fieldPostulante) fieldPostulante.value = item.postulante ?? '';
  if (fieldVacante) fieldVacante.value = item.vacante ?? '';
  openModal(modal);
};

// ── Validación del formulario ──────────────────────────────────────
const validate = () => {
  let ok = true;
  if (!fieldFecha?.value) {
    setFieldError(errorFecha, 'La fecha es obligatoria.');
    ok = false;
  }
  if (!fieldHora?.value) {
    setFieldError(errorHora, 'La hora es obligatoria.');
    ok = false;
  }
  if (!fieldLugar?.value.trim()) {
    setFieldError(errorLugar, 'El lugar es obligatorio.');
    ok = false;
  }
  if (!fieldPostulante?.value) {
    setFieldError(errorPostulante, 'Selecciona un postulante.');
    ok = false;
  }
  if (!fieldVacante?.value) {
    setFieldError(errorVacante, 'Selecciona una vacante.');
    ok = false;
  }
  return ok;
};

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const id = fieldId?.value;
    const data = {
      fecha: fieldFecha.value,
      hora: fieldHora.value,
      lugar: fieldLugar.value.trim(),
      postulante: fieldPostulante.value,
      vacante: fieldVacante.value,
    };

    if (submitBtn) submitBtn.disabled = true;
    try {
      if (id) {
        await update(id, data);
      } else {
        await create(data);
      }
      closeModal(modal);
      await load();
    } catch {
      /* el error ya se muestra vía onError */
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  // Limpiar errores de campo al escribir/cambiar
  [
    ['#field-fecha', errorFecha],
    ['#field-hora', errorHora],
    ['#field-lugar', errorLugar],
    ['#field-postulante', errorPostulante],
    ['#field-vacante', errorVacante],
  ].forEach(([sel, el]) => {
    const input = form.querySelector(sel);
    input?.addEventListener('input', () => setFieldError(el, ''));
    input?.addEventListener('change', () => setFieldError(el, ''));
  });
}

// ── Eventos del modal / botón crear ────────────────────────────────
btnOpenCreate?.addEventListener('click', openCreate);
modal?.querySelectorAll('[data-action="close-modal"]').forEach((btn) => {
  btn.addEventListener('click', () => closeModal(modal));
});

// ── Eventos del listado (delegación) ───────────────────────────────
listEl?.addEventListener('click', async (e) => {
  const actionBtn = e.target.closest('[data-action]');
  if (!actionBtn) return;
  const card = e.target.closest('.interview-card');
  const id = card?.dataset.id;
  if (!id) return;

  if (actionBtn.dataset.action === 'edit') {
    const item = items.find((i) => String(i.id) === String(id));
    if (item) openEdit(item);
  } else if (actionBtn.dataset.action === 'delete') {
    const item = items.find((i) => String(i.id) === String(id));
    const message = item
      ? `¿Eliminar la entrevista de "${postulanteName(item.postulante)}"?\nEsta acción no se puede deshacer.`
      : '¿Eliminar esta entrevista?';
    const confirmed = await askConfirm({ dialog: deleteDialog, message });
    if (confirmed) {
      try {
        await remove(id);
        await load();
      } catch {
        /* error ya notificado */
      }
    }
  }
});

// ── Instancia CRUD + carga inicial ─────────────────────────────────
const { load, create, update, remove } = useCrud({
  service,
  onList: render,
  onError: showError,
});

(async function init() {
  if (loadingEl) loadingEl.hidden = false;
  await loadCatalogs();
  await load();
})();