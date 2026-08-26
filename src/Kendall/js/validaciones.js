/**
 * Utilidades de validación para el módulo de Vacantes.
 * No depende de la API ni del DOM: recibe datos y devuelve un resultado.
 */

const ESTADOS_VALIDOS = ['Activa', 'Pausada', 'Cerrada'];
const MODALIDADES_VALIDAS = ['Presencial', 'Híbrido', 'Remoto'];
const CONTRATOS_VALIDOS = [
  'Tiempo completo',
  'Medio tiempo',
  'Temporal',
  'Práctica profesional'
];

/**
 * Valida los datos de una vacante antes de enviarlos a la API.
 * @param {object} datos
 * @returns {{ valido: boolean, errores: Object<string,string> }}
 */
export function validarVacante(datos) {
  const errores = {};

  if (!datos.titulo || !datos.titulo.trim()) {
    errores.titulo = 'El título es obligatorio.';
  } else if (datos.titulo.trim().length < 3) {
    errores.titulo = 'El título debe tener al menos 3 caracteres.';
  }

  if (!datos.descripcion || !datos.descripcion.trim()) {
    errores.descripcion = 'La descripción es obligatoria.';
  } else if (datos.descripcion.trim().length < 10) {
    errores.descripcion = 'La descripción debe tener al menos 10 caracteres.';
  }

  if (!datos.empresa || !datos.empresa.trim()) {
    errores.empresa = 'La empresa es obligatoria.';
  }

  if (!datos.ubicacion || !datos.ubicacion.trim()) {
    errores.ubicacion = 'La ubicación es obligatoria.';
  }

  if (!datos.modalidad || !MODALIDADES_VALIDAS.includes(datos.modalidad)) {
    errores.modalidad = 'Selecciona una modalidad válida.';
  }

  if (!datos.tipoContrato || !CONTRATOS_VALIDOS.includes(datos.tipoContrato)) {
    errores.tipoContrato = 'Selecciona un tipo de contrato válido.';
  }

  const salario = Number(datos.salario);
  if (datos.salario === '' || datos.salario === null || datos.salario === undefined) {
    errores.salario = 'El salario es obligatorio.';
  } else if (Number.isNaN(salario) || salario <= 0) {
    errores.salario = 'El salario debe ser un número mayor a 0.';
  }

  if (!datos.categoria || !datos.categoria.trim()) {
    errores.categoria = 'La categoría es obligatoria.';
  }

  if (!datos.estado || !ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.estado = 'Selecciona un estado válido.';
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
}

export { ESTADOS_VALIDOS, MODALIDADES_VALIDAS, CONTRATOS_VALIDOS };
