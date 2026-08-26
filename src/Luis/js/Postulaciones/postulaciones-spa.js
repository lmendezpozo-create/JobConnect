/* Postulaciones SPA module — Luis (adaptado para SPA unificado) */
import { showToast, toastSuccess, toastError } from '../../../Aiden/js/toast.js';

const API_URL = 'http://localhost:3000/postulaciones';

const DEMO_DATA = [
  { id: "1", nombre: "María Rodríguez", empresa: "TechCorp Inc.", cargo: "Senior Frontend Dev", email: "m.rodriguez@email.com", fecha: "12 Oct 2023", estado: "Entrevista" },
  { id: "2", nombre: "Juan Gómez", empresa: "Creative Studio", cargo: "UX Designer", email: "juan.g@email.com", fecha: "10 Oct 2023", estado: "Pendiente" },
  { id: "3", nombre: "Ana López", empresa: "Innova Global", cargo: "Product Manager", email: "ana.lopez@email.com", fecha: "08 Oct 2023", estado: "En revisión" },
  { id: "4", nombre: "Carlos Mendoza", empresa: "DataPulse AI", cargo: "Backend Engineer", email: "carlos.m@datapulse.io", fecha: "05 Oct 2023", estado: "En revisión" },
  { id: "5", nombre: "Sofía Martínez", empresa: "CloudScale", cargo: "DevOps Architect", email: "sofia.m@cloudscale.com", fecha: "04 Oct 2023", estado: "Entrevista" },
  { id: "6", nombre: "Diego Fernández", empresa: "FinTech Prime", cargo: "Fullstack Developer", email: "diego.f@fintechprime.com", fecha: "02 Oct 2023", estado: "Aceptado" },
  { id: "7", nombre: "Elena Torres", empresa: "CyberGuard", cargo: "Security Analyst", email: "elena.t@cyberguard.net", fecha: "01 Oct 2023", estado: "En revisión" },
  { id: "8", nombre: "Gabriel Ruiz", empresa: "AppNation", cargo: "Mobile Developer", email: "gabriel.r@appnation.org", fecha: "29 Sep 2023", estado: "Entrevista" },
  { id: "9", nombre: "Lucía Morales", empresa: "Nexus Media", cargo: "UI/UX Researcher", email: "lucia.m@nexus.com", fecha: "28 Sep 2023", estado: "En revisión" },
  { id: "10", nombre: "Mateo Silva", empresa: "BioTech Labs", cargo: "Data Scientist", email: "mateo.s@biotech.com", fecha: "25 Sep 2023", estado: "Aceptado" },
  { id: "11", nombre: "Valeria Navarro", empresa: "LogiTech", cargo: "QA Automation Lead", email: "valeria.n@logitech.io", fecha: "24 Sep 2023", estado: "En revisión" },
  { id: "12", nombre: "Andrés Castro", empresa: "SmartCity Inc.", cargo: "Embedded Systems", email: "andres.c@smartcity.org", fecha: "22 Sep 2023", estado: "Entrevista" }
];

function getIniciales(nombre) {
  return nombre ? nombre.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2) : 'CN';
}

