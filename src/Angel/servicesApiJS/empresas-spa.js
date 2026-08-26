/* Empresas SPA module — Angel (adaptado para json-server) */
import { showToast, toastSuccess, toastError } from '../../Aiden/js/toast.js';

const API_URL = 'http://localhost:3000/empresas';

function escapeHtml(v) { return v == null ? '' : String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

export function renderEmpresas(container) {
  let allEmpresas = [];

  function init() {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Empresas Clientes</h1>
          <p class="page-header__subtitle">Gestiona la información de las empresas clientes de JobConnect.</p>
        </div>
        <button class="btn btn-primary" id="btn-nueva-empresa">+ Nueva empresa</button>
      </div>
      <div class="toolbar">
        <div class="toolbar__search">
          <span class="toolbar__search-icon">🔎</span>
          <input type="text" id="empresa-search" placeholder="Buscar por nombre, sector o contacto...">
        </div>
        <button class="toolbar__clear" id="empresa-clear">Limpiar filtros</button>
      </div>
      <div id="empresas-content"></div>`;

    container.querySelector('#btn-nueva-empresa').onclick = () => openModal();
    container.querySelector('#empresa-clear').onclick = () => {
      container.querySelector('#empresa-search').value = '';
      renderTable();
    };
    container.querySelector('#empresa-search').oninput = () => renderTable();
    load();
  }

  async function load() {
    try {
      const r = await fetch(API_URL);
      if (!r.ok) throw new Error();
      allEmpresas = await r.json();
      renderTable();
    } catch (e) {
      toastError('Error al cargar empresas.');
    }
  }

  function renderTable() {
    const search = (container.querySelector('#empresa-search')?.value || '').toLowerCase().trim();
    const filtered = allEmpresas.filter(e => {
      return !search ||
        (e.nombre || '').toLowerCase().includes(search) ||
        (e.sector || '').toLowerCase().includes(search) ||
        (e.contacto || '').toLowerCase().includes(search);
    });

    const content = container.querySelector('#empresas-content');
    if (filtered.length === 0) {
      content.innerHTML = '<div class="state-panel"><div class="state-panel__icon">🏢</div><div class="state-panel__title">No hay empresas</div><div class="state-panel__text">Registra una nueva empresa cliente para comenzar.</div></div>';
      return;
    }

    content.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Contacto</th><th>Teléfono</th><th>Dirección</th><th>Sector</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            ${filtered.map(e => `
              <tr>
                <td data-label="ID" class="data-table__id">#${e.id}</td>
                <td data-label="Nombre" class="data-table__title">${escapeHtml(e.nombre)}</td>
                <td data-label="Contacto">${escapeHtml(e.contacto)}</td>
                <td data-label="Teléfono">${escapeHtml(e.telefono)}</td>
                <td data-label="Dirección">${escapeHtml(e.direccion)}</td>
                <td data-label="Sector"><span class="badge badge--info">${escapeHtml(e.sector)}</span></td>
                <td data-label="Acciones" class="data-table__actions">
                  <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${e.id}">Editar</button>
                  <button class="btn btn-danger btn-sm" data-action="delete" data-id="${e.id}">Eliminar</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    content.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.onclick = () => {
        const e = allEmpresas.find(x => x.id === Number(btn.dataset.id));
        if (e) openModal(e);
      };
    });
    content.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.onclick = () => confirmDelete(Number(btn.dataset.id));
    });
  }

  function openModal(empresa = null) {
    const isEdit = !!empresa;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-card__header">
          <h3 class="modal-card__title">${isEdit ? 'Editar Empresa' : 'Nueva Empresa'}</h3>
          <button class="modal-card__close">✕</button>
        </div>
        <div class="modal-card__body">
          <form id="empresa-form" class="form-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-field form-field--full">
              <label>Nombre *</label>
              <input type="text" name="nombre" value="${empresa?.nombre || ''}" required>
            </div>
            <div class="form-field">
              <label>Contacto (correo)</label>
              <input type="email" name="contacto" value="${empresa?.contacto || ''}">
            </div>
            <div class="form-field">
              <label>Teléfono</label>
              <input type="text" name="telefono" value="${empresa?.telefono || ''}">
            </div>
            <div class="form-field form-field--full">
              <label>Dirección</label>
              <input type="text" name="direccion" value="${empresa?.direccion || ''}">
            </div>
            <div class="form-field">
              <label>Sector</label>
              <input type="text" name="sector" value="${empresa?.sector || ''}" placeholder="Ej: Tecnología">
            </div>
          </form>
        </div>
        <div class="modal-card__footer">
          <button class="btn btn-secondary" data-accion="cancelar">Cancelar</button>
          <button class="btn btn-primary" data-accion="guardar" form="empresa-form">${isEdit ? 'Guardar' : 'Crear'}</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.modal-card__close').onclick = close;
    overlay.querySelector('[data-accion="cancelar"]').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    overlay.querySelector('[data-accion="guardar"]').onclick = async () => {
      const fd = new FormData(overlay.querySelector('#empresa-form'));
      const data = {
        nombre: fd.get('nombre').trim(),
        contacto: fd.get('contacto').trim(),
        telefono: fd.get('telefono').trim(),
        direccion: fd.get('direccion').trim(),
        sector: fd.get('sector').trim()
      };
      if (!data.nombre) {
        showToast('El nombre es obligatorio.', 'error');
        return;
      }
      try {
        const url = isEdit ? `${API_URL}/${empresa.id}` : API_URL;
        const method = isEdit ? 'PUT' : 'POST';
        const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error();
        toastSuccess(isEdit ? 'Empresa actualizada.' : 'Empresa creada.');
        close();
        await load();
      } catch { toastError('Error al guardar.'); }
    };
  }

  async function confirmDelete(id) {
    const e = allEmpresas.find(x => x.id === id);
    if (!confirm(`¿Eliminar la empresa "${e?.nombre}"?`)) return;
    try {
      const r = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
      toastSuccess('Empresa eliminada.');
      await load();
    } catch { toastError('Error al eliminar.'); }
  }

  init();
}
