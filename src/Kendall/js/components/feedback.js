/**
 * Sistema de notificaciones (Toasts), reutilizable desde cualquier
 * módulo del proyecto MALKA, no solo Vacantes.
 *
 * Uso:
 *   import { mostrarToast } from '../components/feedback.js';
 *   mostrarToast('Vacante creada correctamente.', 'success');
 */

const ICONOS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '!'
};

let contenedor = null;

function obtenerContenedor() {
  if (contenedor && document.body.contains(contenedor)) {
    return contenedor;
  }
  contenedor = document.createElement('div');
  contenedor.className = 'toast-container';
  contenedor.setAttribute('aria-live', 'polite');
  document.body.appendChild(contenedor);
  return contenedor;
}

/**
 * Muestra un toast en la esquina superior derecha.
 * @param {string} mensaje
 * @param {'success'|'error'|'info'|'warning'} tipo
 * @param {number} duracionMs
 */
export function mostrarToast(mensaje, tipo = 'info', duracionMs = 4000) {
  const cont = obtenerContenedor();

  const toast = document.createElement('div');
  toast.className = `toast toast--${tipo}`;
  toast.innerHTML = `
    <span class="toast__icon">${ICONOS[tipo] || ICONOS.info}</span>
    <span class="toast__text"></span>
    <button type="button" class="toast__close" aria-label="Cerrar">✕</button>
  `;
  toast.querySelector('.toast__text').textContent = mensaje;

  const cerrar = () => {
    if (toast.parentElement) toast.parentElement.removeChild(toast);
  };

  toast.querySelector('.toast__close').addEventListener('click', cerrar);
  cont.appendChild(toast);

  if (duracionMs > 0) {
    setTimeout(cerrar, duracionMs);
  }

  return cerrar;
}

export const toastExito = (mensaje) => mostrarToast(mensaje, 'success');
export const toastError = (mensaje) => mostrarToast(mensaje, 'error');
export const toastInfo = (mensaje) => mostrarToast(mensaje, 'info');
export const toastAdvertencia = (mensaje) => mostrarToast(mensaje, 'warning');
