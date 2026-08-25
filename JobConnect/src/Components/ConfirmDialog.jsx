// src/components/ConfirmDialog.jsx
import React from 'react';
import './ConfirmDialog.css';

/**
 * Componente de diálogo de confirmación para acciones destructivas
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del diálogo
 * @param {string} props.title - Título del diálogo
 * @param {string} props.message - Mensaje de confirmación
 * @param {Function} props.onConfirm - Función a ejecutar al confirmar
 * @param {Function} props.onCancel - Función a ejecutar al cancelar
 */
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog__overlay">
      <div className="confirm-dialog__container">
        <div className="confirm-dialog__header">
          <h3 className="confirm-dialog__title">{title}</h3>
        </div>
        <div className="confirm-dialog__body">
          <p className="confirm-dialog__message">{message}</p>
        </div>
        <div className="confirm-dialog__footer">
          <button 
            className="btn btn--secondary" 
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            className="btn btn--danger" 
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;