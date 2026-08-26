// js/pages/interviews.controller.js
// Orquestador de la página interviews.html.
// Gestiona: listado, estado vacío, indicador de carga, alerta de error,
// modal crear/editar y diálogo de confirmación de borrado.
// Recurso esperado por el server: /comments.

import * as service from '../services/interviewService.js';
import { useCrud } from '../hooks/useCrud.js';
import { openModal, closeModal } from '../components/modal.js';
import { askConfirm } from '../components/confirmDialog.js';

// ── Referencias al DOM ─────────────────────────────────────────────
const listEl = document.querySelector('#interviews-list');
const loadingEl = document.querySelector('#loading-indicator');
const emptyEl = document.querySelector('#empty-state');
const errorBanner = document.querySelector('#error-banner');
const errorMessage = document.querySelector('#error-message');
const btnCloseError = document.querySelector('#btn-close-error');

const modal = document.querySelector('#interview-modal');
const modalTitle = modal?.querySelector('#modal-title');
const form = document.querySelector('#interview-form');
const submitBtn = document.querySelector('#btn-submit-form');
const btnOpenCreate = document.querySelector('#btn-open-create-modal');
const deleteDialog = document.querySelector('#delete-dialog');

const fieldId = form?.querySelector('#field-id');
const fieldCandidate = form?.querySelector('#field-candidate');
const fieldPosition = form?.querySelector('#field-position');
const fieldDate = form?.querySelector('#field-date');
const fieldStatus = form?.querySelector('#field-status');
const fieldNotes = form?.querySelector('#field-notes');

const errorCandidate = document.querySelector('#error-candidate');
const errorPosition = document.querySelector('#error-position');
const errorDate = document.querySelector('#error-date');

// ── Utilidades de presentación ─────────────────────────────────────
const STATUS_ORDER = ['pending', 'scheduled', 'completed', 'cancelled'];
const STATUS_LABELS = {
  pending: 'Pendiente',
  scheduled: 'Programada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));

const formatDate = (value) => {
  if (!value) return 'Pendiente';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
};

const statusLabel = (s) => STATUS_LABELS[s] || s;

let items = [];

// ── Manejo de errores ──────────────────────────────────────────────
const clearError = () => {
  if (errorBanner) errorBanner.hidden = true;
  if (errorMessage) errorMessage.textContent = '';
};
btnCloseError?.addEventListener('click', clearError);

const showError = (msg) => {
  if (errorMessage) errorMessage.textContent = msg;
  if (errorBanner) errorBanner.hidden = false;
};

const setFieldError = (el, msg) => {
  if (el) {
    el.textContent = msg;
    el.hidden = !msg;
  }
};

// ── Render del listado ─────────────────────────────────────────────
const render = (items) => {
  items = items || [];
  if (loadingEl) loadingEl.hidden = true;
  if (!listEl) return;
  listEl.innerHTML = '';
  if (emptyEl) emptyEl.hidden = items.length > 0;

  items.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'interview-card';
    article.dataset.id = item.id;
    article.dataset.entity = 'interview';

    article.innerHTML = `
      <div class="interview-card__content">
        <h3 class="interview-card__candidate">${escapeHtml(item.candidate)}</h3>
        <p class="interview-card__position">${escapeHtml(item.position)}</p>
        <p class="interview-card__date">Fecha: ${formatDate(item.date)}</p>
        <p class="interview-card__notes">${escapeHtml(item.notes || '')}</p>
      </div>
      <div class="interview-card__actions">
        <select class="interview-card__status" data-field="status" aria-label="Cambiar estado">
          ${STATUS_ORDER.map((s) =>
            `<option value="${s}" ${s === item.status ? 'selected' : ''}>${statusLabel(s)}</option>`
          ).join('')}
        </select>
        <button class="btn btn--small" data-action="edit">Editar</button>
        <button class="btn btn--danger btn--small" data-action="delete">Eliminar</button>
      </div>
    `;
    listEl.appendChild(article);
  });
};
// ── Modal: relleno según modo ──────────────────────────────────────
const resetForm = () => {
  form?.reset();
  setFieldError(errorCandidate, '');
  setFieldError(errorPosition, '');
  setFieldError(errorDate, '');
  if (submitBtn) {
    submitBtn.textContent = 'Crear';
    submitBtn.disabled = false;
  }
};

