// src/pages/Todos/Todos.jsx
import React, { useState, useEffect } from 'react';
import * as todoService from '../../services/todoService';
import { useFetch } from '../../hooks/useFetch';
import './Todos.css';

const TodoForm = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState(initialData || { title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium', status: 'pending' });

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Título *</label>
        <input name="title" value={form.title} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <textarea name="description" rows="3" value={form.description || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Asignado a</label>
        <input name="assignedTo" value={form.assignedTo || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Fecha límite</label>
        <input type="date" name="dueDate" value={form.dueDate || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Prioridad</label>
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>
      <div className="form-group">
        <label>Estado</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pendiente</option>
          <option value="in_progress">En progreso</option>
          <option value="completed">Completada</option>
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
};

export const Todos = () => {
  const { data: todos, loading, error, fetchAll, create, update, remove } = useFetch(todoService);
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

  if (loading && !todos.length) return <div>Cargando tareas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="todos-page">
      <div className="page-header">
        <h1>Tareas de seguimiento</h1>
        <button onClick={handleOpenCreate}>+ Nueva Tarea</button>
      </div>

      <div className="todos-list">
        {todos.length === 0 ? (
          <p>No hay tareas creadas.</p>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.status === 'completed' ? 'completed' : ''}`}>
              <div className="todo-info">
                <input
                  type="checkbox"
                  checked={todo.status === 'completed'}
                  onChange={() => handleToggleStatus(todo)}
                />
                <div>
                  <h3>{todo.title}</h3>
                  <p>{todo.description}</p>
                  <div className="todo-meta">
                    <span>Asignado: {todo.assignedTo || 'No asignado'}</span>
                    <span>Prioridad: {todo.priority}</span>
                    <span>Vence: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'Sin fecha'}</span>
                  </div>
                </div>
              </div>
              <div className="todo-actions">
                <button onClick={() => handleOpenEdit(todo)}>✏️</button>
                <button onClick={() => handleDelete(todo.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="modal-content">
            <h2>{editing ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
            <TodoForm
              initialData={editing}
              onSubmit={handleSubmit}
              loading={submitting}
            />
            <button onClick={handleCloseModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};