/* ===================================================
   PANEL CIENTÍFICO - JavaScript Modular
   Proyecto: Agua Azucarada & Resistencia al Frío
   =================================================== */

// ── DATOS EXPERIMENTALES ─────────────────────────────
const datosSemanas = [
  { semana: 1, fecha: '09 May 2026', control_altura: 20, exp_altura: 20,
    control_flores: 0, exp_flores: 0, control_hojas_danadas: 0, exp_hojas_danadas: 0,
    obs_control: 'Ambas plantas en condiciones iniciales iguales. Sin floración visible.',
    obs_exp: 'Inicio del experimento. Solución azucarada: 5 g/L.', emoji: '🌱', estado: 'Buena' },
  { semana: 2, fecha: '16 May 2026', control_altura: 21.5, exp_altura: 21,
    control_flores: 0, exp_flores: 0, control_hojas_danadas: 0, exp_hojas_danadas: 0,
    obs_control: 'Ligero crecimiento. Sin daños observados.',
    obs_exp: 'Crecimiento similar al control. Tallos firmes.', emoji: '🌿', estado: 'Buena' },
  { semana: 3, fecha: '23 May 2026', control_altura: 23, exp_altura: 22.5,
    control_flores: 1, exp_flores: 1, control_hojas_danadas: 1, exp_hojas_danadas: 0,
    obs_control: 'Primera flor abierta. Una hoja con ligero marchitamiento por frío.',
    obs_exp: 'Primera flor. Sin hojas dañadas hasta el momento.', emoji: '🌼', estado: 'Buena' },
  { semana: 4, fecha: '30 May 2026', control_altura: 25, exp_altura: 24,
    control_flores: 1, exp_flores: 1, control_hojas_danadas: 2, exp_hojas_danadas: 0,
    obs_control: 'Dos hojas secas detectadas. Temperatura nocturna baja.',
    obs_exp: 'Sin hojas dañadas. Flor conservada. Temperatura similar.', emoji: '🌼', estado: 'Buena' },
  { semana: 5, fecha: '06 Jun 2026', control_altura: 26.5, exp_altura: 25.5,
    control_flores: 2, exp_flores: 1, control_hojas_danadas: 3, exp_hojas_danadas: 0,
    obs_control: 'Tres hojas secas. Nuevo botón floral emergente.',
    obs_exp: 'Planta saludable. Sin daños por frío. Flor vigorosa.', emoji: '🌸', estado: 'Excelente' },
  { semana: 6, fecha: '13 Jun 2026', control_altura: 28, exp_altura: 26,
    control_flores: 4, exp_flores: 2, control_hojas_danadas: 4, exp_hojas_danadas: 0,
    obs_control: 'Altura máxima: 28 cm. Cuatro hojas secas. 1 flor + 3 botones.',
    obs_exp: 'Altura: 26 cm. Sin hojas dañadas. 1 flor + 1 botón floral.', emoji: '🌺', estado: 'Excelente' },
];

const semanas = datosSemanas.map(d => `Semana ${d.semana}`);
const alturaControl  = datosSemanas.map(d => d.control_altura);
const alturaExp      = datosSemanas.map(d => d.exp_altura);
const daniosControl  = datosSemanas.map(d => d.control_hojas_danadas);
const daniosExp      = datosSemanas.map(d => d.exp_hojas_danadas);

// ── NAVBAR ACTIVO AL SCROLL ──────────────────────────
function actualizarNavActivo() {
  const secciones = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 90;
  secciones.forEach(s => {
    const top = s.offsetTop;
    const bot = top + s.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bot);
  });
}
window.addEventListener('scroll', actualizarNavActivo);

// ── FADE IN ON SCROLL ────────────────────────────────
function initFadeIn() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in-up').forEach(el => obs.observe(el));
}

// ── CERRAR NAVBAR MÓVIL AL HACER CLICK ──────────────
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('#navbarNav');
    if (collapse && collapse.classList.contains('show')) {
      toggler.click();
    }
  });
});

// ── KPI CARDS DINÁMICOS ──────────────────────────────
function actualizarKPIs() {
  const ultima = datosSemanas[datosSemanas.length - 1];
  document.getElementById('kpi-semana').textContent = ultima.semana;
  document.getElementById('kpi-altura-control').textContent = ultima.control_altura + ' cm';
  document.getElementById('kpi-altura-exp').textContent = ultima.exp_altura + ' cm';
  document.getElementById('kpi-flores-control').textContent = ultima.control_flores;
  document.getElementById('kpi-flores-exp').textContent = ultima.exp_flores;
  document.getElementById('kpi-danios').textContent = ultima.control_hojas_danadas;
  document.getElementById('kpi-danios-exp').textContent = ultima.exp_hojas_danadas;
}

// ── FLOR DINÁMICA SVG ────────────────────────────────
const floresConfig = {
  'Excelente': { petalColor: '#ffd60a', centroColor: '#ff8800', talloColor: '#2d6a4f', hojaColor: '#40916c', petalos: 12, size: 1, badge: 'bg-success' },
  'Buena':     { petalColor: '#ffe066', centroColor: '#ffaa00', talloColor: '#52b788', hojaColor: '#74c69d', petalos: 10, size: 0.9, badge: 'bg-info' },
  'Regular':   { petalColor: '#ffc0cb', centroColor: '#cc6600', talloColor: '#74c69d', hojaColor: '#95d5b2', petalos: 8,  size: 0.8, badge: 'bg-warning' },
  'Deficiente':{ petalColor: '#d3d3d3', centroColor: '#888',    talloColor: '#adb5bd', hojaColor: '#ced4da', petalos: 6,  size: 0.7, badge: 'bg-danger'  },
};

