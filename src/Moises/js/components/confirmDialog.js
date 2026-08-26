// js/components/confirmDialog.js
// Diálogo de confirmación reutilizable para acciones destructivas.
// Usa el markup del HTML (id="delete-dialog", #btn-confirm-delete, etc.)
// y devuelve una Promesa que resuelve a true/false.

export const askConfirm = ({ dialog, message = '¿Confirmar esta acción?' }) =>
  new Promise((resolve) => {
    if (!dialog) {
      resolve(false);
      return;
    }

    const msgEl = dialog.querySelector('#delete-dialog-message');
    const confirmBtn = dialog.querySelector('#btn-confirm-delete');
    const overlay = dialog.querySelector('[data-action="cancel-delete"]');
    const cancelBtns = dialog.querySelectorAll('[data-action="cancel-delete"]');

    if (msgEl) msgEl.textContent = message;
    dialog.hidden = false;

    const finish = (result) => {
      dialog.hidden = true;
      confirmBtn?.removeEventListener('click', onConfirm);
      overlay?.removeEventListener('click', onOverlay);
      cancelBtns.forEach((btn) => btn.removeEventListener('click', onCancel));
      resolve(result);
    };

    const onConfirm = () => finish(true);
    const onCancel = () => finish(false);
    const onOverlay = (e) => {
      if (e.target === overlay) finish(false);
    };

    confirmBtn?.addEventListener('click', onConfirm);
    overlay?.addEventListener('click', onOverlay);
    cancelBtns.forEach((btn) => btn.addEventListener('click', onCancel));
  });