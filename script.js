/* ── Code Rain Background ───────────────────────────────────── */
(function () {
  const canvas = document.getElementById('codeCanvas');
  const ctx    = canvas.getContext('2d');

  const CODE_CHARS = [
    'const','let','var','return','import','export','default',
    'function','async','await','useState','useEffect','useRef',
    'props','state','render','=>','{}','[]','()','</>','<div>',
    '</div>','React','Next','jsx','tsx','.map(','.filter(',
    'null','true','false','undefined','interface','type','class',
    'extends','onClick','href','style','className','module',
    '&&','||','===','!==','++','--','+=','=>{','};','});',
    'fetch(','then(','catch(','try{','catch{','console.log(',
    'npm','git','push','pull','commit','deploy','build',
    '0','1','<','>',' /','{','}','[',']','(',')',';',':','.',','
  ];

  const FONT_SIZE = 13;
  let columns, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / (FONT_SIZE * 1.6));
    drops   = Array.from({ length: columns }, () => Math.random() * -80);
  }

  function getRandChar() {
    return CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }

  // Speed per column (slower for a calmer effect)
  const speeds = [];
  function initSpeeds() {
    speeds.length = 0;
    for (let i = 0; i < columns; i++) {
      speeds.push(0.2 + Math.random() * 0.5);
    }
  }

  function draw() {
    // Fade trail
    ctx.fillStyle = 'rgba(10, 10, 15, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${FONT_SIZE}px monospace`;

    for (let i = 0; i < columns; i++) {
      const text = getRandChar();
      const x    = i * FONT_SIZE * 1.6;
      const y    = drops[i] * FONT_SIZE;

      // Leading char — bright violet
      ctx.fillStyle = '#c4b5fd';
      ctx.fillText(text, x, y);

      // Slightly behind — mid violet
      ctx.fillStyle = 'rgba(124,58,237,0.7)';
      ctx.fillText(getRandChar(), x, y - FONT_SIZE * 2);

      // Further back — dim
      ctx.fillStyle = 'rgba(109,40,217,0.35)';
      ctx.fillText(getRandChar(), x, y - FONT_SIZE * 5);

      drops[i] += speeds[i];

      // Reset column when it goes off screen
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
    }
  }

  resize();
  initSpeeds();
  window.addEventListener('resize', () => { resize(); initSpeeds(); });
  setInterval(draw, 45);
})();

/* ── Navbar scroll & active ─────────────────────────────────── */
const navbar  = document.getElementById('navbar');
const toggle  = document.getElementById('navToggle');
const iconM   = document.getElementById('iconMenu');
const iconC   = document.getElementById('iconClose');
const mMenu   = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

toggle.addEventListener('click', () => {
  const open = mMenu.style.display === 'flex';
  mMenu.style.display = open ? 'none' : 'flex';
  iconM.style.display  = open ? '' : 'none';
  iconC.style.display  = open ? 'none' : '';
});

mMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mMenu.style.display = 'none';
    iconM.style.display = '';
    iconC.style.display = 'none';
  });
});

const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('[data-section]');
function setActive() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAs.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });
}
window.addEventListener('scroll', setActive, { passive: true });
setActive();

/* ── Typewriter ─────────────────────────────────────────────── */
const roles = ['Full-Stack Developer', 'UI/UX Enthusiast', 'Next.js Developer', 'Problem Solver'];
const twEl  = document.getElementById('typewriter');
let ri = 0, ci = 0, deleting = false;
function type() {
  const word = roles[ri % roles.length];
  twEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  let delay = deleting ? 45 : 80;
  if (!deleting && ci > word.length)  { delay = 1800; deleting = true; }
  if (deleting  && ci < 0)            { deleting = false; ri++; ci = 0; delay = 300; }
  setTimeout(type, delay);
}
type();

/* ── Fade-up on scroll ──────────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-up');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => io.observe(el));

/* ── Skill bars ─────────────────────────────────────────────── */
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
      barIO.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-card').forEach(c => barIO.observe(c));

/* ── Project filter ─────────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const cats = (card.dataset.category || '')
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);
      const show = filter === 'all' || cats.includes(filter);
      card.style.display = show ? 'flex' : 'none';
    });
  });
});

/* ── Contact form (disabled – form removed) ─────────────────── */
const formSubmitBtn = document.getElementById('formSubmit');
if (formSubmitBtn) {
  formSubmitBtn.addEventListener('click', () => {
    const fields = ['fname', 'femail', 'fsubject', 'fmessage'];
    const ok = fields.every(id => document.getElementById(id).value.trim());
    if (!ok) { alert('Please fill in all fields.'); return; }
    const btn = formSubmitBtn;
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(() => {
      document.getElementById('formWrap').style.display  = 'none';
      document.getElementById('successMsg').style.display = 'flex';
      setTimeout(() => {
        document.getElementById('successMsg').style.display = 'none';
        document.getElementById('formWrap').style.display   = '';
        fields.forEach(id => document.getElementById(id).value = '');
        btn.innerHTML = '<svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
        btn.disabled = false;
      }, 3500);
    }, 1500);
  });
}

/* ── Flashlight cursor effect ─────────────────────────────── */
window.addEventListener('mousemove', (e) => {
  document.body.style.setProperty('--cursor-x', `${e.clientX}px`);
  document.body.style.setProperty('--cursor-y', `${e.clientY}px`);
});