const openCreate = () => {
  resetForm();
  if (modal) modal.dataset.mode = 'create';
  if (modalTitle) modalTitle.textContent = 'Nueva Entrevista';
  openModal(modal);
};

const openEdit = (item) => {
  resetForm();
  if (modal) modal.dataset.mode = 'edit';
  if (modalTitle) modalTitle.textContent = 'Editar Entrevista';
  if (submitBtn) submitBtn.textContent = 'Actualizar';
  if (fieldId) fieldId.value = item.id;
  if (fieldCandidate) fieldCandidate.value = item.candidate || '';
  if (fieldPosition) fieldPosition.value = item.position || '';
  if (fieldDate) fieldDate.value = item.date || '';
  if (fieldStatus) fieldStatus.value = item.status || 'pending';
  if (fieldNotes) fieldNotes.value = item.notes || '';
  openModal(modal);
};

// ── Validación del formulario ──────────────────────────────────────
const validate = () => {
  let ok = true;
  if (!fieldCandidate?.value.trim()) {
    setFieldError(errorCandidate, 'El candidato es obligatorio.');
    ok = false;
  }
  if (!fieldPosition?.value.trim()) {
    setFieldError(errorPosition, 'La posición es obligatoria.');
    ok = false;
  }
  if (!fieldDate?.value) {
    setFieldError(errorDate, 'La fecha es obligatoria.');
    ok = false;
  }
  return ok;
};

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const id = fieldId?.value;
    const data = {
      candidate: fieldCandidate.value.trim(),
      position: fieldPosition.value.trim(),
      date: fieldDate.value,
      status: fieldStatus?.value || 'pending',
      notes: fieldNotes?.value.trim() || '',
    };

    if (submitBtn) submitBtn.disabled = true;
    try {
      if (id) {
        await update(id, data);
      } else {
        await create(data);
      }
      closeModal(modal);
      await load();
    } catch {
      /* el error ya se muestra vía onError */
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  // Limpiar errores de campo al escribir
  [
    ['#field-candidate', errorCandidate],
    ['#field-position', errorPosition],
    ['#field-date', errorDate],
  ].forEach(([sel, el]) => {
    const input = form.querySelector(sel);
    input?.addEventListener('input', () => setFieldError(el, ''));
  });
}

// ── Eventos del modal / botón crear ────────────────────────────────
btnOpenCreate?.addEventListener('click', openCreate);
modal?.querySelectorAll('[data-action="close-modal"]').forEach((btn) => {
  btn.addEventListener('click', () => closeModal(modal));
});

// ── Eventos del listado (delegación) ───────────────────────────────
listEl?.addEventListener('click', async (e) => {
  const actionBtn = e.target.closest('[data-action]');
  if (!actionBtn) return;
  const card = e.target.closest('.interview-card');
  const id = card?.dataset.id;
  if (!id) return;

  if (actionBtn.dataset.action === 'edit') {
    const item = items.find((i) => String(i.id) === String(id));
    if (item) openEdit(item);
  } else if (actionBtn.dataset.action === 'delete') {
    const item = items.find((i) => String(i.id) === String(id));
    const message = item
      ? `¿Eliminar la entrevista de "${item.candidate}"?\nEsta acción no se puede deshacer.`
      : '¿Eliminar esta entrevista?';
    const confirmed = await askConfirm({ dialog: deleteDialog, message });
    if (confirmed) {
      try {
        await remove(id);
        await load();
      } catch {
        /* error ya notificado */
      }
    }
  }
});

listEl?.addEventListener('change', async (e) => {
  const select = e.target.closest('[data-field="status"]');
  if (!select) return;
  const card = e.target.closest('.interview-card');
  const id = card?.dataset.id;
  if (!id) return;
  try {
    await update(id, { status: select.value });
    await load();
  } catch {
    /* error ya notificado; recarga para restablecer el select */
    await load();
  }
});

// ── Instancia CRUD + carga inicial ─────────────────────────────────
const { load, create, update, remove } = useCrud({
  service,
  onList: render,
  onError: showError,
});

(async function init() {
  if (loadingEl) loadingEl.hidden = false;
  await load();
})();