function generarSVGFlor(estado) {
  const cfg = floresConfig[estado];
  const cx = 100, cy = 90, r = 28 * cfg.size;
  let petalos = '';
  for (let i = 0; i < cfg.petalos; i++) {
    const ang = (360 / cfg.petalos) * i;
    petalos += `<ellipse cx="${cx}" cy="${cy - r * 1.4}" rx="${r * 0.38}" ry="${r * 0.7}"
      fill="${cfg.petalColor}" opacity="0.92"
      transform="rotate(${ang}, ${cx}, ${cy})" />`;
  }
  return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" class="flower-svg">
    <!-- Tallo -->
    <line x1="100" y1="120" x2="100" y2="210" stroke="${cfg.talloColor}" stroke-width="5" stroke-linecap="round"/>
    <!-- Hoja izq -->
    <ellipse cx="82" cy="165" rx="16" ry="8" fill="${cfg.hojaColor}" transform="rotate(-30,82,165)" opacity="0.85"/>
    <!-- Hoja der -->
    <ellipse cx="118" cy="180" rx="16" ry="8" fill="${cfg.hojaColor}" transform="rotate(30,118,180)" opacity="0.85"/>
    <!-- Pétalos -->
    ${petalos}
    <!-- Centro -->
    <circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="${cfg.centroColor}"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.3}" fill="#fff" opacity="0.4"/>
  </svg>`;
}

function actualizarFlor(estado) {
  const cfg = floresConfig[estado];
  document.getElementById('flor-svg').innerHTML = generarSVGFlor(estado);
  const badge = document.getElementById('estado-badge');
  badge.textContent = '🌼 Estado: ' + estado;
  badge.className = `health-badge text-white ${cfg.badge}`;
  document.querySelectorAll('.selector-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`[data-estado="${estado}"]`);
  if (btn) btn.classList.add('active');
}

// ── GRÁFICO LÍNEAS – Crecimiento ─────────────────────
function initChartLineas() {
  const ctx = document.getElementById('chartLineas').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: semanas,
      datasets: [
        { label: 'Control (Agua Potable)', data: alturaControl, borderColor: '#2b5797', backgroundColor: 'rgba(43,87,151,0.1)', tension: 0.4, fill: true, pointRadius: 5, pointHoverRadius: 8 },
        { label: 'Experimental (Agua Azucarada)', data: alturaExp, borderColor: '#52b788', backgroundColor: 'rgba(82,183,136,0.1)', tension: 0.4, fill: true, pointRadius: 5, pointHoverRadius: 8 },
      ]
    },
    options: { responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } }, tooltip: { mode: 'index' } },
      scales: { y: { beginAtZero: false, min: 18, title: { display: true, text: 'Altura (cm)', font: { size: 11 } } } }
    }
  });
}

// ── GRÁFICO BARRAS – Hojas Dañadas ───────────────────
function initChartBarras() {
  const ctx = document.getElementById('chartBarras').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: semanas,
      datasets: [
        { label: 'Hojas Dañadas – Control', data: daniosControl, backgroundColor: 'rgba(220,53,69,0.75)', borderRadius: 6 },
        { label: 'Hojas Dañadas – Experimental', data: daniosExp, backgroundColor: 'rgba(82,183,136,0.75)', borderRadius: 6 },
      ]
    },
    options: { responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: 'N° Hojas Dañadas' } } }
    }
  });
}

// ── GRÁFICO CIRCULAR – Estado Final ──────────────────
function initChartCircular() {
  const ctx = document.getElementById('chartCircular').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Sin Daño (Exp.)', 'Hojas Dañadas (Control)', 'Flores (Control)', 'Flores (Exp.)'],
      datasets: [{
        data: [100, 14, 4, 2],
        backgroundColor: ['#52b788', '#dc3545', '#ffd60a', '#4895ef'],
        borderWidth: 0,
        hoverOffset: 10,
      }]
    },
    options: { responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } } }
    }
  });
}

// ── GRÁFICO RADAR – Indicadores ───────────────────────
function initChartRadar() {
  const ctx = document.getElementById('chartRadar').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Crecimiento', 'Salud foliar', 'Floración', 'Resistencia frío', 'Vigor general'],
      datasets: [
        { label: 'Control (Agua Potable)', data: [90, 50, 85, 40, 65], backgroundColor: 'rgba(43,87,151,0.15)', borderColor: '#2b5797', pointBackgroundColor: '#2b5797' },
        { label: 'Experimental (Agua Azucarada)', data: [80, 100, 70, 95, 85], backgroundColor: 'rgba(82,183,136,0.15)', borderColor: '#52b788', pointBackgroundColor: '#52b788' },
      ]
    },
    options: { responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
      scales: { r: { beginAtZero: true, max: 100, ticks: { font: { size: 10 } } } }
    }
  });
}

// ── INIT ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initFadeIn();
  actualizarKPIs();
  actualizarFlor('Excelente');
  initChartLineas();
  initChartBarras();
  initChartCircular();
  initChartRadar();

  // Botones selector de estado de flor
  document.querySelectorAll('.selector-btn').forEach(btn => {
    btn.addEventListener('click', () => actualizarFlor(btn.dataset.estado));
  });
});
