/**
 * Utilidades de formato para presentar datos de vacantes en la interfaz.
 */

/**
 * Formatea un número como colones costarricenses.
 * @param {number} valor
 * @returns {string}
 */
export function formatearSalario(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return '—';
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0
  }).format(numero);
}

/**
 * Trunca un texto largo agregando puntos suspensivos.
 * @param {string} texto
 * @param {number} limite
 * @returns {string}
 */
export function truncarTexto(texto, limite = 90) {
  if (!texto) return '';
  return texto.length > limite ? `${texto.slice(0, limite).trim()}…` : texto;
}

/**
 * Convierte el estado de una vacante en la clase CSS del badge correspondiente.
 * @param {string} estado
 * @returns {string}
 */
export function claseBadgeEstado(estado) {
  switch (estado) {
    case 'Activa':
      return 'badge badge--activa';
    case 'Pausada':
      return 'badge badge--pausada';
    case 'Cerrada':
      return 'badge badge--cerrada';
    default:
      return 'badge';
  }
}

/**
 * Devuelve las iniciales de un nombre para usarlas en avatares.
 * @param {string} nombre
 * @returns {string}
 */
export function iniciales(nombre) {
  if (!nombre) return '';
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join('');
}
