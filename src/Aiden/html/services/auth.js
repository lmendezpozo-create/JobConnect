import { CONFIG } from '../../../../JobConnect/Malka-Brete/config.js';
const SESSION_KEY = 'jobconnect_usuario';
const routes = { admin: 'dashboard-admin.html', reclutador: 'dashboard-reclutador.html', candidato: 'dashboard-candidato.html' };
export async function login(username, password) { const r = await fetch(`${CONFIG.API_BASE_URL}/usuarios?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`); if (!r.ok) throw new Error('No fue posible validar las credenciales.'); const [u] = await r.json(); if (!u) throw new Error('Usuario o contraseña incorrectos'); localStorage.setItem(SESSION_KEY, JSON.stringify(u)); return u; }
export function logout() { localStorage.removeItem(SESSION_KEY); location.href = 'login.html'; }
export function getUsuario() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } }
export function isAuthenticated() { return Boolean(getUsuario()); }
export function getRol() { return getUsuario()?.rol || null; }
export function redirectByRole() { const route = routes[getRol()]; location.href = route ? (location.pathname.includes('/pages/') ? route : `pages/${route}`) : (location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html'); }
export function requireAuth(roles = []) { if (!isAuthenticated()) { location.href = 'login.html'; return null; } if (roles.length && !roles.includes(getRol())) { redirectByRole(); return null; } return getUsuario(); }
