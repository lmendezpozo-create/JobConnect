/* Toast notifications — Kendall (adaptado para SPA unificado) */
const ICONOS = { success: '✓', error: '✕', info: 'ℹ', warning: '!' };
let container = null;

function getContainer() {
  if (container && document.body.contains(container)) return container;
  container = document.createElement('div');
  container.className = 'toast-container';
  container.setAttribute('aria-live', 'polite');
  document.body.appendChild(container);
  return container;
}

export function showToast(message, type = 'info', duration = 4000) {
  const cont = getContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${ICONOS[type] || ICONOS.info}</span>
    <span class="toast__text"></span>
    <button type="button" class="toast__close" aria-label="Cerrar">✕</button>`;
  toast.querySelector('.toast__text').textContent = message;
  const close = () => { if (toast.parentElement) toast.parentElement.removeChild(toast); };
  toast.querySelector('.toast__close').addEventListener('click', close);
  cont.appendChild(toast);
  if (duration > 0) setTimeout(close, duration);
  return close;
}

export const toastSuccess = (msg) => showToast(msg, 'success');
export const toastError = (msg) => showToast(msg, 'error');
export const toastInfo = (msg) => showToast(msg, 'info');
