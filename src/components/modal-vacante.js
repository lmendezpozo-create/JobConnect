import { validarVacante, ESTADOS_VALIDOS, MODALIDADES_VALIDAS, CONTRATOS_VALIDOS } from '../utils/validaciones.js';
import { formatearSalario, claseBadgeEstado } from '../utils/formateador.js';

const VACIA = {
  titulo: '',
  descripcion: '',
  empresa: 'MALKA',
  ubicacion: '',
  modalidad: '',
  tipoContrato: '',
  salario: '',
  categoria: '',
  estado: 'Activa'
};

/**
 * Abre un modal de creación/edición de vacante.
 *
 * @param {{
 *   modo: 'crear' | 'editar',
 *   vacante?: object,
 *   onGuardar: (datos: object) => Promise<void>|void
 * }} opciones
 */
export function abrirModalFormulario({ modo = 'crear', vacante = null, onGuardar }) {
  const datosIniciales = modo === 'editar' && vacante ? { ...vacante } : { ...VACIA };

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-card__header">
        <h3 class="modal-card__title">${modo === 'editar' ? 'Editar vacante' : 'Nueva vacante'}</h3>
        <button type="button" class="modal-card__close" aria-label="Cerrar">✕</button>
      </div>
      <div class="modal-card__body">
        <form id="form-vacante" novalidate>
          <div class="form-grid">
            ${campoTexto('titulo', 'Título del puesto', datosIniciales.titulo, true, 'full')}
            ${campoTextarea('descripcion', 'Descripción', datosIniciales.descripcion, true)}
            ${campoTexto('empresa', 'Empresa', datosIniciales.empresa, true)}
            ${campoTexto('ubicacion', 'Ubicación', datosIniciales.ubicacion, true)}
            ${campoSelect('modalidad', 'Modalidad', MODALIDADES_VALIDAS, datosIniciales.modalidad, true)}
            ${campoSelect('tipoContrato', 'Tipo de contrato', CONTRATOS_VALIDOS, datosIniciales.tipoContrato, true)}
            ${campoNumero('salario', 'Salario mensual (₡)', datosIniciales.salario, true)}
            ${campoTexto('categoria', 'Categoría', datosIniciales.categoria, true)}
            ${campoSelect('estado', 'Estado', ESTADOS_VALIDOS, datosIniciales.estado, true)}
          </div>
        </form>
      </div>
      <div class="modal-card__footer">
        <button type="button" class="btn btn-secondary" data-accion="cancelar">Cancelar</button>
        <button type="submit" form="form-vacante" class="btn btn-primary" data-accion="guardar">
          ${modo === 'editar' ? 'Guardar cambios' : 'Crear vacante'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const cerrar = () => {
    if (overlay.parentElement) overlay.parentElement.removeChild(overlay);
  };

  overlay.querySelector('.modal-card__close').addEventListener('click', cerrar);
  overlay.querySelector('[data-accion="cancelar"]').addEventListener('click', cerrar);
  overlay.addEventListener('click', (evento) => {
    if (evento.target === overlay) cerrar();
  });

  const form = overlay.querySelector('#form-vacante');
  const botonGuardar = overlay.querySelector('[data-accion="guardar"]');

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limpiarErrores(form);

    const formData = new FormData(form);
    const datos = {
      titulo: formData.get('titulo')?.trim() || '',
      descripcion: formData.get('descripcion')?.trim() || '',
      empresa: formData.get('empresa')?.trim() || '',
      ubicacion: formData.get('ubicacion')?.trim() || '',
      modalidad: formData.get('modalidad') || '',
      tipoContrato: formData.get('tipoContrato') || '',
      salario: formData.get('salario') || '',
      categoria: formData.get('categoria')?.trim() || '',
      estado: formData.get('estado') || ''
    };

    const { valido, errores } = validarVacante(datos);

    if (!valido) {
      mostrarErrores(form, errores);
      return;
    }

    datos.salario = Number(datos.salario);
    if (modo === 'editar' && vacante) {
      datos.id = vacante.id;
    }

    botonGuardar.disabled = true;
    botonGuardar.textContent = 'Guardando...';

    try {
      await onGuardar(datos);
      cerrar();
    } finally {
      botonGuardar.disabled = false;
      botonGuardar.textContent = modo === 'editar' ? 'Guardar cambios' : 'Crear vacante';
    }
  });

  return cerrar;
}

/**
 * Abre un modal de solo lectura con el detalle de una vacante.
 * @param {object} vacante
 */
