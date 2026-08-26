/**
 * Sidebar principal del sistema MALKA.
 *
 * Deja preparados los 6 módulos del proyecto. Solo "Vacantes" está
 * funcional (responsabilidad de este módulo); el resto queda como
 * espacio reservado para que cada compañero integre su propio CRUD
 * enlazando su página en el callback onNavigate.
 */

const MODULOS = [
  { id: 'candidatos', icono: '👤', nombre: 'Candidatos', disponible: false },
  { id: 'vacantes', icono: '💼', nombre: 'Vacantes', disponible: true },
  { id: 'empresas', icono: '🏢', nombre: 'Empresas', disponible: false },
  { id: 'postulaciones', icono: '📄', nombre: 'Postulaciones', disponible: false },
  { id: 'entrevistas', icono: '📝', nombre: 'Entrevistas / Notas', disponible: false },
  { id: 'tareas', icono: '✅', nombre: 'Tareas', disponible: false }
];

/**
 * @param {{ activo?: string, onNavigate?: (idModulo: string) => void }} opciones
 */
export function crearSidebar({ activo = 'vacantes', onNavigate } = {}) {
  const aside = document.createElement('aside');
  aside.className = 'app-sidebar';
  aside.id = 'app-sidebar';

  const nav = document.createElement('nav');
  nav.className = 'app-sidebar__nav';

  const titulo = document.createElement('div');
  titulo.className = 'app-sidebar__section-title';
  titulo.textContent = 'Módulos';
  aside.appendChild(titulo);

  MODULOS.forEach((modulo) => {
    const item = document.createElement('a');
    item.href = '#';
    item.dataset.modulo = modulo.id;
    item.className = 'app-sidebar__item';
    if (modulo.id === activo) item.classList.add('app-sidebar__item--active');
    if (!modulo.disponible) item.classList.add('app-sidebar__item--disabled');

    item.innerHTML = `
      <span class="app-sidebar__icon">${modulo.icono}</span>
      <span>${modulo.nombre}</span>
      ${!modulo.disponible ? '<span class="app-sidebar__badge">Próximamente</span>' : ''}
    `;

    item.addEventListener('click', (evento) => {
      evento.preventDefault();
      if (!modulo.disponible) return;
      if (onNavigate) onNavigate(modulo.id);
    });

    nav.appendChild(item);
  });

  aside.appendChild(nav);
  return aside;
}
