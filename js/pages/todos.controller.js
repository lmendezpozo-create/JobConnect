// js/pages/todos.controller.js
// Orquestador de la página tasks.html.
// Gestiona: listado, estado vacío, carga, errores, modal crear/editar
// y confirmación de borrado. Recurso esperado por el server: /all.
// - Edición desde el modal → PUT /all/:id (actualización completa).
// - Cambio de estado en la tarjeta → PATCH /all/:id (parcial).

import * as service from '../services/recruiterTaskService.js';
import { useCrud } from '../hooks/useCrud.js';
import { openModal, closeModal } from '../components/modal.js';
import { askConfirm } from '../components/confirmDialog.js';

// ── Referencias al DOM ─────────────────────────────────────────────
const listEl = document.querySelector('#todos-list');
const loadingEl = document.querySelector('#loading-indicator');
const emptyEl = document.querySelector('#empty-state');
const errorBanner = document.querySelector('#error-banner');
const errorMessage = document.querySelector('#error-message');
const btnCloseError = document.querySelector('#btn-close-error');

const modal = document.querySelector('#todo-modal');
const modalTitle = modal?.querySelector('#modal-title');
const form = document.querySelector('#todo-form');
const submitBtn = document.querySelector('#btn-submit-form');
const btnOpenCreate = document.querySelector('#btn-open-create-modal');
const deleteDialog = document.querySelector('#delete-dialog');
const statusFieldGroup = document.querySelector('#status-field-group');

const fieldId = form?.querySelector('#field-id');
const fieldTitle = form?.querySelector('#field-title');
const fieldDescription = form?.querySelector('#field-description');
const fieldPriority = form?.querySelector('#field-priority');
const fieldDueDate = form?.querySelector('#field-dueDate');
const fieldStatus = form?.querySelector('#field-status');

const errorTitle = document.querySelector('#error-title');
const errorDueDate = document.querySelector('#error-dueDate');

// ── Utilidades de presentación ─────────────────────────────────────
const STATUS_ORDER = ['pending', 'in-progress', 'completed', 'cancelled'];
const STATUS_LABELS = {
  pending: 'Pendiente',
  'in-progress': 'En Progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
};
const PRIORITY_LABELS = { low: 'Baja', medium: 'Media', high: 'Alta' };

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
};

const statusLabel = (s) => STATUS_LABELS[s] || s;
const priorityLabel = (p) => PRIORITY_LABELS[p] || p;

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
    article.className = `todo-card todo-card--priority-${item.priority || 'medium'}`;
    article.dataset.id = item.id;
    article.dataset.entity = 'task';

    article.innerHTML = `
      <div class="todo-card__content">
        <div class="todo-card__header">
          <h3 class="todo-card__title">${escapeHtml(item.title)}</h3>
          <span class="todo-card__priority-badge todo-card__priority-badge--${item.priority || 'medium'}">
            ${escapeHtml(priorityLabel(item.priority))}
          </span>
        </div>
        <p class="todo-card__description">${escapeHtml(item.description || '')}</p>
        <div class="todo-card__meta">
          <span class="todo-card__date">Vence: ${formatDate(item.dueDate)}</span>
          <span class="todo-card__status-badge todo-card__status-badge--${item.status || 'pending'}">
            ${escapeHtml(statusLabel(item.status))}
          </span>
        </div>
      </div>
      <div class="todo-card__actions">
        <select class="todo-card__status-select" data-field="status" aria-label="Cambiar estado">
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
  setFieldError(errorTitle, '');
  setFieldError(errorDueDate, '');
  if (fieldPriority) fieldPriority.value = 'medium';
  if (statusFieldGroup) statusFieldGroup.hidden = true;
  if (submitBtn) {
    submitBtn.textContent = 'Crear';
    submitBtn.disabled = false;
  }
};

const openCreate = () => {
  resetForm();
  if (modal) modal.dataset.mode = 'create';
  if (modalTitle) modalTitle.textContent = 'Nueva Tarea';
  openModal(modal);
};

const openEdit = (item) => {
  resetForm();
  if (modal) modal.dataset.mode = 'edit';
  if (modalTitle) modalTitle.textContent = 'Editar Tarea';
  if (submitBtn) submitBtn.textContent = 'Actualizar';
  if (fieldId) fieldId.value = item.id;
  if (fieldTitle) fieldTitle.value = item.title || '';
  if (fieldDescription) fieldDescription.value = item.description || '';
  if (fieldPriority) fieldPriority.value = item.priority || 'medium';
  if (fieldDueDate) fieldDueDate.value = item.dueDate || '';
  if (fieldStatus) fieldStatus.value = item.status || 'pending';
  if (statusFieldGroup) statusFieldGroup.hidden = false;
  openModal(modal);
};

// ── Validación del formulario ──────────────────────────────────────
const validate = () => {
  let ok = true;
  if (fieldTitle?.value.trim().length < 3) {
    setFieldError(errorTitle, 'El título debe tener al menos 3 caracteres.');
    ok = false;
  }
  if (!fieldDueDate?.value) {
    setFieldError(errorDueDate, 'La fecha de vencimiento es obligatoria.');
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
      title: fieldTitle.value.trim(),
      description: fieldDescription?.value.trim() || '',
      priority: fieldPriority?.value || 'medium',
      dueDate: fieldDueDate.value,
      status: fieldStatus?.value || 'pending',
    };

    if (submitBtn) submitBtn.disabled = true;
    try {
      if (id) {
        // PUT /all/:id (reemplazo completo)
        await update(id, data);
      } else {
        await create(data);
      }
      closeModal(modal);
      await load();
    } catch {
      /* error ya notificado */
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  [
    ['#field-title', errorTitle],
    ['#field-dueDate', errorDueDate],
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
  const card = e.target.closest('.todo-card');
  const id = card?.dataset.id;
  if (!id) return;

  if (actionBtn.dataset.action === 'edit') {
    const item = items.find((i) => String(i.id) === String(id));
    if (item) openEdit(item);
  } else if (actionBtn.dataset.action === 'delete') {
    const item = items.find((i) => String(i.id) === String(id));
    const message = item
      ? `¿Eliminar la tarea "${item.title}"?\nEsta acción no se puede deshacer.`
      : '¿Eliminar esta tarea?';
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
  const card = e.target.closest('.todo-card');
  const id = card?.dataset.id;
  if (!id) return;
  try {
    // Cambio puntual de estado (PATCH) para no pisar el resto de campos.
    await service.patchTask(id, { status: select.value });
    await load();
  } catch {
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