export function abrirModalDetalle(vacante) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-card__header">
        <h3 class="modal-card__title">Detalle de la vacante</h3>
        <button type="button" class="modal-card__close" aria-label="Cerrar">✕</button>
      </div>
      <div class="modal-card__body">
        <div class="detalle-grid">
          <div class="detalle-item detalle-item--full">
            <span class="detalle-item__label">Título</span>
            <span class="detalle-item__value">${vacante.titulo}</span>
          </div>
          <div class="detalle-item detalle-item--full">
            <span class="detalle-item__label">Descripción</span>
            <span class="detalle-item__value">${vacante.descripcion}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-item__label">Empresa</span>
            <span class="detalle-item__value">${vacante.empresa}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-item__label">Ubicación</span>
            <span class="detalle-item__value">${vacante.ubicacion}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-item__label">Modalidad</span>
            <span class="detalle-item__value">${vacante.modalidad}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-item__label">Tipo de contrato</span>
            <span class="detalle-item__value">${vacante.tipoContrato}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-item__label">Salario</span>
            <span class="detalle-item__value">${formatearSalario(vacante.salario)}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-item__label">Categoría</span>
            <span class="detalle-item__value">${vacante.categoria}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-item__label">Estado</span>
            <span class="${claseBadgeEstado(vacante.estado)}">${vacante.estado}</span>
          </div>
        </div>
      </div>
      <div class="modal-card__footer">
        <button type="button" class="btn btn-primary" data-accion="cerrar">Cerrar</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const cerrar = () => {
    if (overlay.parentElement) overlay.parentElement.removeChild(overlay);
  };

  overlay.querySelector('.modal-card__close').addEventListener('click', cerrar);
  overlay.querySelector('[data-accion="cerrar"]').addEventListener('click', cerrar);
  overlay.addEventListener('click', (evento) => {
    if (evento.target === overlay) cerrar();
  });

  return cerrar;
}

/* ===== Helpers de construcción de campos ===== */

function campoTexto(nombre, etiqueta, valor = '', requerido = false, ancho = '') {
  return `
    <div class="form-field ${ancho === 'full' ? 'form-field--full' : ''}" data-campo="${nombre}">
      <label for="campo-${nombre}">${etiqueta}${requerido ? ' *' : ''}</label>
      <input type="text" id="campo-${nombre}" name="${nombre}" value="${escapeAttr(valor)}" />
      <span class="form-field__error"></span>
    </div>
  `;
}

function campoNumero(nombre, etiqueta, valor = '', requerido = false) {
  return `
    <div class="form-field" data-campo="${nombre}">
      <label for="campo-${nombre}">${etiqueta}${requerido ? ' *' : ''}</label>
      <input type="number" min="0" step="1000" id="campo-${nombre}" name="${nombre}" value="${escapeAttr(valor)}" />
      <span class="form-field__error"></span>
    </div>
  `;
}

function campoTextarea(nombre, etiqueta, valor = '', requerido = false) {
  return `
    <div class="form-field form-field--full" data-campo="${nombre}">
      <label for="campo-${nombre}">${etiqueta}${requerido ? ' *' : ''}</label>
      <textarea id="campo-${nombre}" name="${nombre}">${valor || ''}</textarea>
      <span class="form-field__error"></span>
    </div>
  `;
}

function campoSelect(nombre, etiqueta, opciones, valorSeleccionado = '', requerido = false) {
  const opcionesHtml = opciones
    .map((op) => `<option value="${op}" ${op === valorSeleccionado ? 'selected' : ''}>${op}</option>`)
    .join('');

  return `
    <div class="form-field" data-campo="${nombre}">
      <label for="campo-${nombre}">${etiqueta}${requerido ? ' *' : ''}</label>
      <select id="campo-${nombre}" name="${nombre}">
        <option value="" disabled ${!valorSeleccionado ? 'selected' : ''}>Selecciona una opción</option>
        ${opcionesHtml}
      </select>
      <span class="form-field__error"></span>
    </div>
  `;
}

function mostrarErrores(form, errores) {
  Object.entries(errores).forEach(([campo, mensaje]) => {
    const contenedorCampo = form.querySelector(`[data-campo="${campo}"]`);
    if (!contenedorCampo) return;
    contenedorCampo.classList.add('has-error');
    const spanError = contenedorCampo.querySelector('.form-field__error');
    if (spanError) spanError.textContent = mensaje;
  });
}

function limpiarErrores(form) {
  form.querySelectorAll('.form-field').forEach((campo) => {
    campo.classList.remove('has-error');
    const spanError = campo.querySelector('.form-field__error');
    if (spanError) spanError.textContent = '';
  });
}

function escapeAttr(valor) {
  if (valor === undefined || valor === null) return '';
  return String(valor).replace(/"/g, '&quot;');
}
