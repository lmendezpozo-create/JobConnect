import React, { useState, useEffect } from 'react';
import * as todoService from '../../services/';
import { useFetch } from '../../hooks/useFetch';
import './Todos.css';

const TodoForm = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState(initialData || {
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
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
    if (!form.title) {
      alert('El título es obligatorio');
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
      React.createElement('label', null, 'Título * '),
      React.createElement('input', {
        name: 'title',
        value: form.title,
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Descripción '),
      React.createElement('textarea', {
        name: 'description',
        rows: '3',
        value: form.description || '',
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Asignado a '),
      React.createElement('input', {
        name: 'assignedTo',
        value: form.assignedTo || '',
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Fecha límite '),
      React.createElement('input', {
        type: 'date',
        name: 'dueDate',
        value: form.dueDate || '',
        onChange: handleChange
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Prioridad '),
      React.createElement(
        'select',
        { name: 'priority', value: form.priority, onChange: handleChange },
        React.createElement('option', { value: 'low' }, 'Baja'),
        React.createElement('option', { value: 'medium' }, 'Media'),
        React.createElement('option', { value: 'high' }, 'Alta')
      )
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement('label', null, 'Estado '),
      React.createElement(
        'select',
        { name: 'status', value: form.status, onChange: handleChange },
        React.createElement('option', { value: 'pending' }, 'Pendiente'),
        React.createElement('option', { value: 'in_progress' }, 'En progreso'),
        React.createElement('option', { value: 'completed' }, 'Completada')
      )
    ),
    React.createElement(
      'button',
      { type: 'submit', disabled: loading },
      loading ? 'Guardando...' : 'Guardar'
    )
  );
};

export const Todos = () => {
  const {
    data: todos,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove
  } = useFetch(todoService);

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

  const handleOpenEdit = (todo) => {
    setEditing(todo);
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
        // Usamos PUT para edición completa
        await update(editing.id, data, 'put');
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

  // Cambio rápido de estado con PATCH
  const handleToggleStatus = async (todo) => {
    const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
    try {
      // Llamamos a update con 'patch' (por defecto)
      await update(todo.id, { status: newStatus }, 'patch');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta tarea?')) {
      try {
        await remove(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading && !todos.length) {
    return React.createElement('div', null, 'Cargando tareas...');
  }
  if (error) {
    return React.createElement('div', null, 'Error: ', error);
  }

  return React.createElement(
    'div',
    { className: 'todos-page' },
    React.createElement(
      'div',
      { className: 'page-header' },
      React.createElement('h1', null, 'Tareas de seguimiento'),
      React.createElement(
        'button',
        { onClick: handleOpenCreate },
        '+ Nueva Tarea'
      )
    ),
    React.createElement(
      'div',
      { className: 'todos-list' },
      todos.length === 0
        ? React.createElement('p', null, 'No hay tareas creadas.')
        : todos.map((todo) =>
            React.createElement(
              'div',
              {
                key: todo.id,
                className: `todo-item ${
                  todo.status === 'completed' ? 'completed' : ''
                }`
              },
              React.createElement(
                'div',
                { className: 'todo-info' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: todo.status === 'completed',
                  onChange: () => handleToggleStatus(todo)
                }),
                React.createElement(
                  'div',
                  null,
                  React.createElement('h3', null, todo.title),
                  React.createElement('p', null, todo.description),
                  React.createElement(
                    'div',
                    { className: 'todo-meta' },
                    React.createElement(
                      'span',
                      null,
                      'Asignado: ',
                      todo.assignedTo || 'No asignado'
                    ),
                    React.createElement(
                      'span',
                      null,
                      'Prioridad: ',
                      todo.priority
                    ),
                    React.createElement(
                      'span',
                      null,
                      'Vence: ',
                      todo.dueDate
                        ? new Date(todo.dueDate).toLocaleDateString()
                        : 'Sin fecha'
                    )
                  )
                )
              ),
              React.createElement(
                'div',
                { className: 'todo-actions' },
                React.createElement(
                  'button',
                  { onClick: () => handleOpenEdit(todo) },
                  '✏️'
                ),
                React.createElement(
                  'button',
                  { onClick: () => handleDelete(todo.id) },
                  '🗑️'
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
            editing ? 'Editar Tarea' : 'Nueva Tarea'
          ),
          React.createElement(TodoForm, {
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