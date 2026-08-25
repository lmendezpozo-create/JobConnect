// src/pages/Interviews/Interviews.jsx
import React, { useState, useEffect } from 'react';
import * as interviewService from '../../services/interviewService';
import { useFetch } from '../../hooks/useFetch';
import './Interviews.css'; // puedes agregar estilos

const InterviewForm = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState(initialData || { candidateName: '', position: '', date: '', notes: '', status: 'scheduled' });

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Candidato *</label>
        <input name="candidateName" value={form.candidateName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Puesto *</label>
        <input name="position" value={form.position} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Fecha</label>
        <input type="date" name="date" value={form.date || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Notas</label>
        <textarea name="notes" rows="3" value={form.notes || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Estado</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="scheduled">Agendada</option>
          <option value="completed">Completada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
};

export const Interviews = () => {
  const { data: interviews, loading, error, fetchAll, create, update, remove } = useFetch(interviewService);
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

  if (loading && !interviews.length) return <div>Cargando entrevistas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="interviews-page">
      <div className="page-header">
        <h1>Entrevistas</h1>
        <button onClick={handleOpenCreate}>+ Nueva Entrevista</button>
      </div>

      <div className="interviews-list">
        {interviews.length === 0 ? (
          <p>No hay entrevistas registradas.</p>
        ) : (
          interviews.map((item) => (
            <div key={item.id} className="interview-card">
              <h3>{item.candidateName}</h3>
              <p><strong>Puesto:</strong> {item.position}</p>
              <p><strong>Fecha:</strong> {item.date ? new Date(item.date).toLocaleDateString() : 'Pendiente'}</p>
              <p><strong>Estado:</strong> {item.status}</p>
              <p>{item.notes}</p>
              <div className="card-actions">
                <button onClick={() => handleOpenEdit(item)}>✏️ Editar</button>
                <button onClick={() => handleDelete(item.id)}>🗑️ Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal simple (puedes usar un componente Modal más elaborado) */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="modal-content">
            <h2>{editing ? 'Editar Entrevista' : 'Nueva Entrevista'}</h2>
            <InterviewForm
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