function escapeHtml(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

async function getPostulaciones() {
  try {
    const r = await fetch(API_URL);
    if (r.ok) {
      const data = await r.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}
  return DEMO_DATA;
}

export function renderPostulaciones(container) {
  let all = [];
  let filtered = [];
  let currentPage = 1;
  const perPage = 6;

  function init() {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Postulaciones</h1>
          <p class="page-header__subtitle">Gestiona y da seguimiento a los candidatos que aplican a las vacantes.</p>
        </div>
        <button class="btn btn-primary" id="btn-nueva-post">+ Nueva postulación</button>
      </div>
      <div id="postulaciones-kpi" class="kpi-grid"></div>
      <div class="toolbar">
        <div class="toolbar__search">
          <span class="toolbar__search-icon">🔎</span>
          <input type="text" id="post-search" placeholder="Buscar candidato, empresa o cargo...">
        </div>
        <div class="toolbar__filter">
          <select id="post-filter-status">
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En revisión">En revisión</option>
            <option value="Entrevista">Entrevista</option>
            <option value="Aceptado">Aceptado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>
      </div>
      <div id="postulaciones-grid" class="cards-grid"></div>
      <div class="pagination" id="post-pagination"></div>`;

    container.querySelector('#btn-nueva-post').onclick = () => openModal();
    container.querySelector('#post-search').oninput = () => applyFilters();
    container.querySelector('#post-filter-status').onchange = () => applyFilters();
    load();
  }

  async function load() {
    try {
      all = await getPostulaciones();
      updateKPIs();
      applyFilters();
    } catch (e) {
      toastError('Error al cargar postulaciones.');
    }
  }

  function updateKPIs() {
    const kpiEl = container.querySelector('#postulaciones-kpi');
    const total = all.length;
    const revision = all.filter(p => p.estado === 'En revisión').length;
    const entrevista = all.filter(p => p.estado === 'Entrevista').length;
    const aceptado = all.filter(p => p.estado === 'Aceptado').length;
    kpiEl.innerHTML = `
      <div class="kpi-card kpi-card--blue">
        <div class="kpi-card__header"><span class="kpi-card__label">Total</span><div class="kpi-card__icon">📄</div></div>
        <div class="kpi-card__value">${total}</div>
      </div>
      <div class="kpi-card kpi-card--gold">
        <div class="kpi-card__header"><span class="kpi-card__label">En Revisión</span><div class="kpi-card__icon">📋</div></div>
        <div class="kpi-card__value">${revision}</div>
      </div>
      <div class="kpi-card kpi-card--purple">
        <div class="kpi-card__header"><span class="kpi-card__label">Entrevistas</span><div class="kpi-card__icon">💬</div></div>
        <div class="kpi-card__value">${entrevista}</div>
      </div>
      <div class="kpi-card kpi-card--green">
        <div class="kpi-card__header"><span class="kpi-card__label">Aceptados</span><div class="kpi-card__icon">✓</div></div>
        <div class="kpi-card__value">${aceptado}</div>
      </div>`;
  }

  function applyFilters() {
    const search = (container.querySelector('#post-search')?.value || '').toLowerCase().trim();
    const status = container.querySelector('#post-filter-status')?.value || '';
    filtered = all.filter(p => {
      const matchSearch = !search ||
        (p.nombre || '').toLowerCase().includes(search) ||
        (p.empresa || '').toLowerCase().includes(search) ||
        (p.cargo || '').toLowerCase().includes(search) ||
        (p.email || '').toLowerCase().includes(search);
      const matchStatus = !status || p.estado === status;
      return matchSearch && matchStatus;
    });
    currentPage = 1;
    renderCards();
  }

  function renderCards() {
    const grid = container.querySelector('#postulaciones-grid');
    const pag = container.querySelector('#post-pagination');
    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;background:var(--color-surface);border-radius:var(--radius-md);border:1px solid var(--color-border);"><p style="font-weight:600;">No se encontraron postulaciones</p></div>';
      pag.innerHTML = '';
      return;
    }
    const start = (currentPage - 1) * perPage;
    const items = filtered.slice(start, start + perPage);
    const statusClass = (s) => s ? s.replace(/\s+/g, '-') : 'Pendiente';

    grid.innerHTML = items.map(p => `
      <div class="candidate-card">
        <div class="card-actions-menu">
          <button class="btn-card-action" data-action="edit" data-id="${p.id}" title="Editar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-card-action" data-action="delete" data-id="${p.id}" title="Eliminar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
        <div class="candidate-header">
          <div class="avatar-circle">${getIniciales(p.nombre)}</div>
          <div class="candidate-info">
            <h3 class="candidate-name">${escapeHtml(p.nombre || 'Sin nombre')}</h3>
            <p class="candidate-company">${escapeHtml(p.empresa || 'Empresa')}</p>
          </div>
        </div>
        <div class="candidate-details">
          <div class="detail-item role">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <span>${escapeHtml(p.cargo || 'Cargo')}</span>
          </div>
          <div class="detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>${escapeHtml(p.email || '')}</span>
          </div>
          <div class="detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>${escapeHtml(p.fecha || '')}</span>
          </div>
        </div>
        <div class="candidate-footer">
          <span class="badge badge--${statusClass(p.estado)}">${escapeHtml(p.estado || 'Pendiente')}</span>
        </div>
      </div>`).join('');

    const totalPages = Math.ceil(filtered.length / perPage);
    pag.innerHTML = `
      <span class="pagination__info">Mostrando ${start + 1}-${Math.min(start + perPage, filtered.length)} de ${filtered.length}</span>
      <div class="pagination__buttons">
        <button class="btn-page" id="post-prev" ${currentPage <= 1 ? 'disabled' : ''}>Anterior</button>
        <button class="btn-page" id="post-next" ${currentPage >= totalPages ? 'disabled' : ''}>Siguiente</button>
      </div>`;
    const prevBtn = pag.querySelector('#post-prev');
    const nextBtn = pag.querySelector('#post-next');
    if (prevBtn) prevBtn.onclick = () => { currentPage--; renderCards(); };
    if (nextBtn) nextBtn.onclick = () => { currentPage++; renderCards(); };

    grid.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.onclick = () => {
        const p = all.find(x => String(x.id) === String(btn.dataset.id));
        if (p) openModal(p);
      };
    });
    grid.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('¿Eliminar esta postulación?')) return;
        try { await fetch(`${API_URL}/${btn.dataset.id}`, { method: 'DELETE' }); toastSuccess('Eliminada.'); await load(); }
        catch { toastError('Error al eliminar.'); }
      };
    });
  }

  function openModal(post = null) {
    const isEdit = !!post;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-card__header">
          <h3 class="modal-card__title">${isEdit ? 'Editar Postulación' : 'Nueva Postulación'}</h3>
          <button class="modal-card__close">✕</button>
        </div>
        <div class="modal-card__body">
          <form id="post-form" class="form-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-field form-field--full">
              <label>Nombre Completo *</label>
              <input type="text" name="nombre" value="${post?.nombre || ''}" required placeholder="Ej: María Rodríguez">
            </div>
            <div class="form-field">
              <label>Empresa *</label>
              <input type="text" name="empresa" value="${post?.empresa || ''}" required>
            </div>
            <div class="form-field">
              <label>Cargo / Vacante *</label>
              <input type="text" name="cargo" value="${post?.cargo || ''}" required>
            </div>
            <div class="form-field">
              <label>Correo *</label>
              <input type="email" name="email" value="${post?.email || ''}" required>
            </div>
            <div class="form-field">
              <label>Estado</label>
              <select name="estado">
                ${['Pendiente','En revisión','Entrevista','Aceptado','Rechazado'].map(s =>
                  `<option value="${s}" ${post?.estado === s ? 'selected' : ''}>${s}</option>`
                ).join('')}
              </select>
            </div>
          </form>
        </div>
        <div class="modal-card__footer">
          <button class="btn btn-secondary" data-accion="cancelar">Cancelar</button>
          <button class="btn btn-primary" data-accion="guardar" form="post-form">${isEdit ? 'Guardar' : 'Crear'}</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.modal-card__close').onclick = close;
    overlay.querySelector('[data-accion="cancelar"]').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    overlay.querySelector('[data-accion="guardar"]').onclick = async () => {
      const fd = new FormData(overlay.querySelector('#post-form'));
      const data = {
        nombre: fd.get('nombre').trim(),
        empresa: fd.get('empresa').trim(),
        cargo: fd.get('cargo').trim(),
        email: fd.get('email').trim(),
        estado: fd.get('estado'),
        fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        iniciales: getIniciales(fd.get('nombre').trim())
      };
      if (!data.nombre || !data.empresa || !data.cargo || !data.email) {
        showToast('Todos los campos marcados son obligatorios.', 'error');
        return;
      }
      try {
        const url = isEdit ? `${API_URL}/${post.id}` : API_URL;
        const method = isEdit ? 'PATCH' : 'POST';
        const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error();
        toastSuccess(isEdit ? 'Actualizada.' : 'Creada.');
        close();
        await load();
      } catch { toastError('Error al guardar.'); }
    };
  }

  init();
}
