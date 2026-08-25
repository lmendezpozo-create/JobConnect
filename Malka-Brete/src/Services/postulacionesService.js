/**
 * Service: PostulacionesService
 * Manejo de peticiones asíncronas con Fetch API, Async/Await, Export/Import
 * Consume el endpoint http://localhost:3000/postulaciones de json-server.
 */

const API_URL = 'http://localhost:3000/postulaciones';

// Datos iniciales de demostración en memoria por si el servidor local de db.json no se encuentra corriendo
const INITIAL_DEMO_DATA = [
    { id: "1", nombre: "María Rodríguez", empresa: "TechCorp Inc.", cargo: "Senior Frontend Dev", email: "m.rodriguez@email.com", fecha: "12 Oct 2023", estado: "Entrevista", iniciales: "MR" },
    { id: "2", nombre: "Juan Gómez", empresa: "Creative Studio", cargo: "UX Designer", email: "juan.g@email.com", fecha: "10 Oct 2023", estado: "Pendiente", iniciales: "JG" },
    { id: "3", nombre: "Ana López", empresa: "Innova Global", cargo: "Product Manager", email: "ana.lopez@email.com", fecha: "08 Oct 2023", estado: "En revisión", iniciales: "AL" },
    { id: "4", nombre: "Carlos Mendoza", empresa: "DataPulse AI", cargo: "Backend Engineer", email: "carlos.m@datapulse.io", fecha: "05 Oct 2023", estado: "En revisión", iniciales: "CM" },
    { id: "5", nombre: "Sofía Martínez", empresa: "CloudScale Solutions", cargo: "DevOps Architect", email: "sofia.m@cloudscale.com", fecha: "04 Oct 2023", estado: "Entrevista", iniciales: "SM" },
    { id: "6", nombre: "Diego Fernández", empresa: "FinTech Prime", cargo: "Fullstack Developer", email: "diego.f@fintechprime.com", fecha: "02 Oct 2023", estado: "Aceptado", iniciales: "DF" },
    { id: "7", nombre: "Elena Torres", empresa: "CyberGuard", cargo: "Security Analyst", email: "elena.t@cyberguard.net", fecha: "01 Oct 2023", estado: "En revisión", iniciales: "ET" },
    { id: "8", nombre: "Gabriel Ruiz", empresa: "AppNation", cargo: "Mobile Developer (iOS/Android)", email: "gabriel.r@appnation.org", fecha: "29 Sep 2023", estado: "Entrevista", iniciales: "GR" },
    { id: "9", nombre: "Lucía Morales", empresa: "Nexus Media", cargo: "UI/UX Researcher", email: "lucia.m@nexus.com", fecha: "28 Sep 2023", estado: "En revisión", iniciales: "LM" },
    { id: "10", nombre: "Mateo Silva", empresa: "BioTech Labs", cargo: "Data Scientist", email: "mateo.s@biotech.com", fecha: "25 Sep 2023", estado: "Aceptado", iniciales: "MS" },
    { id: "11", nombre: "Valeria Navarro", empresa: "LogiTech Logistics", cargo: "QA Automation Lead", email: "valeria.n@logitech.io", fecha: "24 Sep 2023", estado: "En revisión", iniciales: "VN" },
    { id: "12", nombre: "Andrés Castro", empresa: "SmartCity Inc.", cargo: "Embedded Systems Engineer", email: "andres.c@smartcity.org", fecha: "22 Sep 2023", estado: "Entrevista", iniciales: "AC" },
    { id: "13", nombre: "Camila Herrera", empresa: "Vanguard Tech", cargo: "Scrum Master", email: "camila.h@vanguard.com", fecha: "20 Sep 2023", estado: "Pendiente", iniciales: "CH" },
    { id: "14", nombre: "Javier Ortega", empresa: "OmniChannel Retail", cargo: "E-Commerce Specialist", email: "javier.o@omnichannel.com", fecha: "18 Sep 2023", estado: "Rechazado", iniciales: "JO" },
    { id: "15", nombre: "Isabel Vargas", empresa: "Hyperion Gaming", cargo: "3D Generalist", email: "isabel.v@hyperion.io", fecha: "15 Sep 2023", estado: "En revisión", iniciales: "IV" },
    { id: "16", nombre: "Fernando Reyes", empresa: "GreenEnergy Corp", cargo: "Data Engineer", email: "fernando.r@greenenergy.com", fecha: "14 Sep 2023", estado: "Pendiente", iniciales: "FR" },
    { id: "17", nombre: "Paula Benítez", empresa: "HealthPulse", cargo: "Frontend Engineer (React)", email: "paula.b@healthpulse.org", fecha: "12 Sep 2023", estado: "En revisión", iniciales: "PB" },
    { id: "18", nombre: "Rodrigo Acosta", empresa: "CloudScale Solutions", cargo: "Site Reliability Engineer", email: "rodrigo.a@cloudscale.com", fecha: "10 Sep 2023", estado: "Entrevista", iniciales: "RA" },
    { id: "19", nombre: "Daniela Ramos", empresa: "TechCorp Inc.", cargo: "Systems Analyst", email: "daniela.r@techcorp.com", fecha: "08 Sep 2023", estado: "Pendiente", iniciales: "DR" },
    { id: "20", nombre: "Hugo Blanco", empresa: "Innova Global", cargo: "Cloud Solutions Architect", email: "hugo.b@innovaglobal.com", fecha: "05 Sep 2023", estado: "Aceptado", iniciales: "HB" },
    { id: "21", nombre: "Beatriz Guerrero", empresa: "Creative Studio", cargo: "Graphic & Brand Designer", email: "beatriz.g@creativestudio.com", fecha: "03 Sep 2023", estado: "En revisión", iniciales: "BG" },
    { id: "22", nombre: "Sebastián Paredes", empresa: "FinTech Prime", cargo: "Blockchain Developer", email: "seb.p@fintechprime.com", fecha: "01 Sep 2023", estado: "Pendiente", iniciales: "SP" },
    { id: "23", nombre: "Carmen Molina", empresa: "DataPulse AI", cargo: "AI Prompt Engineer", email: "carmen.m@datapulse.io", fecha: "30 Aug 2023", estado: "Rechazado", iniciales: "CM" },
    { id: "24", nombre: "Esteban Rios", empresa: "AppNation", cargo: "Android Lead Developer", email: "esteban.r@appnation.org", fecha: "28 Aug 2023", estado: "Pendiente", iniciales: "ER" },
    { id: "25", nombre: "Adriana Gil", empresa: "Vanguard Tech", cargo: "Product Designer", email: "adriana.g@vanguard.com", fecha: "25 Aug 2023", estado: "Rechazado", iniciales: "AG" }
];

