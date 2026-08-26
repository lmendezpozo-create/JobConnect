/**
 * CONTROLADOR DE INTERFAZ DEL MÓDULO EMPRESAS CLIENTES
 */
import { CompanyService } from './companyService.js';
import { CompanyState } from './companyState.js';
import { logoutUser } from './api.js';

const state = new CompanyState();

// Elementos del DOM
const form = document.getElementById('company-form');
const inputId = document.getElementById('company-id');
const inputUserId = document.getElementById('company-userId');
const inputTotal = document.getElementById('company-total');
const tableBody = document.getElementById('companies-table-body');
const btnCancel = document.getElementById('btn-cancel');
const btnLogout = document.getElementById('btn-logout');

/**
 * Renderiza dinámicamente las filas de la tabla según el estado local
 */
function renderTable() {
  const companies = state.getCompanies();
  tableBody.innerHTML = '';

  if (!companies || companies.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay empresas registradas.</td></tr>';
    return;
  }

  companies.forEach(company => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${company.id}</td>
      <td>Usuario ID: ${company.userId}</td>
      <td>$${Number(company.total || 0).toFixed(2)}</td>
      <td>
        <button class="glass-btn btn-edit" data-id="${company.id}">Editar</button>
        <button class="glass-btn glass-btn-danger btn-delete" data-id="${company.id}">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

/**
 * Carga inicial de datos desde la API (GET)
 */
async function init() {
  if (state.getCompanies().length === 0) {
    const { data, error } = await CompanyService.getAll({ limit: 6 });
    if (!error && data?.carts) {
      state.setCompanies(data.carts);
    }
  }
  renderTable();
}

// Evento de Guardar (POST / PUT)
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = inputId.value;
  const payload = {
    userId: Number(inputUserId.value),
    total: Number(inputTotal.value),
    products: []
  };

  if (id) {
    // PUT: Actualización de empresa existente
    const { error } = await CompanyService.update(id, payload);
    if (!error) {
      state.updateCompany(id, { ...payload, id: Number(id) });
      resetForm();
      renderTable();
    }
  } else {
    // POST: Creación de nueva empresa
    const { data, error } = await CompanyService.create(payload);
    if (!error) {
      const newCompany = { ...payload, id: data.id || Date.now() };
      state.addCompany(newCompany);
      resetForm();
      renderTable();
    }
  }
});

// Eventos delegados de Editar y Eliminar (DELETE)
tableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('btn-delete')) {
    if (confirm(`¿Desea eliminar la empresa con ID ${id}?`)) {
      const { error } = await CompanyService.remove(id);
      if (!error) {
        state.removeCompany(id);
        renderTable();
      }
    }
  }

  if (e.target.classList.contains('btn-edit')) {
    const company = state.getCompanies().find(item => item.id === Number(id));
    if (company) {
      inputId.value = company.id;
      inputUserId.value = company.userId;
      inputTotal.value = company.total;
      btnCancel.style.display = 'inline-block';
    }
  }
});

// Cancelar edición
btnCancel.addEventListener('click', resetForm);

// Evento de Cierre de Sesión
btnLogout.addEventListener('click', logoutUser);

function resetForm() {
  form.reset();
  inputId.value = '';
  btnCancel.style.display = 'none';
}

init();