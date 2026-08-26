/* Candidatos module — Aiden */
import { CONFIG } from './config.js';
import { showToast, toastSuccess, toastError } from './toast.js';

export function renderCandidatos(container) {
  let allCandidatos = [];

  function init() {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Candidatos</h1>
          <p class="page-header__subtitle">Gestiona la información de los candidatos registrados en el sistema.</p>
        </div>
        <button class="btn btn-primary" id="btn-nuevo">+ Nuevo candidato</button>
      </div>
      <div class="toolbar">
        <div class="toolbar__search">
          <span class="toolbar__search-icon">🔎</span>
          <input type="text" id="search" placeholder="Buscar por nombre, email o empresa...">
        </div>
        <div class="toolbar__filter">
          <select id="filter-status">
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="en_proceso">En proceso</option>
            <option value="contratado">Contratado</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <button class="toolbar__clear" id="btn-clear">Limpiar filtros</button>
      </div>
      <div id="candidatos-content"></div>`;

    container.querySelector('#btn-nuevo').onclick = () => openModal();
    container.querySelector('#btn-clear').onclick = () => {
      container.querySelector('#search').value = '';
      container.querySelector('#filter-status').value = '';
      renderTable();
    };
    container.querySelector('#search').oninput = () => renderTable();
    container.querySelector('#filter-status').onchange = () => renderTable();
    load();
  }

  async function load() {
    try {
      const r = await fetch(`${CONFIG.API_BASE_URL}/candidatos`);
      if (!r.ok) throw new Error('Error al cargar');
      allCandidatos = await r.json();
      renderTable();
    } catch (e) {
      toastError('No se pudieron cargar los candidatos.');
    }
  }

  function renderTable() {
    const search = (container.querySelector('#search')?.value || '').toLowerCase().trim();
    const status = container.querySelector('#filter-status')?.value || '';
    const filtered = allCandidatos.filter(c => {
      const matchSearch = !search ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) ||
        (c.email || '').toLowerCase().includes(search) ||
        (c.company || '').toLowerCase().includes(search);
      const matchStatus = !status || c.status === status;
      return matchSearch && matchStatus;
    });

    const content = container.querySelector('#candidatos-content');
    if (filtered.length === 0) {
      content.innerHTML = '<div class="state-panel"><div class="state-panel__icon">👤</div><div class="state-panel__title">No hay candidatos</div><div class="state-panel__text">Ajusta los filtros o agrega un nuevo candidato.</div></div>';
      return;
    }

    content.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Empresa</th><th>Puesto</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            ${filtered.map(c => `
              <tr>
                <td data-label="ID" class="data-table__id">#${c.id}</td>
                <td data-label="Nombre" class="data-table__title">${c.firstName} ${c.lastName}</td>
                <td data-label="Correo">${c.email}</td>
                <td data-label="Teléfono">${c.phone}</td>
                <td data-label="Empresa">${c.company}</td>
                <td data-label="Puesto">${c.role}</td>
                <td data-label="Estado"><span class="badge badge--${c.status}">${c.status}</span></td>
                <td data-label="Acciones" class="data-table__actions">
                  <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${c.id}">Editar</button>
                  <button class="btn btn-danger btn-sm" data-action="delete" data-id="${c.id}">Eliminar</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    content.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.onclick = () => {
        const c = allCandidatos.find(x => x.id === Number(btn.dataset.id));
        if (c) openModal(c);
      };
    });
    content.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.onclick = () => confirmDelete(Number(btn.dataset.id));
    });
  }

  function openModal(candidato = null) {
    const isEdit = !!candidato;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-card__header">
          <h3 class="modal-card__title">${isEdit ? 'Editar Candidato' : 'Nuevo Candidato'}</h3>
          <button class="modal-card__close">✕</button>
        </div>
        <div class="modal-card__body">
          <form id="candidato-form" class="form-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-field">
              <label>Nombre *</label>
              <input type="text" name="firstName" value="${candidato?.firstName || ''}" required>
            </div>
            <div class="form-field">
              <label>Apellido *</label>
              <input type="text" name="lastName" value="${candidato?.lastName || ''}" required>
            </div>
            <div class="form-field">
              <label>Correo *</label>
              <input type="email" name="email" value="${candidato?.email || ''}" required>
            </div>
            <div class="form-field">
              <label>Teléfono</label>
              <input type="text" name="phone" value="${candidato?.phone || ''}">
            </div>
            <div class="form-field">
              <label>Empresa</label>
              <input type="text" name="company" value="${candidato?.company || ''}">
            </div>
            <div class="form-field">
              <label>Puesto</label>
              <input type="text" name="role" value="${candidato?.role || ''}">
            </div>
            <div class="form-field form-field--full">
              <label>Estado</label>
              <select name="status">
                ${['activo','en_proceso','contratado','inactivo'].map(s =>
                  `<option value="${s}" ${candidato?.status === s ? 'selected' : ''}>${s}</option>`
                ).join('')}
              </select>
            </div>
          </form>
        </div>
        <div class="modal-card__footer">
          <button class="btn btn-secondary" data-accion="cancelar">Cancelar</button>
          <button class="btn btn-primary" data-accion="guardar" form="candidato-form">${isEdit ? 'Guardar cambios' : 'Crear candidato'}</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.modal-card__close').onclick = close;
    overlay.querySelector('[data-accion="cancelar"]').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    overlay.querySelector('[data-accion="guardar"]').onclick = async () => {
      const form = overlay.querySelector('#candidato-form');
      const fd = new FormData(form);
      const data = {
        firstName: fd.get('firstName').trim(),
        lastName: fd.get('lastName').trim(),
        email: fd.get('email').trim(),
        phone: fd.get('phone').trim(),
        company: fd.get('company').trim(),
        role: fd.get('role').trim(),
        status: fd.get('status')
      };
      if (!data.firstName || !data.lastName || !data.email) {
        showToast('Nombre, apellido y correo son obligatorios.', 'error');
        return;
      }
      try {
        const url = isEdit ? `${CONFIG.API_BASE_URL}/candidatos/${candidato.id}` : `${CONFIG.API_BASE_URL}/candidatos`;
        const method = isEdit ? 'PUT' : 'POST';
        const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error('Error del servidor');
        toastSuccess(isEdit ? 'Candidato actualizado.' : 'Candidato creado.');
        close();
        await load();
      } catch (e) {
        toastError('Error al guardar el candidato.');
      }
    };
  }

  async function confirmDelete(id) {
    const c = allCandidatos.find(x => x.id === id);
    if (!confirm(`¿Eliminar a ${c?.firstName} ${c?.lastName}?`)) return;
    try {
      const r = await fetch(`${CONFIG.API_BASE_URL}/candidatos/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
      toastSuccess('Candidato eliminado.');
      await load();
    } catch (e) {
      toastError('Error al eliminar.');
    }
  }

  init();
}
