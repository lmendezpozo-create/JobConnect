/**
 * Controlador de Interfaz: Módulo de Postulaciones
 * Importa los métodos asíncronos del servicio y gestiona el DOM
 */

import { 
    getPostulaciones, 
    createPostulacion, 
    updatePostulacion, 
    deletePostulacion 
} from '../../Services/postulacionesService.js';

// Estado de la aplicación
let state = {
    allPostulaciones: [],
    filteredPostulaciones: [],
    currentPage: 1,
    itemsPerPage: 3 // Exacto a la maqueta (3 tarjetas por página)
};

// Elementos del DOM
const elements = {
    cardsGrid: document.getElementById('cards-grid'),
    searchInput: document.getElementById('search-input'),
    statusFilter: document.getElementById('status-filter'),
    kpiTotal: document.getElementById('kpi-total'),
    kpiRevision: document.getElementById('kpi-revision'),
    kpiEntrevistas: document.getElementById('kpi-entrevistas'),
    kpiAceptados: document.getElementById('kpi-aceptados'),
    paginationInfo: document.getElementById('pagination-info'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    
    // Modal
    modalOverlay: document.getElementById('postulacion-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalForm: document.getElementById('postulacion-form'),
    btnAbrirModal: document.getElementById('btn-abrir-modal'),
    btnCerrarModal: document.getElementById('btn-cerrar-modal'),
    btnCancelarModal: document.getElementById('btn-cancelar-modal'),
    btnPostJob: document.getElementById('btn-post-job'),
    
    // Campos Formulario
    formId: document.getElementById('form-id'),
    formNombre: document.getElementById('form-nombre'),
    formEmpresa: document.getElementById('form-empresa'),
    formCargo: document.getElementById('form-cargo'),
    formEmail: document.getElementById('form-email'),
    formEstado: document.getElementById('form-estado'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

/**
 * Inicializar la vista
 */
async function init() {
    setupEventListeners();
    await fetchAndRenderData();
}

/**
 * Cargar datos asíncronos usando el servicio fetch y renderizar
 */
async function fetchAndRenderData() {
    try {
        state.allPostulaciones = await getPostulaciones();
        updateKPIs(state.allPostulaciones);
        applyFilters();
    } catch (error) {
        showToast('Error al cargar postulaciones', true);
        console.error(error);
    }
}

/**
 * Actualizar los 4 contadores KPI superiores
 */
function updateKPIs(data) {
    elements.kpiTotal.textContent = data.length;
    
    const countRevision = data.filter(item => item.estado === 'En revisión').length;
    const countEntrevistas = data.filter(item => item.estado === 'Entrevista').length;
    const countAceptados = data.filter(item => item.estado === 'Aceptado').length;

    elements.kpiRevision.textContent = countRevision;
    elements.kpiEntrevistas.textContent = countEntrevistas;
    elements.kpiAceptados.textContent = countAceptados;
}

/**
 * Aplicar filtro de búsqueda y filtro por estado
 */
function applyFilters() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const selectedStatus = elements.statusFilter.value;

    state.filteredPostulaciones = state.allPostulaciones.filter(item => {
        const matchSearch = 
            (item.nombre && item.nombre.toLowerCase().includes(searchTerm)) ||
            (item.empresa && item.empresa.toLowerCase().includes(searchTerm)) ||
            (item.cargo && item.cargo.toLowerCase().includes(searchTerm)) ||
            (item.email && item.email.toLowerCase().includes(searchTerm));

        const matchStatus = (selectedStatus === 'Todos') || (item.estado === selectedStatus);

        return matchSearch && matchStatus;
    });

    state.currentPage = 1;
    renderGrid();
}

/**
 * Renderizar la cuadrícula de tarjetas de la página actual
 */
function renderGrid() {
    const totalItems = state.filteredPostulaciones.length;
    
    if (totalItems === 0) {
        elements.cardsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b; background: white; border-radius: 16px;">
                <p style="font-size: 16px; font-weight: 600;">No se encontraron postulaciones</p>
                <p style="font-size: 14px; margin-top: 4px;">Intenta cambiar los términos de búsqueda o filtros.</p>
            </div>
        `;
        renderPagination(0, 0, 0);
        return;
    }

    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = Math.min(startIndex + state.itemsPerPage, totalItems);
    const paginatedItems = state.filteredPostulaciones.slice(startIndex, endIndex);

    elements.cardsGrid.innerHTML = paginatedItems.map(item => createCardHTML(item)).join('');
    renderPagination(startIndex + 1, endIndex, totalItems);
}

/**
 * Generar el HTML semántico de cada tarjeta de candidato
 */
function createCardHTML(item) {
    const statusClass = item.estado ? item.estado.replace(/\s+/g, '-') : 'Pendiente';
    const iniciales = item.iniciales || (item.nombre ? item.nombre.substring(0, 2).toUpperCase() : 'CN');

    return `
        <div class="candidate-card" data-id="${item.id}">
            <!-- Menú de acciones en la tarjeta (Editar / Eliminar) -->
            <div class="card-actions-menu">
                <button class="btn-card-action btn-edit" title="Editar" onclick="window.editarPostulacion('${item.id}')">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="btn-card-action btn-delete" title="Eliminar" onclick="window.eliminarPostulacion('${item.id}')">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>

            <div class="candidate-header">
                <div class="avatar-circle">${iniciales}</div>
                <div class="candidate-info">
                    <h3 class="candidate-name">${escapeHTML(item.nombre || 'Sin nombre')}</h3>
                    <p class="candidate-company">${escapeHTML(item.empresa || 'Empresa')}</p>
                </div>
            </div>

            <div class="candidate-details">
                <div class="detail-item role">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span>${escapeHTML(item.cargo || 'Cargo')}</span>
                </div>
                <div class="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>${escapeHTML(item.email || 'correo@email.com')}</span>
                </div>
                <div class="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${escapeHTML(item.fecha || 'Fecha')}</span>
                </div>
            </div>

            <div class="candidate-footer">
                <span class="badge-status ${statusClass}">${escapeHTML(item.estado || 'Pendiente')}</span>
            </div>
        </div>
    `;
}

/**
 * Actualizar barra de paginación
 */
function renderPagination(start, end, total) {
    if (total === 0) {
        elements.paginationInfo.textContent = 'Mostrando 0 de 0';
        elements.btnPrev.disabled = true;
        elements.btnNext.disabled = true;
        return;
    }

    elements.paginationInfo.textContent = `Mostrando ${start}-${end} de ${total}`;
    elements.btnPrev.disabled = state.currentPage === 1;
    elements.btnNext.disabled = end >= total;
}

/**
 * Configurar los listeners de eventos
 */
function setupEventListeners() {
    // Filtros en tiempo real
    elements.searchInput.addEventListener('input', applyFilters);
    elements.statusFilter.addEventListener('change', applyFilters);

    // Paginación
    elements.btnPrev.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderGrid();
        }
    });

    elements.btnNext.addEventListener('click', () => {
        const maxPage = Math.ceil(state.filteredPostulaciones.length / state.itemsPerPage);
        if (state.currentPage < maxPage) {
            state.currentPage++;
            renderGrid();
        }
    });

    // Abrir Modal Crear
    elements.btnAbrirModal.addEventListener('click', () => abrirModal());
    elements.btnPostJob.addEventListener('click', () => abrirModal());

    // Cerrar Modal
    elements.btnCerrarModal.addEventListener('click', cerrarModal);
    elements.btnCancelarModal.addEventListener('click', cerrarModal);
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) cerrarModal();
    });

    // Guardar / Enviar Formulario
    elements.modalForm.addEventListener('submit', guardarPostulacion);
}

/**
 * Abrir Modal (Modo Crear o Editar)
 */
function abrirModal(postulacion = null) {
    elements.modalForm.reset();
    
    if (postulacion) {
        elements.modalTitle.textContent = 'Editar Postulación';
        elements.formId.value = postulacion.id;
        elements.formNombre.value = postulacion.nombre;
        elements.formEmpresa.value = postulacion.empresa;
        elements.formCargo.value = postulacion.cargo;
        elements.formEmail.value = postulacion.email;
        elements.formEstado.value = postulacion.estado;
    } else {
        elements.modalTitle.textContent = 'Nueva Postulación';
        elements.formId.value = '';
    }

    elements.modalOverlay.classList.add('active');
}

/**
 * Cerrar Modal
 */
function cerrarModal() {
    elements.modalOverlay.classList.remove('active');
}

/**
 * Manejar submit del formulario (POST o PATCH asíncrono)
 */
async function guardarPostulacion(e) {
    e.preventDefault();

    const id = elements.formId.value;
    const datos = {
        nombre: elements.formNombre.value.trim(),
        empresa: elements.formEmpresa.value.trim(),
        cargo: elements.formCargo.value.trim(),
        email: elements.formEmail.value.trim(),
        estado: elements.formEstado.value
    };

    try {
        if (id) {
            // PATCH / PUT
            await updatePostulacion(id, datos);
            showToast('Postulación actualizada correctamente');
        } else {
            // POST
            await createPostulacion(datos);
            showToast('Nueva postulación agregada con éxito');
        }

        cerrarModal();
        await fetchAndRenderData();
    } catch (error) {
        console.error(error);
        showToast('Error al guardar la postulación', true);
    }
}

/**
 * Funciones globales para botones onclick en las tarjetas
 */
window.editarPostulacion = function(id) {
    const item = state.allPostulaciones.find(p => String(p.id) === String(id));
    if (item) {
        abrirModal(item);
    }
};

window.eliminarPostulacion = async function(id) {
    const item = state.allPostulaciones.find(p => String(p.id) === String(id));
    const nombre = item ? item.nombre : 'esta postulación';

    if (confirm(`¿Estás seguro de eliminar la postulación de ${nombre}?`)) {
        try {
            await deletePostulacion(id);
            showToast('Postulación eliminada');
            await fetchAndRenderData();
        } catch (error) {
            console.error(error);
            showToast('Error al eliminar la postulación', true);
        }
    }
};

/**
 * Mostrar mensaje toast flotante
 */
function showToast(mensaje, isError = false) {
    elements.toastMessage.textContent = mensaje;
    elements.toast.style.backgroundColor = isError ? '#ef4444' : '#293850';
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

/**
 * Helper para escapar HTML
 */
function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', init);
