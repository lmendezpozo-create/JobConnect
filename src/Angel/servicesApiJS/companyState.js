/* companyState.js — Angel (implementación para SPA) */
export class CompanyState {
  constructor() {
    this.companies = [];
  }

  getCompanies() {
    return this.companies;
  }

  setCompanies(companies) {
    this.companies = Array.isArray(companies) ? [...companies] : [];
  }

  addCompany(company) {
    this.companies.unshift(company);
  }

  updateCompany(id, updatedData) {
    const index = this.companies.findIndex(c => String(c.id) === String(id));
    if (index !== -1) {
      this.companies[index] = { ...this.companies[index], ...updatedData };
    }
  }

  removeCompany(id) {
    this.companies = this.companies.filter(c => String(c.id) !== String(id));
  }
}
