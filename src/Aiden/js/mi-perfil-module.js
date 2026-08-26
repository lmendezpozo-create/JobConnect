/* Mi Perfil — Candidate self-service profile */
import { CONFIG } from './config.js';
import { user } from '../../main.js';
import { showToast, toastSuccess, toastError } from './toast.js';

export function renderMiPerfil(container) {
  const u = user();
  let candidato = null;

  async function load() {
    try {
      const r = await fetch(`${CONFIG.API_BASE_URL}/candidatos?userId=${u.id}`);
      if (!r.ok) throw new Error();
      const arr = await r.json();
      candidato = arr[0] || null;
      render();
    } catch {
      candidato = null;
      render();
    }
  }

  function render() {
    if (!candidato) {
      container.innerHTML = `
        <div class="page-header">
          <div><h1 class="page-header__title">Mi Perfil</h1>
          <p class="page-header__subtitle">Completa tu perfil para que el sistema pueda calcular tu match con las vacantes.</p></div>
        </div>
        <div class="panel" style="max-width:700px;">
          <p>No tienes perfil registrado. Crea tu perfil para empezar a postularte.</p>
          <button class="btn btn-primary" id="btn-create-profile" style="margin-top:12px;">Crear mi perfil</button>
        </div>`;
      container.querySelector('#btn-create-profile').onclick = () => openProfileModal();
      return;
    }

    container.innerHTML = `
      <div class="page-header">
        <div><h1 class="page-header__title">Mi Perfil</h1>
        <p class="page-header__subtitle">Gestiona tu información profesional para mejorar tu match con vacantes.</p></div>
        <button class="btn btn-primary" id="btn-edit-profile">Editar perfil</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:900px;">
        <div class="panel">
          <h2 style="margin-bottom:12px;">Información Personal</h2>
          <p><b>Nombre:</b> ${candidato.firstName} ${candidato.lastName}</p>
          <p><b>Email:</b> ${candidato.email}</p>
          <p><b>Teléfono:</b> ${candidato.phone || '—'}</p>
          <p><b>Resumen:</b> ${candidato.resumen || '—'}</p>
        </div>
        <div class="panel">
          <h2 style="margin-bottom:12px;">Habilidades</h2>
          ${(candidato.habilidades || []).length === 0 ? '<p>No has registrado habilidades.</p>' :
            `<div style="display:flex;flex-wrap:wrap;gap:6px;">${(candidato.habilidades || []).map(h => `<span class="badge badge--activa">${h}</span>`).join('')}</div>`}
        </div>
        <div class="panel">
          <h2 style="margin-bottom:12px;">Experiencia Laboral</h2>
          ${(candidato.experiencia || []).length === 0 ? '<p>No has registrado experiencia.</p>' :
            (candidato.experiencia || []).map(e => `
              <div style="margin-bottom:12px;padding:10px;background:var(--color-surface-alt,#f9f9f9);border-radius:8px;">
                <b>${e.cargo}</b> en ${e.empresa}<br>
                <small>${e.duracion || '—'}</small>
                <p style="margin-top:4px;">${e.descripcion || ''}</p>
              </div>`).join('')}
        </div>
        <div class="panel">
          <h2 style="margin-bottom:12px;">Educación</h2>
          ${(candidato.educacion || []).length === 0 ? '<p>No has registrado educación.' :
            (candidato.educacion || []).map(e => `
              <div style="margin-bottom:8px;padding:10px;background:var(--color-surface-alt,#f9f9f9);border-radius:8px;">
                <b>${e.titulo}</b><br>
                <small>${e.institucion} · ${e.anio || '—'}</small>
              </div>`).join('')}
        </div>
        <div class="panel">
          <h2 style="margin-bottom:12px;">Idiomas</h2>
          ${(candidato.idiomas || []).length === 0 ? '<p>No has registrado idiomas.</p>' :
            `<div style="display:flex;flex-wrap:wrap;gap:6px;">${(candidato.idiomas || []).map(i => `<span class="badge badge--pausada">${i}</span>`).join('')}</div>`}
        </div>
      </div>`;

    container.querySelector('#btn-edit-profile').onclick = () => openProfileModal(candidato);
  }

  function openProfileModal(data = null) {
    const d = data || {};
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal-card" style="max-width:700px;">
        <div class="modal-card__header">
          <h3 class="modal-card__title">${data ? 'Editar Perfil' : 'Crear Perfil'}</h3>
          <button class="modal-card__close">✕</button>
        </div>
        <div class="modal-card__body" style="max-height:60vh;overflow-y:auto;">
          <form id="profile-form" class="form-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-field"><label>Nombre *</label><input type="text" name="firstName" value="${d.firstName || ''}" required></div>
            <div class="form-field"><label>Apellido *</label><input type="text" name="lastName" value="${d.lastName || ''}" required></div>
            <div class="form-field"><label>Email *</label><input type="email" name="email" value="${d.email || ''}" required></div>
            <div class="form-field"><label>Teléfono</label><input type="text" name="phone" value="${d.phone || ''}"></div>
            <div class="form-field form-field--full"><label>Resumen profesional</label><textarea name="resumen" rows="2">${d.resumen || ''}</textarea></div>
            <div class="form-field form-field--full">
              <label>Habilidades (separadas por coma)</label>
              <input type="text" name="habilidades" value="${(d.habilidades || []).join(', ')}" placeholder="Ej: JavaScript, React, Inglés, Servicio al cliente">
            </div>
            <div class="form-field form-field--full">
              <label>Idiomas (separados por coma)</label>
              <input type="text" name="idiomas" value="${(d.idiomas || []).join(', ')}" placeholder="Ej: Español, Inglés">
            </div>
            <div class="form-field form-field--full">
              <label>Experiencia laboral</label>
              <div id="exp-list">
                ${(d.experiencia || [{}]).map((e, i) => `
                  <div class="exp-entry" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;padding:10px;background:var(--color-surface-alt,#f5f5f5);border-radius:8px;">
                    <input type="text" name="exp_empresa_${i}" placeholder="Empresa" value="${e.empresa || ''}">
                    <input type="text" name="exp_cargo_${i}" placeholder="Cargo" value="${e.cargo || ''}">
                    <input type="text" name="exp_duracion_${i}" placeholder="Duración" value="${e.duracion || ''}">
                    <input type="text" name="exp_descripcion_${i}" placeholder="Descripción" value="${e.descripcion || ''}">
                  </div>`).join('')}
              </div>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-add-exp">+ Agregar experiencia</button>
            </div>
            <div class="form-field form-field--full">
              <label>Educación</label>
              <div id="edu-list">
                ${(d.educacion || [{}]).map((e, i) => `
                  <div class="edu-entry" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px;padding:10px;background:var(--color-surface-alt,#f5f5f5);border-radius:8px;">
                    <input type="text" name="edu_titulo_${i}" placeholder="Título" value="${e.titulo || ''}">
                    <input type="text" name="edu_institucion_${i}" placeholder="Institución" value="${e.institucion || ''}">
                    <input type="number" name="edu_anio_${i}" placeholder="Año" value="${e.anio || ''}">
                  </div>`).join('')}
              </div>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-add-edu">+ Agregar educación</button>
            </div>
          </form>
        </div>
        <div class="modal-card__footer">
          <button class="btn btn-secondary" data-accion="cancelar">Cancelar</button>
          <button class="btn btn-primary" data-accion="guardar" form="profile-form">Guardar perfil</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.modal-card__close').onclick = close;
    overlay.querySelector('[data-accion="cancelar"]').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    let expCount = (d.experiencia || [{}]).length;
    overlay.querySelector('#btn-add-exp').onclick = () => {
      const div = document.createElement('div');
      div.className = 'exp-entry';
      div.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;padding:10px;background:var(--color-surface-alt,#f5f5f5);border-radius:8px;';
      div.innerHTML = `
        <input type="text" name="exp_empresa_${expCount}" placeholder="Empresa">
        <input type="text" name="exp_cargo_${expCount}" placeholder="Cargo">
        <input type="text" name="exp_duracion_${expCount}" placeholder="Duración">
        <input type="text" name="exp_descripcion_${expCount}" placeholder="Descripción">`;
      overlay.querySelector('#exp-list').appendChild(div);
      expCount++;
    };

    let eduCount = (d.educacion || [{}]).length;
    overlay.querySelector('#btn-add-edu').onclick = () => {
      const div = document.createElement('div');
      div.className = 'edu-entry';
      div.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px;padding:10px;background:var(--color-surface-alt,#f5f5f5);border-radius:8px;';
      div.innerHTML = `
        <input type="text" name="edu_titulo_${eduCount}" placeholder="Título">
        <input type="text" name="edu_institucion_${eduCount}" placeholder="Institución">
        <input type="number" name="edu_anio_${eduCount}" placeholder="Año">`;
      overlay.querySelector('#edu-list').appendChild(div);
      eduCount++;
    };

    overlay.querySelector('[data-accion="guardar"]').onclick = async () => {
      const fd = new FormData(overlay.querySelector('#profile-form'));
      const experiencia = [];
      overlay.querySelectorAll('.exp-entry').forEach((_, i) => {
        const emp = fd.get(`exp_empresa_${i}`);
        const car = fd.get(`exp_cargo_${i}`);
        if (emp || car) {
          experiencia.push({ empresa: emp || '', cargo: car || '', duracion: fd.get(`exp_duracion_${i}`) || '', descripcion: fd.get(`exp_descripcion_${i}`) || '' });
        }
      });
      const educacion = [];
      overlay.querySelectorAll('.edu-entry').forEach((_, i) => {
        const tit = fd.get(`edu_titulo_${i}`);
        if (tit) {
          educacion.push({ titulo: tit, institucion: fd.get(`edu_institucion_${i}`) || '', anio: Number(fd.get(`edu_anio_${i}`)) || null });
        }
      });
      const data = {
        userId: u.id,
        firstName: fd.get('firstName').trim(),
        lastName: fd.get('lastName').trim(),
        email: fd.get('email').trim(),
        phone: fd.get('phone').trim(),
        resumen: fd.get('resumen').trim(),
        habilidades: fd.get('habilidades').split(',').map(s => s.trim()).filter(Boolean),
        idiomas: fd.get('idiomas').split(',').map(s => s.trim()).filter(Boolean),
        experiencia,
        educacion,
        status: candidato?.status || 'activo'
      };
      if (!data.firstName || !data.lastName || !data.email) {
        showToast('Nombre, apellido y correo son obligatorios.', 'error');
        return;
      }
      try {
        const url = candidato ? `${CONFIG.API_BASE_URL}/candidatos/${candidato.id}` : `${CONFIG.API_BASE_URL}/candidatos`;
        const method = candidato ? 'PUT' : 'POST';
        const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error();
        candidato = await r.json();
        toastSuccess('Perfil guardado correctamente.');
        close();
        render();
      } catch {
        toastError('Error al guardar el perfil.');
      }
    };
  }

  load();
}
