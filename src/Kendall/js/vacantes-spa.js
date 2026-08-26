/* Vacantes SPA module — Kendall (adaptado para SPA unificado) */
import { showToast, toastSuccess, toastError } from '../../Aiden/js/toast.js';


const API_BASE = 'http://localhost:3000';
const RECURSO = 'vacantes';
const API_URL = `${API_BASE}/${RECURSO}`;

export class ApiError extends Error {
  constructor(mensaje, { tipo = 'servidor', status = null } = {}) {
    super(mensaje);
    this.name = 'ApiError';
    this.tipo = tipo;
    this.status = status;
  }
}

async function solicitar(url, opciones = {}) {
  let respuesta;
  try { respuesta = await fetch(url, opciones); }
  catch { throw new ApiError('No se pudo conectar con el servidor.', { tipo: 'conexion' }); }
  if (!respuesta.ok) throw new ApiError(`Error ${respuesta.status}.`, { tipo: 'servidor', status: respuesta.status });
  if (respuesta.status === 204) return null;
  try { return await respuesta.json(); } catch { return null; }
}

export async function obtenerVacantes(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.q) params.set('q', filtros.q);
  if (filtros.estado) params.set('estado', filtros.estado);
  const qs = params.toString();
  return solicitar(qs ? `${API_URL}?${qs}` : API_URL);
}

