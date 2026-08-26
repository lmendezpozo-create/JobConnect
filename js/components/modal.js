// js/components/modal.js
// Helpers para abrir/cerrar el modal definido en la página.
// El markup de los modales (interview-modal / todo-modal) ya existe en el HTML;
// aquí únicamente gestionamos la visibilidad vía el atributo [hidden].

export const openModal = (el) => {
  if (el) el.hidden = false;
};

export const closeModal = (el) => {
  if (el) el.hidden = true;
};