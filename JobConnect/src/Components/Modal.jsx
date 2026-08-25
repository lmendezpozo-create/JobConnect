// src/components/Modal.jsx
import React from 'react';
import './Modal.css';

/**
 * Componente Modal reutilizable para formularios
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {string} props.title - Título del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {ReactNode} props.children - Contenido del modal
 */
const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal__overlay" onClick={handleOverlayClick}>
      <div className="modal__container">
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button 
            className="modal__close-btn" 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;