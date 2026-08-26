/**
 * CONTROLADOR DE INTERFAZ DEL MÓDULO EMPRESAS CLIENTES — Angel (adaptado)
 */
import { CompanyService } from './companyService.js';
import { CompanyState } from './companyState.js';
import { logoutUser } from './api.js';

const state = new CompanyState();

const form = document.getElementById('company-form');
const inputId = document.getElementById('company-id');
const inputNombre = document.getElementById('company-nombre');
const inputContacto = document.getElementById('company-contacto');
const inputTelefono = document.getElementById('company-telefono');
const inputDireccion = document.getElementById('company-direccion');
const inputSector = document.getElementById('company-sector');
const tableBody = document.getElementById('companies-table-body');
const btnCancel = document.getElementById('btn-cancel');
const btnLogout = document.getElementById('btn-logout');

function renderTable() {
  const companies = state.getCompanies();
  tableBody.innerHTML = '';

  if (!companies || companies.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay empresas registradas.</td></tr>';
    return;
  }

  companies.forEach(company => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${company.id}</td>
      <td>${company.nombre || '—'}</td>
      <td>${company.contacto || '—'}</td>
      <td>${company.telefono || '—'}</td>
      <td>${company.sector || '—'}</td>
      <td>
        <button class="btn btn-secondary btn-sm btn-edit" data-id="${company.id}">Editar</button>
        <button class="btn btn-danger btn-sm btn-delete" data-id="${company.id}">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

async function init() {
  if (state.getCompanies().length === 0) {
    const { data, error } = await CompanyService.getAll();
    if (!error && Array.isArray(data)) {
      state.setCompanies(data);
    }
  }
  renderTable();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = inputId.value;
  const payload = {
    nombre: inputNombre.value.trim(),
    contacto: inputContacto.value.trim(),
    telefono: inputTelefono.value.trim(),
    direccion: inputDireccion.value.trim(),
    sector: inputSector.value.trim()
  };

  if (id) {
    const { error } = await CompanyService.update(id, payload);
    if (!error) {
      state.updateCompany(id, { ...payload, id: Number(id) });
      resetForm();
      renderTable();
    }
  } else {
    const { data, error } = await CompanyService.create(payload);
    if (!error) {
      const newCompany = { ...payload, id: data?.id || Date.now() };
      state.addCompany(newCompany);
      resetForm();
      renderTable();
    }
  }
});

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
    const company = state.getCompanies().find(item => String(item.id) === String(id));
    if (company) {
      inputId.value = company.id;
      inputNombre.value = company.nombre || '';
      inputContacto.value = company.contacto || '';
      inputTelefono.value = company.telefono || '';
      inputDireccion.value = company.direccion || '';
      inputSector.value = company.sector || '';
      btnCancel.style.display = 'inline-block';
    }
  }
});

btnCancel.addEventListener('click', resetForm);
btnLogout.addEventListener('click', logoutUser);

function resetForm() {
  form.reset();
  inputId.value = '';
  btnCancel.style.display = 'none';
}

init();
