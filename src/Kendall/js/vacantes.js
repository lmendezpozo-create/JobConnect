import {
  obtenerVacantes,
  obtenerVacantePorId,
  crearVacante,
  actualizarVacantePUT,
  actualizarVacantePATCH,
  eliminarVacante,
  ApiError
} from './vacantes.service.js';
import { renderizarTablaVacantes } from './components/tabla-vacantes.js';
import { abrirModalFormulario, abrirModalDetalle } from './components/modal-vacante.js';
import { toastExito, toastError } from './components/feedback.js';
import { ESTADOS_VALIDOS, MODALIDADES_VALIDAS } from './validaciones.js';

/**
 * Renderiza la página completa del módulo de Vacantes dentro del contenedor.
 */
export function renderizarPaginaVacantes(contenedor) {
  const estado = {
    vacantes: [],
    cargando: true,
    filtros: { q: '', estado: '', modalidad: '' }
  };

  contenedor.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-header__title">Vacantes</h1>
        <p class="page-header__subtitle">
          Administra las vacantes publicadas: crea, edita, filtra y da seguimiento
          al estado de cada oportunidad laboral.
        </p>
      </div>
      <button type="button" class="btn btn-primary" id="btn-nueva-vacante">+ Nueva vacante</button>
    </div>

    <div class="toolbar">
      <div class="toolbar__search">
        <span class="toolbar__search-icon">🔎</span>
        <input type="text" id="input-busqueda" placeholder="Buscar por título, empresa o ubicación..." />
      </div>
      <div class="toolbar__filter">
        <select id="filtro-estado">
          <option value="">Todos los estados</option>
          ${ESTADOS_VALIDOS.map((e) => `<option value="${e}">${e}</option>`).join('')}
        </select>
      </div>
      <div class="toolbar__filter">
        <select id="filtro-modalidad">
          <option value="">Todas las modalidades</option>
          ${MODALIDADES_VALIDAS.map((m) => `<option value="${m}">${m}</option>`).join('')}
        </select>
      </div>
      <button type="button" class="toolbar__clear" id="btn-limpiar-filtros">Limpiar filtros</button>
    </div>

    <div id="vacantes-resultado"></div>
  `;

  const resultado = contenedor.querySelector('#vacantes-resultado');
  const inputBusqueda = contenedor.querySelector('#input-busqueda');
  const filtroEstado = contenedor.querySelector('#filtro-estado');
  const filtroModalidad = contenedor.querySelector('#filtro-modalidad');

  contenedor.querySelector('#btn-nueva-vacante').addEventListener('click', abrirCrear);
  contenedor.querySelector('#btn-limpiar-filtros').addEventListener('click', limpiarFiltros);

  let debounceId = null;
  inputBusqueda.addEventListener('input', () => {
    clearTimeout(debounceId);
    debounceId = setTimeout(() => {
      estado.filtros.q = inputBusqueda.value.trim();
      cargarVacantes();
    }, 300);
  });

  filtroEstado.addEventListener('change', () => {
    estado.filtros.estado = filtroEstado.value;
    cargarVacantes();
  });

  filtroModalidad.addEventListener('change', () => {
    estado.filtros.modalidad = filtroModalidad.value;
    cargarVacantes();
  });

  function limpiarFiltros() {
    estado.filtros = { q: '', estado: '', modalidad: '' };
    inputBusqueda.value = '';
    filtroEstado.value = '';
    filtroModalidad.value = '';
    cargarVacantes();
  }

  function mostrarCargando() {
    resultado.innerHTML = `
      <div class="state-panel">
        <div class="spinner"></div>
        <div class="state-panel__title">Cargando vacantes...</div>
      </div>
    `;
  }

  async function cargarVacantes() {
    mostrarCargando();
    try {
      const datos = await obtenerVacantes(estado.filtros);
      estado.vacantes = datos || [];
      renderizarTablaVacantes(resultado, estado.vacantes, {
        onVer: verDetalle,
        onEditar: abrirEditar,
        onEliminar: confirmarEliminar,
        onCambiarEstado: cambiarEstado
      });
    } catch (error) {
      resultado.innerHTML = `
        <div class="state-panel">
          <div class="state-panel__icon">⚠️</div>
          <div class="state-panel__title">No se pudo cargar la información</div>
          <div class="state-panel__text">${error instanceof ApiError ? error.message : 'Verifica que JSON Server esté ejecutándose.'}</div>
        </div>
      `;
    }
  }

  async function verDetalle(id) {
    try {
      const vacante = await obtenerVacantePorId(id);
      abrirModalDetalle(vacante);
    } catch (error) {
      toastError('No se pudo obtener el detalle de la vacante.');
    }
  }

  function abrirCrear() {
    abrirModalFormulario({
      modo: 'crear',
      onGuardar: async (datos) => {
        try {
          await crearVacante(datos);
          toastExito('Vacante creada correctamente.');
          await cargarVacantes();
        } catch (error) {
          toastError('No se pudo crear la vacante.');
          throw error;
        }
      }
    });
  }

  async function abrirEditar(id) {
    try {
      const vacante = await obtenerVacantePorId(id);
      abrirModalFormulario({
        modo: 'editar',
        vacante,
        onGuardar: async (datos) => {
          try {
            await actualizarVacantePUT(id, datos);
            toastExito('Vacante actualizada correctamente.');
            await cargarVacantes();
          } catch (error) {
            toastError('No se pudo actualizar la vacante.');
            throw error;
          }
        }
      });
    } catch (error) {
      toastError('No se pudo cargar la vacante para editar.');
    }
  }

  async function cambiarEstado(id, nuevoEstado) {
    try {
      await actualizarVacantePATCH(id, { estado: nuevoEstado });
      toastExito('Estado de vacante actualizado.');
      await cargarVacantes();
    } catch (error) {
      toastError('No se pudo actualizar el estado.');
      await cargarVacantes();
    }
  }

  async function confirmarEliminar(id) {
    const vacante = estado.vacantes.find((v) => v.id === id);
    const nombre = vacante ? vacante.titulo : `#${id}`;
    const confirmado = window.confirm(`¿Eliminar la vacante "${nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    try {
      await eliminarVacante(id);
      toastExito('Vacante eliminada correctamente.');
      await cargarVacantes();
    } catch (error) {
      toastError('No se pudo eliminar la vacante.');
    }
  }

  cargarVacantes();
}
