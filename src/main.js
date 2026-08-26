// src/main.js — Panel central (dashboard) de JobConnect.
// Renderiza la portada, los accesos a módulos y una sección “en vivo”
// que refleja los textos reales de db.json servidos por json-server.
import './style.css'

// Icono SVG embutido para no depender de assets externos rotos.
const recruitmentIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
</svg>
`

// ── Tarjetas de acceso a los módulos ────────────────────────────────
const modules = [
  {
    href: './interviews.html',
    icon: '👥',
    title: 'Entrevistas',
    color: 'var(--olive-wood)',
    description: 'Gestiona notas, fechas y estado de los candidatos.',
    tag: 'CRUD',
  },
  {
    href: './todos.html',
    icon: '📋',
    title: 'Tareas',
    color: 'var(--dark-garnet)',
    description: 'Organiza las tareas diarias del equipo reclutador.',
    tag: 'CRUD',
  },
]

const appEl = document.querySelector('#app')
appEl.innerHTML = `
  <!-- Fondos decorativos interactivos -->
  <div class="bg-blob blob-1" aria-hidden="true"></div>
  <div class="bg-blob blob-2" aria-hidden="true"></div>
  <div class="bg-blob blob-3" aria-hidden="true"></div>
  <div class="bg-grid" aria-hidden="true"></div>

  <section class="dashboard__hero">
    <div class="dashboard__badge">Panel de control</div>
    <div class="dashboard__icon">${recruitmentIcon}</div>
    <h1 class="dashboard__title">Sistema de Reclutamiento</h1>
    <p class="dashboard__subtitle">
      Bienvenido al panel central de JobConnect. Gestiona tus procesos de
      selección de manera rápida, ordenada y eficiente.
    </p>
  </section>

  <section class="stats" id="stats" aria-label="Estadísticas del sistema">
    <div class="stats__spinner" aria-hidden="true"></div>
    <p class="stats__hint">Cargando datos…</p>
  </section>

  <section class="modules" aria-label="Módulos disponibles">
    <header class="modules__header">
      <h2 class="modules__title">Módulos</h2>
      <p class="modules__hint">Selecciona un módulo para comenzar</p>
    </header>

    <div class="modules-grid">
      ${modules
        .map(
          (m) => `
            <a href="${m.href}" class="module-card">
              <span class="module-card__icon" aria-hidden="true">${m.icon}</span>
              <span class="module-card__tag" style="color: ${m.color}; border-color: ${m.color}33;">${m.tag}</span>
              <h3 class="module-card__title" style="color: ${m.color};">${m.title}</h3>
              <p class="module-card__description">${m.description}</p>
              <span class="module-card__arrow" aria-hidden="true">→</span>
            </a>
          `
        )
        .join('')}
    </div>
  </section>

  <section class="live" id="live" aria-label="Contenido reciente" hidden>
    <header class="live__header">
      <h2 class="live__title">Contenido reciente</h2>
      <p class="live__hint">Extraído en tiempo real de db.json</p>
    </header>
    <div class="live__grid" id="live-grid"></div>
  </section>

  <p class="data-mode" id="data-mode" aria-live="polite" hidden></p>
