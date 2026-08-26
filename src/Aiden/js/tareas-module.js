/* Tareas module — Aiden */
import { CONFIG } from './config.js';
import { showToast, toastSuccess, toastError } from './toast.js';

export function renderTareas(container) {
  let allTareas = [];

  function init() {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Tareas</h1>
          <p class="page-header__subtitle">Administra las tareas asignadas a los reclutadores del equipo.</p>
        </div>
        <button class="btn btn-primary" id="btn-nueva">+ Nueva tarea</button>
      </div>
      <div class="toolbar">
        <div class="toolbar__search">
          <span class="toolbar__search-icon">🔎</span>
          <input type="text" id="search" placeholder="Buscar por título o responsable...">
        </div>
        <div class="toolbar__filter">
          <select id="filter-prioridad">
            <option value="">Todas las prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
        <div class="toolbar__filter">
          <select id="filter-estado">
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En progreso">En progreso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>
        <button class="toolbar__clear" id="btn-clear">Limpiar filtros</button>
      </div>
      <div id="tareas-content"></div>`;

    container.querySelector('#btn-nueva').onclick = () => openModal();
    container.querySelector('#btn-clear').onclick = () => {
      container.querySelector('#search').value = '';
      container.querySelector('#filter-prioridad').value = '';
      container.querySelector('#filter-estado').value = '';
      renderTable();
    };
    container.querySelector('#search').oninput = () => renderTable();
    container.querySelector('#filter-prioridad').onchange = () => renderTable();
    container.querySelector('#filter-estado').onchange = () => renderTable();
    load();
  }

  async function load() {
    try {
      const r = await fetch(`${CONFIG.API_BASE_URL}/tareas`);
      if (!r.ok) throw new Error();
      allTareas = await r.json();
      renderTable();
    } catch (e) {
      toastError('Error al cargar tareas.');
    }
  }

  function renderTable() {
    const search = (container.querySelector('#search')?.value || '').toLowerCase().trim();
    const prioridad = container.querySelector('#filter-prioridad')?.value || '';
    const estado = container.querySelector('#filter-estado')?.value || '';
    const filtered = allTareas.filter(t => {
      const matchSearch = !search ||
        (t.titulo || '').toLowerCase().includes(search) ||
        (t.asignadoA || '').toLowerCase().includes(search);
      const matchP = !prioridad || t.prioridad === prioridad;
      const matchE = !estado || t.estado === estado;
      return matchSearch && matchP && matchE;
    });

    const content = container.querySelector('#tareas-content');
    if (filtered.length === 0) {
      content.innerHTML = '<div class="state-panel"><div class="state-panel__icon">✅</div><div class="state-panel__title">No hay tareas</div><div class="state-panel__text">Crea una nueva tarea para comenzar.</div></div>';
      return;
    }

    content.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>Título</th><th>Asignado a</th><th>Fecha límite</th><th>Prioridad</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            ${filtered.map(t => `
              <tr>
                <td data-label="ID" class="data-table__id">#${t.id}</td>
                <td data-label="Título" class="data-table__title">${t.titulo}</td>
                <td data-label="Asignado a">${t.asignadoA || '—'}</td>
                <td data-label="Fecha límite">${t.fechaLimite || '—'}</td>
                <td data-label="Prioridad"><span class="badge badge--${(t.prioridad || '').toLowerCase()}">${t.prioridad || '—'}</span></td>
                <td data-label="Estado"><span class="badge badge--${(t.estado || '').toLowerCase().replace(/\s+/g, '_')}">${t.estado || '—'}</span></td>
                <td data-label="Acciones" class="data-table__actions">
                  <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${t.id}">Editar</button>
                  <button class="btn btn-danger btn-sm" data-action="delete" data-id="${t.id}">Eliminar</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    content.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.onclick = () => {
        const t = allTareas.find(x => x.id === Number(btn.dataset.id));
        if (t) openModal(t);
      };
    });
    content.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.onclick = () => confirmDelete(Number(btn.dataset.id));
    });
  }

  function openModal(tarea = null) {
    const isEdit = !!tarea;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-card__header">
          <h3 class="modal-card__title">${isEdit ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
          <button class="modal-card__close">✕</button>
        </div>
        <div class="modal-card__body">
          <form id="tarea-form" class="form-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-field form-field--full">
              <label>Título *</label>
              <input type="text" name="titulo" value="${tarea?.titulo || ''}" required>
            </div>
            <div class="form-field form-field--full">
              <label>Descripción</label>
              <textarea name="descripcion" rows="3">${tarea?.descripcion || ''}</textarea>
            </div>
            <div class="form-field">
              <label>Asignado a</label>
              <input type="text" name="asignadoA" value="${tarea?.asignadoA || ''}" placeholder="Nombre del reclutador">
            </div>
            <div class="form-field">
              <label>Fecha límite</label>
              <input type="date" name="fechaLimite" value="${tarea?.fechaLimite || ''}">
            </div>
            <div class="form-field">
              <label>Prioridad</label>
              <select name="prioridad">
                ${['Alta','Media','Baja'].map(p =>
                  `<option value="${p}" ${tarea?.prioridad === p ? 'selected' : ''}>${p}</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-field">
              <label>Estado</label>
              <select name="estado">
                ${['Pendiente','En progreso','Completada'].map(s =>
                  `<option value="${s}" ${tarea?.estado === s ? 'selected' : ''}>${s}</option>`
                ).join('')}
              </select>
            </div>
          </form>
        </div>
        <div class="modal-card__footer">
          <button class="btn btn-secondary" data-accion="cancelar">Cancelar</button>
          <button class="btn btn-primary" data-accion="guardar" form="tarea-form">${isEdit ? 'Guardar' : 'Crear'}</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.modal-card__close').onclick = close;
    overlay.querySelector('[data-accion="cancelar"]').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    overlay.querySelector('[data-accion="guardar"]').onclick = async () => {
      const form = overlay.querySelector('#tarea-form');
      const fd = new FormData(form);
      const data = {
        titulo: fd.get('titulo').trim(),
        descripcion: fd.get('descripcion').trim(),
        asignadoA: fd.get('asignadoA').trim(),
        fechaLimite: fd.get('fechaLimite'),
        prioridad: fd.get('prioridad'),
        estado: fd.get('estado')
      };
      if (!data.titulo) {
        showToast('El título es obligatorio.', 'error');
        return;
      }
      try {
        const url = isEdit ? `${CONFIG.API_BASE_URL}/tareas/${tarea.id}` : `${CONFIG.API_BASE_URL}/tareas`;
        const method = isEdit ? 'PUT' : 'POST';
        const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error();
        toastSuccess(isEdit ? 'Tarea actualizada.' : 'Tarea creada.');
        close();
        await load();
      } catch (e) {
        toastError('Error al guardar.');
      }
    };
  }

  async function confirmDelete(id) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      const r = await fetch(`${CONFIG.API_BASE_URL}/tareas/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
      toastSuccess('Tarea eliminada.');
      await load();
    } catch (e) {
      toastError('Error al eliminar.');
    }
  }

  init();
}
