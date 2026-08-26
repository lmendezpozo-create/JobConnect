/**
 * Header principal del sistema MALKA.
 * Compartido por todos los módulos.
 */

export function crearHeader({ onToggleSidebar } = {}) {
  const header = document.createElement('header');
  header.className = 'app-header';

  header.innerHTML = `
    <div class="app-header__left">
      <button type="button" class="app-header__menu-toggle" aria-label="Abrir menú">☰</button>
      <div class="app-header__brand">
        <div class="app-header__logo">MK</div>
        <div>
          <div class="app-header__title">MALKA</div>
          <div class="app-header__subtitle">Sistema de gestión de empleabilidad</div>
        </div>
      </div>
    </div>
    <div class="app-header__right">
      <div class="app-header__user">
        <div class="app-header__avatar">RH</div>
        <span>Equipo de Reclutamiento</span>
      </div>
    </div>
  `;

  const toggleBtn = header.querySelector('.app-header__menu-toggle');
  if (onToggleSidebar) {
    toggleBtn.addEventListener('click', onToggleSidebar);
  }

  return header;
}