export async function obtenerVacantePorId(id) { return solicitar(`${API_URL}/${id}`); }
export async function crearVacante(v) { return solicitar(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) }); }
export async function actualizarVacantePUT(id, v) { return solicitar(`${API_URL}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) }); }
export async function actualizarVacantePATCH(id, data) { return solicitar(`${API_URL}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
export async function eliminarVacante(id) { return solicitar(`${API_URL}/${id}`, { method: 'DELETE' }); }

const ESTADOS = ['activa', 'pausada', 'cerrada'];
const TIPOS = ['Tiempo completo', 'Medio tiempo', 'Freelance', 'Prácticas'];

function escapeHtml(v) { return v == null ? '' : String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escapeAttr(v) { return v == null ? '' : String(v).replace(/"/g,'&quot;'); }
function badgeClass(estado) {
  switch(estado) {
    case 'activa': return 'badge badge--activa';
    case 'pausada': return 'badge badge--pausada';
    case 'cerrada': return 'badge badge--cerrada';
    default: return 'badge';
  }
}

export function renderVacantes(container) {
  const state = { vacantes: [], filtros: { q: '', estado: '' } };

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-header__title">Vacantes</h1>
        <p class="page-header__subtitle">Administra las vacantes publicadas: crea, edita, filtra y da seguimiento al estado de cada oportunidad laboral.</p>
      </div>
      <button class="btn btn-primary" id="btn-nueva-vacante">+ Nueva vacante</button>
    </div>
    <div class="toolbar">
      <div class="toolbar__search">
        <span class="toolbar__search-icon">🔎</span>
        <input type="text" id="input-busqueda" placeholder="Buscar por título, empresa o ubicación...">
      </div>
      <div class="toolbar__filter">
        <select id="filtro-estado">
          <option value="">Todos los estados</option>
          ${ESTADOS.map(e => `<option value="${e}">${e}</option>`).join('')}
        </select>
      </div>
      <button class="toolbar__clear" id="btn-limpiar">Limpiar filtros</button>
    </div>
    <div id="vacantes-resultado"></div>`;

  const resultado = container.querySelector('#vacantes-resultado');
  const inputBusqueda = container.querySelector('#input-busqueda');
  const filtroEstado = container.querySelector('#filtro-estado');

  container.querySelector('#btn-nueva-vacante').onclick = () => abrirCrear();
  container.querySelector('#btn-limpiar').onclick = () => {
    state.filtros = { q: '', estado: '' };
    inputBusqueda.value = '';
    filtroEstado.value = '';
    cargar();
  };

  let debounceId = null;
  inputBusqueda.oninput = () => {
    clearTimeout(debounceId);
    debounceId = setTimeout(() => { state.filtros.q = inputBusqueda.value.trim(); cargar(); }, 300);
  };
  filtroEstado.onchange = () => { state.filtros.estado = filtroEstado.value; cargar(); };

  async function cargar() {
    resultado.innerHTML = '<div class="state-panel"><div class="spinner"></div><div class="state-panel__title">Cargando...</div></div>';
    try {
      state.vacantes = await obtenerVacantes(state.filtros) || [];
      renderTabla();
    } catch (e) {
      resultado.innerHTML = `<div class="state-panel"><div class="state-panel__icon">⚠️</div><div class="state-panel__title">Error</div><div class="state-panel__text">${e.message || 'Verifica que JSON Server esté corriendo.'}</div></div>`;
    }
  }

  function renderTabla() {
    if (state.vacantes.length === 0) {
      resultado.innerHTML = '<div class="state-panel"><div class="state-panel__icon">💼</div><div class="state-panel__title">No hay vacantes</div><div class="state-panel__text">Crea una nueva vacante o ajusta los filtros.</div></div>';
      return;
    }
    resultado.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>Título</th><th>Empresa</th><th>Ubicación</th><th>Salario</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            ${state.vacantes.map(v => `
              <tr>
                <td data-label="ID" class="data-table__id">#${v.id}</td>
                <td data-label="Título" class="data-table__title">${escapeHtml(v.titulo)}</td>
                <td data-label="Empresa">${escapeHtml(v.empresa)}</td>
                <td data-label="Ubicación">${escapeHtml(v.ubicacion)}</td>
                <td data-label="Salario">${escapeHtml(v.salario)}</td>
                <td data-label="Tipo">${escapeHtml(v.tipo)}</td>
                <td data-label="Estado" style="display:flex;flex-direction:column;gap:6px;">
                  <span class="${badgeClass(v.estado)}">${v.estado}</span>
                  <select class="status-select" data-id="${v.id}">
                    ${ESTADOS.map(e => `<option value="${e}" ${e === v.estado ? 'selected' : ''}>${e}</option>`).join('')}
                  </select>
                </td>
                <td data-label="Acciones" class="data-table__actions">
                  <button class="btn btn-secondary btn-sm" data-action="ver" data-id="${v.id}">Ver</button>
                  <button class="btn btn-secondary btn-sm" data-action="editar" data-id="${v.id}">Editar</button>
                  <button class="btn btn-danger btn-sm" data-action="eliminar" data-id="${v.id}">Eliminar</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    resultado.querySelectorAll('.status-select').forEach(sel => {
      sel.onchange = async () => {
        try {
          await actualizarVacantePATCH(sel.dataset.id, { estado: sel.value });
          toastSuccess('Estado actualizado.');
          await cargar();
        } catch (e) { toastError('Error al cambiar estado.'); }
      };
    });
    resultado.querySelectorAll('[data-action="ver"]').forEach(btn => {
      btn.onclick = () => verDetalle(btn.dataset.id);
    });
    resultado.querySelectorAll('[data-action="editar"]').forEach(btn => {
      btn.onclick = () => abrirEditar(btn.dataset.id);
    });
    resultado.querySelectorAll('[data-action="eliminar"]').forEach(btn => {
      btn.onclick = () => confirmarEliminar(btn.dataset.id);
    });
  }

  async function verDetalle(id) {
    try {
      const v = await obtenerVacantePorId(id);
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay active';
      overlay.innerHTML = `
        <div class="modal-card">
          <div class="modal-card__header">
            <h3 class="modal-card__title">Detalle de Vacante</h3>
            <button class="modal-card__close">✕</button>
          </div>
          <div class="modal-card__body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="form-field form-field--full"><label>Título</label><div style="font-size:15px;font-weight:600;">${escapeHtml(v.titulo)}</div></div>
              <div class="form-field form-field--full"><label>Descripción</label><div>${escapeHtml(v.descripcion)}</div></div>
              <div class="form-field"><label>Empresa</label><div>${escapeHtml(v.empresa)}</div></div>
              <div class="form-field"><label>Ubicación</label><div>${escapeHtml(v.ubicacion)}</div></div>
              <div class="form-field"><label>Salario</label><div>${escapeHtml(v.salario)}</div></div>
              <div class="form-field"><label>Tipo</label><div>${escapeHtml(v.tipo)}</div></div>
              <div class="form-field"><label>Estado</label><span class="${badgeClass(v.estado)}">${v.estado}</span></div>
            </div>
          </div>
          <div class="modal-card__footer">
            <button class="btn btn-primary" data-accion="cerrar">Cerrar</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
      const close = () => overlay.remove();
      overlay.querySelector('.modal-card__close').onclick = close;
      overlay.querySelector('[data-accion="cerrar"]').onclick = close;
      overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    } catch (e) { toastError('Error al cargar detalle.'); }
  }

  function abrirCrear() { openFormModal('crear'); }
  async function abrirEditar(id) {
    try { const v = await obtenerVacantePorId(id); openFormModal('editar', v); }
    catch { toastError('Error al cargar vacante.'); }
  }

  function openFormModal(modo, vacante = null) {
    const d = modo === 'editar' && vacante ? vacante : {};
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-card__header">
          <h3 class="modal-card__title">${modo === 'editar' ? 'Editar Vacante' : 'Nueva Vacante'}</h3>
          <button class="modal-card__close">✕</button>
        </div>
        <div class="modal-card__body">
          <form id="vacante-form" class="form-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-field form-field--full">
              <label>Título *</label>
              <input type="text" name="titulo" value="${escapeAttr(d.titulo || '')}" required>
            </div>
            <div class="form-field form-field--full">
              <label>Descripción *</label>
              <textarea name="descripcion" rows="3" required>${d.descripcion || ''}</textarea>
            </div>
            <div class="form-field">
              <label>Empresa *</label>
              <input type="text" name="empresa" value="${escapeAttr(d.empresa || '')}" required>
            </div>
            <div class="form-field">
              <label>Ubicación *</label>
              <input type="text" name="ubicacion" value="${escapeAttr(d.ubicacion || '')}" required>
            </div>
            <div class="form-field">
              <label>Salario</label>
              <input type="text" name="salario" value="${escapeAttr(d.salario || '')}">
            </div>
            <div class="form-field">
              <label>Tipo</label>
              <select name="tipo">
                <option value="">Seleccionar</option>
                ${TIPOS.map(t => `<option value="${t}" ${d.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}
              </select>
            </div>
            <div class="form-field">
              <label>Estado</label>
              <select name="estado">
                ${ESTADOS.map(e => `<option value="${e}" ${d.estado === e ? 'selected' : ''}>${e}</option>`).join('')}
              </select>
            </div>
          </form>
        </div>
        <div class="modal-card__footer">
          <button class="btn btn-secondary" data-accion="cancelar">Cancelar</button>
          <button class="btn btn-primary" data-accion="guardar" form="vacante-form">${modo === 'editar' ? 'Guardar' : 'Crear'}</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.modal-card__close').onclick = close;
    overlay.querySelector('[data-accion="cancelar"]').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    overlay.querySelector('[data-accion="guardar"]').onclick = async () => {
      const form = overlay.querySelector('#vacante-form');
      const fd = new FormData(form);
      const data = {
        titulo: fd.get('titulo').trim(),
        descripcion: fd.get('descripcion').trim(),
        empresa: fd.get('empresa').trim(),
        ubicacion: fd.get('ubicacion').trim(),
        salario: fd.get('salario').trim(),
        tipo: fd.get('tipo'),
        estado: fd.get('estado') || 'activa'
      };
      if (!data.titulo || !data.descripcion || !data.empresa || !data.ubicacion) {
        showToast('Título, descripción, empresa y ubicación son obligatorios.', 'error');
        return;
      }
      try {
        if (modo === 'editar') await actualizarVacantePUT(vacante.id, data);
        else await crearVacante(data);
        toastSuccess(modo === 'editar' ? 'Vacante actualizada.' : 'Vacante creada.');
        close();
        await cargar();
      } catch (e) { toastError('Error al guardar.'); }
    };
  }

  async function confirmarEliminar(id) {
    const v = state.vacantes.find(x => x.id === Number(id));
    if (!confirm(`¿Eliminar la vacante "${v?.titulo}"?`)) return;
    try {
      await eliminarVacante(id);
      toastSuccess('Vacante eliminada.');
      await cargar();
    } catch (e) { toastError('Error al eliminar.'); }
  }

  cargar();
}