`

// ── Render de estadísticas ────────────────────────────────────────
const renderStats = (data) => {
  const statsEl = document.querySelector('#stats')
  if (!statsEl) return
  const counts = [
    { label: 'Entrevistas', value: data.entrevistas.length, icon: '👥', color: 'var(--honey-gold)' },
    { label: 'Tareas', value: data.all.length, icon: '📋', color: 'var(--dark-garnet)' },
    { label: 'Vacantes activas', value: data.vacantes.length, icon: '💼', color: 'var(--dusk-blue)' },
    { label: 'Candidatos', value: data.usuarios.length, icon: '🧑‍💼', color: 'var(--olive-wood)' },
  ]

  statsEl.classList.remove('stats--error')
  statsEl.innerHTML = counts
    .map(
      (s) => `
        <div class="stat-card" style="--card-accent: ${s.color}">
          <span class="stat-card__icon" aria-hidden="true">${s.icon}</span>
          <span class="stat-card__value">${s.value}</span>
          <span class="stat-card__label">${s.label}</span>
        </div>
      `
    )
    .join('')
}

// ── Render de contenido reciente ──────────────────────────────────
const renderRecent = (data) => {
  const liveSection = document.querySelector('#live')
  const grid = document.querySelector('#live-grid')
  if (!liveSection || !grid) return

  const notes = data.comments || []
  const tasks = data.all || []
  grid.innerHTML = ''

  if (notes.length) {
    const block = document.createElement('div')
    block.className = 'live__block'
    block.innerHTML = `
      <h3 class="live__block-title">Notas de entrevistas</h3>
      ${notes
        .map(
          (n) => `
            <article class="live__item">
              <div class="live__item-head">
                <strong>${escapeHtml(n.candidate)}</strong>
                <span class="pill pill--${n.status || 'pending'}">${statusLabel(n.status)}</span>
              </div>
              <p class="live__item-sub">${escapeHtml(n.position || '')}</p>
              <p class="live__item-notes">${escapeHtml(n.notes || '')}</p>
              <time class="live__item-date">${formatDate(n.date)}</time>
            </article>
          `
        )
        .join('')}
    `
    grid.appendChild(block)
  }

  if (tasks.length) {
    const block = document.createElement('div')
    block.className = 'live__block'
    block.innerHTML = `
      <h3 class="live__block-title">Tareas del reclutador</h3>
      ${tasks
        .map(
          (t) => `
            <article class="live__item">
              <div class="live__item-head">
                <strong>${escapeHtml(t.title)}</strong>
                <span class="pill pill--priority pill--${t.priority || 'medium'}">${priorityLabel(t.priority)}</span>
              </div>
              <p class="live__item-sub">Estado: ${statusLabel(t.status)}</p>
              <p class="live__item-notes">${escapeHtml(t.description || '')}</p>
              <time class="live__item-date">Vence: ${formatDate(t.dueDate)}</time>
            </article>
          `
        )
        .join('')}
    `
    grid.appendChild(block)
  }

  if (grid.childElementCount) liveSection.hidden = false
}

// ── Carga principal (API en vivo + fallback a db.json local) ───────
const normalize = (root) => ({
  entrevistas: root.entrevistas || [],
  all: root.all || [],
  vacantes: root.vacantes || [],
  usuarios: root.usuarios || [],
  comments: root.comments || [],
})

const setDataMode = (online) => {
  const note = document.querySelector('#data-mode')
  if (!note) return
  if (online) {
    note.textContent = '● Datos en vivo desde json-server (localhost:3000)'
    note.className = 'data-mode data-mode--online'
  } else {
    note.textContent = '● json-server no detectado: mostrando db.json local'
    note.className = 'data-mode data-mode--local'
  }
  note.hidden = false
}

const loadDashboard = async () => {
  const statsEl = document.querySelector('#stats')
  let data = null
  let online = true

  try {
    const [entrevistas, all = [], vacantes, usuarios, comments] = await Promise.all([
      fetchJson('/entrevistas'),
      fetchJson('/all'),
      fetchJson('/vacantes'),
      fetchJson('/usuarios'),
      fetchJson('/comments'),
    ])
    data = { entrevistas, all, vacantes, usuarios, comments }
  } catch (err) {
    // API caída o sin json-server → cargamos db.json directamente
    online = false
    console.warn('API no disponible, usando db.json local', err)
    try {
      const d = await import('../db.json')
      data = normalize(d.default)
    } catch (err2) {
      console.error('No se pudo leer db.json', err2)
      data = null
    }
  }

  if (data) {
    renderStats(data)
    renderRecent(data)
    setDataMode(online)
  } else if (statsEl) {
    statsEl.classList.add('stats--error')
    statsEl.innerHTML = `
      <p class="stats__hint">No se pudieron cargar los datos.</p>
      <p class="stats__hint">Inicia la API con <code>npm run server</code> (puerto 3000).</p>
    `
  }
}

loadDashboard()
