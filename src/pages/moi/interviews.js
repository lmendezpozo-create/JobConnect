// src/pages/Interviews/Interviews.js
import React, { useState, useEffect } from 'react';
import * as interviewService from '../../services/moi/interviewServices.js';
import { useFetch } from '../../hooks/useFetch';
import './interviews.css';

const InterviewForm = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState(initialData || {
    fecha: '',
    hora: '',
    lugar: '',
    postulante: '',
    vacante: ''
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fecha || !form.hora || !form.lugar || !form.postulante || !form.vacante) {
      alert('Fecha, hora, lugar, postulante y vacante son obligatorios');
      return;
    }
    onSubmit(form);
  };

  return React.createElement(
    'form',
    { onSubmit: handleSubmit },
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Fecha * '),
      React.createElement('input', {
        type: 'date',
        name: 'fecha',
        value: form.fecha || '',
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Hora * '),
      React.createElement('input', {
        type: 'time',
        name: 'hora',
        value: form.hora || '',
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Lugar * '),
      React.createElement('input', {
        name: 'lugar',
        value: form.lugar,
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Postulante (id) * '),
      React.createElement('input', {
        name: 'postulante',
        value: form.postulante,
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Vacante (id) * '),
      React.createElement('input', {
        name: 'vacante',
        value: form.vacante,
        onChange: handleChange
      })
    ),
    React.createElement(
      'button',
      { type: 'submit', disabled: loading },
      loading ? 'Guardando...' : 'Guardar'
    )
  );
};

export const Interviews = () => {
  const {
    data: interviews,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove
  } = useFetch(interviewService);

  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleOpenEdit = (interview) => {
    setEditing(interview);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await update(editing.id, data);
      } else {
        await create(data);
      }
      handleCloseModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta entrevista?')) {
      try {
        await remove(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading && !interviews.length) {
    return React.createElement('div', null, 'Cargando entrevistas...');
  }
  if (error) {
    return React.createElement('div', null, 'Error: ', error);
  }

  return React.createElement(
    'div',
    { className: 'interviews-page' },
    React.createElement(
      'div',
      { className: 'page-header' },
      React.createElement('h1', null, 'Entrevistas'),
      React.createElement(
        'button',
        { onClick: handleOpenCreate },
        '+ Nueva Entrevista'
      )
    ),
    React.createElement(
      'div',
      { className: 'interviews-list' },
      interviews.length === 0
        ? React.createElement('p', null, 'No hay entrevistas registradas.')
        : interviews.map((item) =>
            React.createElement(
              'div',
              { key: item.id, className: 'interview-card' },
              React.createElement('h3', null, `Postulante ${item.postulante}`),
              React.createElement(
                'p',
                null,
                React.createElement('strong', null, 'Vacante:'),
                ' ',
                item.vacante
              ),
              React.createElement(
                'p',
                null,
                React.createElement('strong', null, 'Fecha:'),
                ' ',
                item.fecha
                  ? new Date(`${item.fecha}T00:00:00`).toLocaleDateString()
                  : 'Pendiente'
              ),
              React.createElement(
                'p',
                null,
                React.createElement('strong', null, 'Hora:'),
                ' ',
                item.hora
              ),
              React.createElement(
                'p',
                null,
                React.createElement('strong', null, 'Lugar:'),
                ' ',
                item.lugar
              ),
              React.createElement(
                'div',
                { className: 'card-actions' },
                React.createElement(
                  'button',
                  { onClick: () => handleOpenEdit(item) },
                  '✏️ Editar'
                ),
                React.createElement(
                  'button',
                  { onClick: () => handleDelete(item.id) },
                  '🗑️ Eliminar'
                )
              )
            )
          )
    ),
    showModal &&
      React.createElement(
        'div',
        {
          className: 'modal-overlay',
          onClick: (e) => e.target === e.currentTarget && handleCloseModal()
        },
        React.createElement(
          'div',
          { className: 'modal-content' },
          React.createElement(
            'h2',
            null,
            editing ? 'Editar Entrevista' : 'Nueva Entrevista'
          ),
          React.createElement(InterviewForm, {
            initialData: editing,
            onSubmit: handleSubmit,
            loading: submitting
          }),
          React.createElement(
            'button',
            { onClick: handleCloseModal },
            'Cancelar'
          )
        )
      )
  );
};