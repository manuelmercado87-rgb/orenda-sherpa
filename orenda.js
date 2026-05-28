// ── NAV scroll behavior ───────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}, { passive: true });

// ── Mobile menu ───────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Reveal on scroll ──────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

// Exclude hero reveals (handled by CSS keyframe animation)
document.querySelectorAll('.reveal').forEach(el => {
  if (!el.closest('#hero') && !el.classList.contains('hero-reveal')) revealObserver.observe(el);
});

// ── Count-up animation ────────────────────────
function countUp(el) {
  const target = el.dataset.target;
  const isPercent = target.includes('%');
  const prefix = target.startsWith('+') ? '+' : '';
  const num = parseInt(target.replace(/[^0-9]/g, ''));
  const suffix = isPercent ? '%' : (target.endsWith('+') ? '+' : '');
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - elapsed, 3);
    const current = Math.floor(ease * num);
    el.textContent = prefix + current + suffix;
    if (elapsed < 1) requestAnimationFrame(update);
    else el.textContent = prefix + num + suffix;
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(countUp);
      // Animate result bars
      entry.target.querySelectorAll('.resultado-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('#impacto, #resultados, #sherpa-stats').forEach(sec => statObserver.observe(sec));

// ── Sherpa accordion ─────────────────────────
document.querySelectorAll('[data-acc]').forEach(item => {
  const header = item.querySelector('.sh-acc-header');
  const icon = item.querySelector('.sh-acc-icon');
  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('sh-acc-open');
    // Close all
    document.querySelectorAll('[data-acc]').forEach(i => {
      i.classList.remove('sh-acc-open');
      i.querySelector('.sh-acc-icon').textContent = '+';
    });
    // Open clicked
    if (!isOpen) {
      item.classList.add('sh-acc-open');
      icon.textContent = '−';
    }
  });
});
document.querySelectorAll('.marquee-track').forEach(track => {
  const clone = track.innerHTML;
  track.innerHTML = clone + clone;
});

// ── Equipo slider ─────────────────────────────
const equipoData = [
  { name: 'Adriana León', role: 'Fundadora', bio: 'Directora Fundación Orenda. 20 años de carrera corporativa. Senior Fellow Harvard Advanced Leadership Initiative.', color: '#0b6b4a', photo: window.__resources && window.__resources.adrianaPhoto || 'https://images.squarespace-cdn.com/content/v1/68c444cbeeb1356ce3c873a3/c556d906-3387-4c02-9203-612177f7b598/Adriana-leo%CC%81n.webp' },
  { name: 'Marcela Rojas', role: 'Directora', bio: 'Lidera la dirección del programa Sherpa y la coordinación pedagógica del equipo.', color: '#035966' },
  { name: 'Oscar', role: 'Matemáticas', bio: 'Responsable del componente de matemáticas y razonamiento cuantitativo del programa.', color: '#052f35' },
  { name: 'Estefanía y Viviana', role: 'Lectura Crítica', bio: 'Diseñan y acompañan el componente de lectura crítica y comprensión.', color: '#074a3d' },
  { name: 'Tatiana', role: 'Química, física, biología', bio: 'A cargo de las ciencias naturales: química, física y biología.', color: '#035966' },
  { name: 'Camilo Prado', role: 'Análisis de la Imagen', bio: 'Desarrolla el componente de análisis de la imagen del programa.', color: '#052f35' },
  { name: 'Dathium (Iñigo y Martín)', role: 'Tecnología', bio: 'Equipo de tecnología responsable de la IA, automatización e infraestructura de la plataforma.', color: '#0b6b4a' },
  { name: 'Ricardo', role: 'Técnico de Moodle', bio: 'Responsable técnico de la plataforma Moodle y su implementación.', color: '#035966' },
  { name: 'Manuel', role: 'Project Manager', bio: 'Lidera la gestión de proyectos y la coordinación operativa del programa.', color: '#074a3d' },
];

const eqBg = document.getElementById('eq-bg');
const eqName = document.getElementById('eq-name');
const eqRole = document.getElementById('eq-role');
const eqBio = document.getElementById('eq-bio');
const eqCards = document.getElementById('eq-cards');
const eqCur = document.getElementById('eq-cur');
const eqTot = document.getElementById('eq-tot');
const eqPrev = document.getElementById('eq-prev');
const eqNext = document.getElementById('eq-next');

if (eqBg) {
  let eqActive = 0;
  eqTot.textContent = String(equipoData.length).padStart(2, '0');

  function getInitials(name) {
    return name.split(' ').slice(0, 2).map(function(w) { return w[0]; }).join('');
  }

  function buildCards() {
    eqCards.innerHTML = '';
    equipoData.forEach(function(m, i) {
      var card = document.createElement('div');
      card.className = 'eq-card' + (i === eqActive ? ' eq-card-active' : '');
      var imgContent = m.photo
        ? '<div class="eq-card-img" style="background:url(' + m.photo + ') center center/cover no-repeat;"></div>'
        : '<div class="eq-card-img" style="background:' + m.color + '"><div class="eq-card-initials">' + getInitials(m.name) + '</div></div>';
      card.innerHTML = imgContent + '<div class="eq-card-info"><div class="eq-card-role">' + m.role + '</div><div class="eq-card-name">' + m.name + '</div></div>';
      card.addEventListener('click', function() { setActive(i); });
      eqCards.appendChild(card);
    });
  }

  function setActive(i) {
    eqActive = i;
    var m = equipoData[i];
    eqName.style.opacity = '0';
    eqRole.style.opacity = '0';
    eqBio.style.opacity = '0';
    eqBg.style.opacity = '0';
    setTimeout(function() {
      eqName.innerHTML = m.name.replace(' ', '<br>');
      eqRole.textContent = m.role;
      eqBio.textContent = m.bio;
      if (m.photo) {
        eqBg.style.background = 'url(' + m.photo + ') center top/cover no-repeat';
        eqBg.style.filter = 'brightness(0.45)';
      } else {
        eqBg.style.background = 'linear-gradient(135deg, ' + m.color + ' 0%, #021a1e 100%)';
        eqBg.style.filter = 'none';
      }
      eqName.style.opacity = '1';
      eqRole.style.opacity = '1';
      eqBio.style.opacity = '1';
      eqBg.style.opacity = '1';
    }, 250);
    eqCur.textContent = String(i + 1).padStart(2, '0');
    buildCards();
    setTimeout(function() {
      var active = eqCards.querySelector('.eq-card-active');
      if (active) {
        var top = active.offsetTop - eqCards.offsetTop;
        eqCards.scrollTo({ top: top - 40, behavior: 'smooth' });
      }
    }, 50);
  }

  eqPrev.addEventListener('click', function() { setActive((eqActive - 1 + equipoData.length) % equipoData.length); });
  eqNext.addEventListener('click', function() { setActive((eqActive + 1) % equipoData.length); });

  buildCards();
  setActive(0);
}
