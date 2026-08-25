// src/pages/Interviews/Interviews.js
import React, { useState, useEffect } from 'react';
import * as interviewService from '../../services/interviewService';
import { useFetch } from '../../hooks/useFetch';
import './Interviews.css';

const InterviewForm = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState(initialData || {
    candidateName: '',
    position: '',
    date: '',
    notes: '',
    status: 'scheduled'
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
    if (!form.candidateName || !form.position) {
      alert('Nombre del candidato y puesto son obligatorios');
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
      React.createElement('label', null, 'Candidato * '),
      React.createElement('input', {
        name: 'candidateName',
        value: form.candidateName,
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Puesto * '),
      React.createElement('input', {
        name: 'position',
        value: form.position,
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Fecha '),
      React.createElement('input', {
        type: 'date',
        name: 'date',
        value: form.date || '',
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Notas '),
      React.createElement('textarea', {
        name: 'notes',
        rows: '3',
        value: form.notes || '',
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Estado '),
      React.createElement(
        'select',
        { name: 'status', value: form.status, onChange: handleChange },
        React.createElement('option', { value: 'scheduled' }, 'Agendada'),
        React.createElement('option', { value: 'completed' }, 'Completada'),
        React.createElement('option', { value: 'cancelled' }, 'Cancelada')
      )
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
              React.createElement('h3', null, item.candidateName),
              React.createElement(
                'p',
                null,
                React.createElement('strong', null, 'Puesto:'),
                ' ',
                item.position
              ),
              React.createElement(
                'p',
                null,
                React.createElement('strong', null, 'Fecha:'),
                ' ',
                item.date
                  ? new Date(item.date).toLocaleDateString()
                  : 'Pendiente'
              ),
              React.createElement(
                'p',
                null,
                React.createElement('strong', null, 'Estado:'),
                ' ',
                item.status
              ),
              React.createElement('p', null, item.notes),
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