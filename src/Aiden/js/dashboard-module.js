/* Dashboard module — Aiden */
import { CONFIG } from './config.js';
import { user } from '../../main.js';

export function renderDashboardModule(container) {
  const u = user();
  const isAdmin = u && u.rol === 'admin';

  Promise.all([
    fetch(`${CONFIG.API_BASE_URL}/candidatos`).then(r => r.json()),
    fetch(`${CONFIG.API_BASE_URL}/vacantes`).then(r => r.json()),
    fetch(`${CONFIG.API_BASE_URL}/empresas`).then(r => r.json()),
    fetch(`${CONFIG.API_BASE_URL}/postulaciones`).then(r => r.json()),
    fetch(`${CONFIG.API_BASE_URL}/entrevistas`).then(r => r.json()),
    fetch(`${CONFIG.API_BASE_URL}/tareas`).then(r => r.json())
  ]).then(([candidatos, vacantes, empresas, postulaciones, entrevistas, tareas]) => {
    const vacantesActivas = vacantes.filter(v => v.estado === 'activa');
    const postulacionesPendientes = postulaciones.filter(p => p.estado === 'pendiente' || p.estado === 'En revisión' || p.estado === 'Pendiente');
    const entrevistasProgramadas = entrevistas.filter(e => e.estado === 'programada' || e.estado === 'Programada');
    const tareasPendientes = tareas.filter(t => t.estado !== 'completada' && t.estado !== 'Completada');

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Dashboard</h1>
          <p class="page-header__subtitle">Vista general del sistema de empleabilidad JobConnect.</p>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card kpi-card--blue">
          <div class="kpi-card__header">
            <span class="kpi-card__label">Candidatos</span>
            <div class="kpi-card__icon">👤</div>
          </div>
          <div class="kpi-card__value">${candidatos.length}</div>
        </div>
        <div class="kpi-card kpi-card--gold">
          <div class="kpi-card__header">
            <span class="kpi-card__label">Vacantes Activas</span>
            <div class="kpi-card__icon">💼</div>
          </div>
          <div class="kpi-card__value">${vacantesActivas.length}</div>
        </div>
        <div class="kpi-card kpi-card--green">
          <div class="kpi-card__header">
            <span class="kpi-card__label">Empresas</span>
            <div class="kpi-card__icon">🏢</div>
          </div>
          <div class="kpi-card__value">${empresas.length}</div>
        </div>
        <div class="kpi-card kpi-card--purple">
          <div class="kpi-card__header">
            <span class="kpi-card__label">Postulaciones</span>
            <div class="kpi-card__icon">📄</div>
          </div>
          <div class="kpi-card__value">${postulaciones.length}</div>
        </div>
        <div class="kpi-card kpi-card--teal">
          <div class="kpi-card__header">
            <span class="kpi-card__label">Entrevistas</span>
            <div class="kpi-card__icon">📝</div>
          </div>
          <div class="kpi-card__value">${entrevistas.length}</div>
        </div>
        <div class="kpi-card kpi-card--red">
          <div class="kpi-card__header">
            <span class="kpi-card__label">Tareas Pendientes</span>
            <div class="kpi-card__icon">✅</div>
          </div>
          <div class="kpi-card__value">${tareasPendientes.length}</div>
        </div>
      </div>
      <div class="panel">
        <h2>Últimas Vacantes</h2>
        ${vacantes.length === 0 ? '<p>No hay vacantes registradas.</p>' : `
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Puesto</th><th>Empresa</th><th>Ubicación</th><th>Estado</th></tr></thead>
            <tbody>
              ${vacantes.slice(-5).reverse().map(v => `
                <tr>
                  <td data-label="Puesto" class="data-table__title">${v.titulo}</td>
                  <td data-label="Empresa">${v.empresa}</td>
                  <td data-label="Ubicación">${v.ubicacion || '—'}</td>
                  <td data-label="Estado"><span class="badge badge--${v.estado}">${v.estado}</span></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`}
      </div>
      ${entrevistasProgramadas.length > 0 ? `
      <div class="panel">
        <h2>Próximas Entrevistas</h2>
        ${entrevistasProgramadas.slice(0, 5).map(e => `<p><b>${e.candidato || e.postulacionId}</b> — ${e.fecha ? new Date(e.fecha).toLocaleDateString('es-CR') : 'Sin fecha'} · ${e.tipo || ''}</p>`).join('')}
      </div>` : ''}
      ${isAdmin ? `
      <div class="panel">
        <h2>Accesos Rápidos</h2>
        <p style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
          <a href="#" onclick="return false" data-nav="candidatos" class="btn btn-secondary btn-sm">👤 Candidatos</a>
          <a href="#" onclick="return false" data-nav="vacantes" class="btn btn-secondary btn-sm">💼 Vacantes</a>
          <a href="#" onclick="return false" data-nav="empresas" class="btn btn-secondary btn-sm">🏢 Empresas</a>
          <a href="#" onclick="return false" data-nav="postulaciones" class="btn btn-secondary btn-sm">📄 Postulaciones</a>
          <a href="#" onclick="return false" data-nav="entrevistas" class="btn btn-secondary btn-sm">📝 Entrevistas</a>
          <a href="#" onclick="return false" data-nav="tareas" class="btn btn-secondary btn-sm">✅ Tareas</a>
        </p>
      </div>` : ''}
    `;
  }).catch(err => {
    container.innerHTML = `
      <div class="state-panel">
        <div class="state-panel__icon">⚠️</div>
        <div class="state-panel__title">Error al cargar el dashboard</div>
        <div class="state-panel__text">${err.message}. Asegúrese de que JSON Server esté ejecutándose.</div>
      </div>`;
  });
}
