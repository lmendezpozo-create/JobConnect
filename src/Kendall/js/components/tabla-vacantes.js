import { formatearSalario, truncarTexto, claseBadgeEstado } from '../formateador.js';
import { ESTADOS_VALIDOS } from '../validaciones.js';

/**
 * Renderiza la tabla de vacantes dentro de un contenedor.
 */
export function renderizarTablaVacantes(contenedor, vacantes, callbacks) {
  const { onVer, onEditar, onEliminar, onCambiarEstado } = callbacks;

  if (!vacantes || vacantes.length === 0) {
    contenedor.innerHTML = `
      <div class="state-panel">
        <div class="state-panel__icon">🗂️</div>
        <div class="state-panel__title">No hay vacantes para mostrar</div>
        <div class="state-panel__text">Ajusta la búsqueda o los filtros, o crea una nueva vacante para comenzar.</div>
      </div>
    `;
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'table-wrap';

  const tabla = document.createElement('table');
  tabla.className = 'data-table';
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Título</th>
        <th>Empresa</th>
        <th>Ubicación</th>
        <th>Modalidad</th>
        <th>Contrato</th>
        <th>Salario</th>
        <th>Categoría</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = tabla.querySelector('tbody');

  vacantes.forEach((vacante) => {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td data-label="ID"><span class="data-table__id">#${vacante.id}</span></td>
      <td data-label="Título"><span class="data-table__title">${escapeHtml(vacante.titulo)}</span></td>
      <td data-label="Empresa">${escapeHtml(vacante.empresa)}</td>
      <td data-label="Ubicación">${escapeHtml(vacante.ubicacion)}</td>
      <td data-label="Modalidad">${escapeHtml(vacante.modalidad)}</td>
      <td data-label="Contrato">${escapeHtml(vacante.tipoContrato)}</td>
      <td data-label="Salario">${formatearSalario(vacante.salario)}</td>
      <td data-label="Categoría">${escapeHtml(vacante.categoria)}</td>
      <td data-label="Estado"></td>
      <td data-label="Acciones"></td>
    `;

    const celdaEstado = fila.children[8];
    const badge = document.createElement('span');
    badge.className = claseBadgeEstado(vacante.estado);
    badge.textContent = vacante.estado;

    const selectEstado = document.createElement('select');
    selectEstado.className = 'status-select';
    selectEstado.title = 'Cambiar estado (PATCH)';
    ESTADOS_VALIDOS.forEach((estado) => {
      const opcion = document.createElement('option');
      opcion.value = estado;
      opcion.textContent = estado;
      opcion.selected = estado === vacante.estado;
      selectEstado.appendChild(opcion);
    });
    selectEstado.addEventListener('change', () => {
      onCambiarEstado(vacante.id, selectEstado.value);
    });

    celdaEstado.style.display = 'flex';
    celdaEstado.style.flexDirection = 'column';
    celdaEstado.style.gap = '6px';
    celdaEstado.style.alignItems = 'flex-end';
    celdaEstado.appendChild(badge);
    celdaEstado.appendChild(selectEstado);

    const celdaAcciones = fila.children[9];
    celdaAcciones.className = 'data-table__actions';

    celdaAcciones.appendChild(crearBoton('Ver', 'btn-secondary', () => onVer(vacante.id)));
    celdaAcciones.appendChild(crearBoton('Editar', 'btn-secondary', () => onEditar(vacante.id)));
    celdaAcciones.appendChild(crearBoton('Eliminar', 'btn-danger', () => onEliminar(vacante.id)));

    tbody.appendChild(fila);
  });

  wrap.appendChild(tabla);
  contenedor.innerHTML = '';
  contenedor.appendChild(wrap);
}

function crearBoton(texto, clase, onClick) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = `btn ${clase} btn-sm`;
  boton.textContent = texto;
  boton.addEventListener('click', onClick);
  return boton;
}

function escapeHtml(valor) {
  if (valor === undefined || valor === null) return '';
  return String(valor).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