const LOCAL_STORAGE_KEY = 'jobconnect_postulaciones_standalone_cache';

/**
 * Obtener la lista completa de postulaciones
 * @returns {Promise<Array>}
 */
export async function getPostulaciones() {
    try {
        // Intentar obtener desde la API de json-server
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            return data;
        }
        throw new Error('Endpoint API no disponible');
    } catch (error) {
        console.warn('postulacionesService GET (Servidor offline, utilizando dataset en memoria):', error.message);
        
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }

        // Si no hay cache, inicializar con el array de demostración en memoria
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
        return INITIAL_DEMO_DATA;
    }
}

/**
 * Crear una nueva postulación (POST)
 * @param {Object} nuevaPostulacion 
 * @returns {Promise<Object>}
 */
export async function createPostulacion(nuevaPostulacion) {
    if (!nuevaPostulacion.iniciales && nuevaPostulacion.nombre) {
        nuevaPostulacion.iniciales = nuevaPostulacion.nombre
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
    if (!nuevaPostulacion.fecha) {
        const today = new Date();
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        nuevaPostulacion.fecha = today.toLocaleDateString('es-ES', options);
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaPostulacion)
        });

        if (response.ok) {
            const created = await response.json();
            const currentCache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || JSON.stringify(INITIAL_DEMO_DATA));
            currentCache.unshift(created);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentCache));
            return created;
        }
        throw new Error('Error en POST al servidor');
    } catch (error) {
        console.warn('postulacionesService POST (Modo cliente):', error.message);
        
        const currentCache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || JSON.stringify(INITIAL_DEMO_DATA));
        const mockCreated = {
            id: String(Date.now()),
            ...nuevaPostulacion
        };
        currentCache.unshift(mockCreated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentCache));
        return mockCreated;
    }
}

/**
 * Actualizar una postulación existente (PATCH)
 * @param {string|number} id 
 * @param {Object} camposActualizados 
 * @returns {Promise<Object>}
 */
export async function updatePostulacion(id, camposActualizados) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(camposActualizados)
        });

        if (response.ok) {
            const updated = await response.json();
            const currentCache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || JSON.stringify(INITIAL_DEMO_DATA));
            const index = currentCache.findIndex(item => String(item.id) === String(id));
            if (index !== -1) {
                currentCache[index] = { ...currentCache[index], ...updated };
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentCache));
            }
            return updated;
        }
        throw new Error('Error en PATCH al servidor');
    } catch (error) {
        console.warn('postulacionesService PATCH (Modo cliente):', error.message);
        
        const currentCache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || JSON.stringify(INITIAL_DEMO_DATA));
        const index = currentCache.findIndex(item => String(item.id) === String(id));
        if (index !== -1) {
            currentCache[index] = { ...currentCache[index], ...camposActualizados };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentCache));
            return currentCache[index];
        }
        return { id, ...camposActualizados };
    }
}

/**
 * Eliminar una postulación (DELETE)
 * @param {string|number} id 
 * @returns {Promise<boolean>}
 */
export async function deletePostulacion(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok || response.status === 200 || response.status === 204) {
            const currentCache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || JSON.stringify(INITIAL_DEMO_DATA));
            const filtered = currentCache.filter(item => String(item.id) !== String(id));
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
            return true;
        }
        throw new Error('Error en DELETE al servidor');
    } catch (error) {
        console.warn('postulacionesService DELETE (Modo cliente):', error.message);
        
        const currentCache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || JSON.stringify(INITIAL_DEMO_DATA));
        const filtered = currentCache.filter(item => String(item.id) !== String(id));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        return true;
    }
}
