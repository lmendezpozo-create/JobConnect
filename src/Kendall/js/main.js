import { crearHeader } from './components/header.js';
import { crearSidebar } from './components/sidebar.js';
import { renderizarPaginaVacantes } from './vacantes.js';

/**
 * Punto de entrada de la aplicación MALKA.
 * Arma el layout general (header + sidebar + contenido) y monta el
 * módulo de Vacantes en el área de contenido.
 */
function iniciarApp() {
  const app = document.getElementById('app');

  const contenido = document.createElement('main');
  contenido.className = 'app-content';
  contenido.id = 'app-content';

  const overlay = document.createElement('div');
  overlay.className = 'app-sidebar__overlay';

  const sidebar = crearSidebar({
    activo: 'vacantes',
    onNavigate: (idModulo) => {
      if (idModulo === 'vacantes') {
        renderizarPaginaVacantes(contenido);
      }
    }
  });

  const header = crearHeader({
    onToggleSidebar: () => {
      sidebar.classList.toggle('app-sidebar--open');
      overlay.classList.toggle('app-sidebar__overlay--visible');
    }
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('app-sidebar--open');
    overlay.classList.remove('app-sidebar__overlay--visible');
  });

  app.appendChild(header);
  app.appendChild(sidebar);
  app.appendChild(overlay);
  app.appendChild(contenido);

  renderizarPaginaVacantes(contenido);
}

document.addEventListener('DOMContentLoaded', iniciarApp);
