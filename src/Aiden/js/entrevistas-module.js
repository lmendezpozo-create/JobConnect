/* Entrevistas module — Aiden */
import { CONFIG } from './config.js';
import { showToast, toastSuccess, toastError } from './toast.js';

export function renderEntrevistas(container) {
  let allEntrevistas = [];

  function init() {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Entrevistas</h1>
          <p class="page-header__subtitle">Programa y da seguimiento a las entrevistas de los candidatos.</p>
        </div>
        <button class="btn btn-primary" id="btn-nueva">+ Nueva entrevista</button>
      </div>
      <div class="toolbar">
        <div class="toolbar__search">
          <span class="toolbar__search-icon">🔎</span>
          <input type="text" id="search" placeholder="Buscar por candidato, tipo o notas...">
        </div>
        <div class="toolbar__filter">
          <select id="filter-estado">
            <option value="">Todos los estados</option>
            <option value="Programada">Programada</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        <button class="toolbar__clear" id="btn-clear">Limpiar filtros</button>
      </div>
      <div id="entrevistas-content"></div>`;

    container.querySelector('#btn-nueva').onclick = () => openModal();
    container.querySelector('#btn-clear').onclick = () => {
      container.querySelector('#search').value = '';
      container.querySelector('#filter-estado').value = '';
      renderTable();
    };
    container.querySelector('#search').oninput = () => renderTable();
    container.querySelector('#filter-estado').onchange = () => renderTable();
    load();
  }

  async function load() {
    try {
      const r = await fetch(`${CONFIG.API_BASE_URL}/entrevistas`);
      if (!r.ok) throw new Error();
      allEntrevistas = await r.json();
      renderTable();
    } catch (e) {
      toastError('Error al cargar entrevistas.');
    }
  }

  function renderTable() {
    const search = (container.querySelector('#search')?.value || '').toLowerCase().trim();
    const estado = container.querySelector('#filter-estado')?.value || '';
    const filtered = allEntrevistas.filter(e => {
      const matchSearch = !search ||
        (e.candidato || '').toLowerCase().includes(search) ||
        (e.tipo || '').toLowerCase().includes(search) ||
        (e.notas || '').toLowerCase().includes(search);
      const matchEstado = !estado || e.estado === estado;
      return matchSearch && matchEstado;
    });

    const content = container.querySelector('#entrevistas-content');
    if (filtered.length === 0) {
      content.innerHTML = '<div class="state-panel"><div class="state-panel__icon">📝</div><div class="state-panel__title">No hay entrevistas</div><div class="state-panel__text">Crea una nueva entrevista para comenzar.</div></div>';
      return;
    }

    content.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>Candidato</th><th>Fecha</th><th>Tipo</th><th>Estado</th><th>Resultado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            ${filtered.map(e => `
              <tr>
                <td data-label="ID" class="data-table__id">#${e.id}</td>
                <td data-label="Candidato" class="data-table__title">${e.candidato || '—'}</td>
                <td data-label="Fecha">${e.fecha ? new Date(e.fecha).toLocaleString('es-CR') : '—'}</td>
                <td data-label="Tipo"><span class="badge badge--${(e.tipo || '').toLowerCase()}">${e.tipo || '—'}</span></td>
                <td data-label="Estado"><span class="badge badge--${(e.estado || '').toLowerCase()}">${e.estado || '—'}</span></td>
                <td data-label="Resultado">${e.resultado || '—'}</td>
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
        const e = allEntrevistas.find(x => x.id === Number(btn.dataset.id));
        if (e) openModal(e);
      };
    });
    content.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.onclick = () => confirmDelete(Number(btn.dataset.id));
    });
  }

  function openModal(entrevista = null) {
    const isEdit = !!entrevista;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-card__header">
          <h3 class="modal-card__title">${isEdit ? 'Editar Entrevista' : 'Nueva Entrevista'}</h3>
          <button class="modal-card__close">✕</button>
        </div>
        <div class="modal-card__body">
          <form id="entrevista-form" class="form-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-field form-field--full">
              <label>Candidato *</label>
              <input type="text" name="candidato" value="${entrevista?.candidato || ''}" required placeholder="Nombre del candidato">
            </div>
            <div class="form-field">
              <label>Fecha y hora *</label>
              <input type="datetime-local" name="fecha" value="${entrevista?.fecha || ''}" required>
            </div>
            <div class="form-field">
              <label>Tipo</label>
              <select name="tipo">
                ${['Presencial','Virtual','Telefónica'].map(t =>
                  `<option value="${t}" ${entrevista?.tipo === t ? 'selected' : ''}>${t}</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-field">
              <label>Estado</label>
              <select name="estado">
                ${['Programada','Completada','Cancelada'].map(s =>
                  `<option value="${s}" ${entrevista?.estado === s ? 'selected' : ''}>${s}</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-field">
              <label>Resultado</label>
              <select name="resultado">
                ${['Pendiente','Aprobado','Rechazado'].map(r =>
                  `<option value="${r}" ${entrevista?.resultado === r ? 'selected' : ''}>${r}</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-field form-field--full">
              <label>Notas</label>
              <textarea name="notas" rows="3" placeholder="Observaciones de la entrevista...">${entrevista?.notas || ''}</textarea>
            </div>
          </form>
        </div>
        <div class="modal-card__footer">
          <button class="btn btn-secondary" data-accion="cancelar">Cancelar</button>
          <button class="btn btn-primary" data-accion="guardar" form="entrevista-form">${isEdit ? 'Guardar' : 'Crear'}</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.modal-card__close').onclick = close;
    overlay.querySelector('[data-accion="cancelar"]').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    overlay.querySelector('[data-accion="guardar"]').onclick = async () => {
      const form = overlay.querySelector('#entrevista-form');
      const fd = new FormData(form);
      const data = {
        candidato: fd.get('candidato').trim(),
        fecha: fd.get('fecha'),
        tipo: fd.get('tipo'),
        estado: fd.get('estado'),
        resultado: fd.get('resultado'),
        notas: fd.get('notas').trim()
      };
      if (!data.candidato || !data.fecha) {
        showToast('Candidato y fecha son obligatorios.', 'error');
        return;
      }
      try {
        const url = isEdit ? `${CONFIG.API_BASE_URL}/entrevistas/${entrevista.id}` : `${CONFIG.API_BASE_URL}/entrevistas`;
        const method = isEdit ? 'PUT' : 'POST';
        const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error();
        toastSuccess(isEdit ? 'Entrevista actualizada.' : 'Entrevista creada.');
        close();
        await load();
      } catch (e) {
        toastError('Error al guardar.');
      }
    };
  }

  async function confirmDelete(id) {
    if (!confirm('¿Eliminar esta entrevista?')) return;
    try {
      const r = await fetch(`${CONFIG.API_BASE_URL}/entrevistas/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
      toastSuccess('Entrevista eliminada.');
      await load();
    } catch (e) {
      toastError('Error al eliminar.');
    }
  }

  init();
}
