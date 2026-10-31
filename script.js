// ===== Helper =====

const $ = (s, el = document) => el.querySelector(s);

const $$ = (s, el = document) => [...el.querySelectorAll(s)];



// ===== Tahun otomatis di footer =====

$('#year').textContent = new Date().getFullYear();



// ===== Toast (pesan kecil) =====

const toast = $('#toast');

let toastTimer;

function showToast(text) {

  toast.textContent = text;

  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);

}



// ===== Navbar: background saat scroll + tombol kembali ke atas =====

const nav = $('#nav');

const topBtn = $('#top');

function onScroll() {

  nav.classList.toggle('scrolled', window.scrollY > 20);

  topBtn.classList.toggle('show', window.scrollY > 500);

}

window.addEventListener('scroll', onScroll, { passive: true });

onScroll();

topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));



// ===== Menu mobile =====

const burger = $('#burger');

const menu = $('#menu');

function closeMenu() {

  menu.classList.remove('open');

  burger.setAttribute('aria-expanded', 'false');

}

burger.addEventListener('click', () => {

  const open = menu.classList.toggle('open');

  burger.setAttribute('aria-expanded', String(open));

});

$$('a', menu).forEach(a => a.addEventListener('click', closeMenu));

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });



// ===== Navigasi aktif sesuai posisi scroll =====

const links = $$('.menu a');

const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);

const spy = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));

    }

  });

}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => spy.observe(s));



// ===== Animasi muncul saat section terlihat =====

const reveal = new IntersectionObserver((entries, obs) => {

  entries.forEach(e => {

    if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }

  });

}, { threshold: 0.15 });

$$('.reveal').forEach(el => reveal.observe(el));



// ===== Efek mengetik di hero =====

const codeLines = [

  '<span class="c">// kokorblx.js</span>',

  '<span class="k">const</span> developer = {',

  '  name: <span class="s">"M. Bilal Pratama"</span>,',

  '  study: <span class="s">"Sistem dan Teknologi Informasi"</span>,',

  '  stack: [<span class="s">"HTML"</span>, <span class="s">"CSS"</span>, <span class="s">"JavaScript"</span>],',

  '  database: <span class="s">"Supabase"</span>,',

  '  email: <span class="s">"EmailJS"</span>,',

  '  deploy: <span class="s">"Vercel"</span>,',

  '  goal: <span class="s">"Junior Web Developer"</span>,',

  '};'

];

const typed = $('#typed');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {

  typed.innerHTML = codeLines.join('\n');

} else {

  // Mengetik per baris (tag HTML tetap utuh, jadi tidak rusak)

  let i = 0;

  (function nextLine() {

    if (i >= codeLines.length) return;

    typed.innerHTML += (i ? '\n' : '') + codeLines[i++];

    setTimeout(nextLine, 420);

  })();

}



// ===== Tombol Download CV: cek dulu apakah file PDF ada =====

$('#cvBtn').addEventListener('click', async e => {

  e.preventDefault();

  const btn = e.currentTarget;

  btn.classList.add('loading');

  const url = btn.getAttribute('href');

  try {

    const res = await fetch(url, { method: 'HEAD' });

    if (!res.ok) throw new Error('not found');

    const a = document.createElement('a');

    a.href = url; a.download = 'CV-M-Bilal-Pratama.pdf';

    document.body.appendChild(a); a.click(); a.remove();

  } catch {

    showToast('File CV belum ada. Simpan PDF di assets/CV-M-Bilal-Pratama.pdf');

  } finally {

    btn.classList.remove('loading');

  }

});



// =====================================================

// MOTION UPGRADE (vanilla, ringan, hanya transform/opacity)

// =====================================================

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

const lite = (navigator.hardwareConcurrency || 4) <= 4 || innerWidth < 700;

const lerp = (a, b, t) => a + (b - a) * t;

const raf = requestAnimationFrame;

const heroEl = $('.hero');



// Bungkus tiap kata supaya bisa muncul satu per satu dengan efek masking

function splitWords(el) {

  let i = 0;

  (function walk(n) {

    n.classList.add('is-split');

    [...n.childNodes].forEach(c => {

      if (c.nodeType === 3) {

        const frag = document.createDocumentFragment();

        c.textContent.split(/(\s+)/).forEach(t => {

          if (!t.trim()) { frag.append(t); return; }

          const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');

          const wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = t;

          wi.style.setProperty('--i', i++);

          w.append(wi); frag.append(w);

        });

        c.replaceWith(frag);

      } else if (c.nodeType === 1) walk(c);

    });

  })(el);

}

if (!calm) {

  const els = $$('.hello, h1, h2');

  els.forEach(el => { el.dataset.split = ''; el.setAttribute('aria-label', el.textContent.trim()); splitWords(el); });

  const so = new IntersectionObserver((es, o) => es.forEach(e => {

    if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }

  }), { threshold: 0.3 });

  els.forEach(el => { if (!el.closest('.hero')) so.observe(el); });

  // Intro hero: mulai setelah font siap (maksimal tunggu 600ms)

  const go = () => $$('.hero [data-split]').forEach(el => el.classList.add('in'));

  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 600))]).then(() => setTimeout(go, 80));

}



// Stagger untuk kartu skill dan timeline

$$('.skills, .timeline').forEach(c => {

  c.classList.add('stagger');

  [...c.children].forEach((k, i) => k.style.setProperty('--i', i));

});



// Ikon teks pada kartu skill

const icons = { HTML: '</>', CSS: '{ }', JavaScript: 'JS', Responsive: '▭', UI: 'UI', Supabase: 'DB', EmailJS: '@', Git: 'Git', Deployment: '▲', Bot: 'Bot' };

$$('.skills .card').forEach(c => {

  const t = $('h3', c).textContent;

  const key = Object.keys(icons).find(k => t.startsWith(k));

  const ico = document.createElement('div');

  ico.className = 'ico'; ico.setAttribute('aria-hidden', 'true'); ico.textContent = key ? icons[key] : '#';

  c.prepend(ico);

});



// Teks profesi berganti dengan efek mengetik

const roleEl = $('#role');

if (!calm && roleEl) {

  const roles = ['Frontend Developer', 'Web Developer', 'Creative Developer'];

  let r = 0, n = roles[0].length, dir = 0;

  (function tick() {

    roleEl.textContent = roles[r].slice(0, n);

    let wait;

    if (dir === 0) { dir = -1; wait = 0; }

    else if (dir < 0) { if (n === 0) { dir = 1; r = (r + 1) % roles.length; wait = 250; } else { n--; wait = 45; } }

    else { if (n === roles[r].length) { dir = -1; wait = 1800; } else { n++; wait = 85; } }

    setTimeout(tick, dir === -1 && n === roles[r].length ? 1800 : wait);

  })();

}



// Progress scroll + parallax scroll ringan

const bar = $('#progress');

let ticking = false;

addEventListener('scroll', () => {

  if (ticking) return; ticking = true;

  raf(() => {

    const h = document.documentElement.scrollHeight - innerHeight;

    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;

    if (!calm) heroEl.style.setProperty('--sy', Math.min(scrollY, innerHeight));

    ticking = false;

  });

}, { passive: true });



// Cursor kustom + parallax mouse (satu loop, berhenti saat diam)

if (fine && !calm) {

  document.documentElement.classList.add('has-cursor');

  const dot = $('#dot'), ring = $('#ring');

  const m = { x: innerWidth / 2, y: innerHeight / 2, rx: innerWidth / 2, ry: innerHeight / 2, s: 1, ts: 1, px: 0, py: 0, tpx: 0, tpy: 0 };

  let running = false;

  function loop() {

    m.rx = lerp(m.rx, m.x, .16); m.ry = lerp(m.ry, m.y, .16); m.s = lerp(m.s, m.ts, .18);

    m.px = lerp(m.px, m.tpx, .08); m.py = lerp(m.py, m.tpy, .08);

    ring.style.transform = `translate3d(${m.rx}px,${m.ry}px,0) translate(-50%,-50%) scale(${m.s})`;

    heroEl.style.setProperty('--mx', m.px.toFixed(3));

    heroEl.style.setProperty('--my', m.py.toFixed(3));

    const settled = Math.abs(m.rx - m.x) + Math.abs(m.ry - m.y) < .3 && Math.abs(m.s - m.ts) < .01 && Math.abs(m.px - m.tpx) + Math.abs(m.py - m.tpy) < .002;

    if (settled) running = false; else raf(loop);

  }

  const kick = () => { if (!running) { running = true; raf(loop); } };

  addEventListener('pointermove', e => {

    m.x = e.clientX; m.y = e.clientY;

    dot.style.transform = `translate3d(${m.x}px,${m.y}px,0) translate(-50%,-50%)`;

    document.documentElement.classList.add('cursor-on');

    m.tpx = e.clientX / innerWidth - .5; m.tpy = e.clientY / innerHeight - .5;

    kick();

  }, { passive: true });

  document.addEventListener('pointerover', e => {

    const t = e.target;

    const proj = t.closest('.project');

    m.ts = t.closest('a, button') ? 1.7 : proj ? 2.4 : 1;

    ring.classList.toggle('view', !!proj);

    const txt = !!t.closest('input, textarea');

    ring.classList.toggle('hide', txt); dot.classList.toggle('hide', txt);

    kick();

  });

  document.documentElement.addEventListener('mouseleave', () => document.documentElement.classList.remove('cursor-on'));



  // Tombol magnetik tipis

  $$('.btn').forEach(b => {

    b.addEventListener('pointermove', e => {

      const r = b.getBoundingClientRect();

      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28 - 2}px)`;

    });

    b.addEventListener('pointerleave', () => { b.style.transform = ''; });

  });

  // Spotlight pada kartu + tilt sangat ringan pada kartu skill

  $$('.card, .project').forEach(c => {

    c.addEventListener('pointermove', e => {

      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;

      c.style.setProperty('--px', x + 'px'); c.style.setProperty('--py', y + 'px');

      if (c.classList.contains('card')) {

        c.style.transform = `perspective(800px) rotateX(${(y / r.height - .5) * -7}deg) rotateY(${(x / r.width - .5) * 7}deg) translateY(-4px)`;

      }

    });

    c.addEventListener('pointerleave', () => { c.style.transform = ''; });

  });

}



// Partikel ambient: sedikit, berhenti saat hero tidak terlihat atau tab disembunyikan

const cv = $('#fx');

if (cv && !calm) {

  const ctx = cv.getContext('2d');

  let W, H, run = false, inView = false;

  const P = [];

  const size = () => { const d = Math.min(devicePixelRatio || 1, 1.5); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };

  size(); addEventListener('resize', size);

  for (let i = 0; i < (lite ? 18 : 42); i++) P.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + .4, vx: (Math.random() - .5) * .18, vy: -(Math.random() * .25 + .05), a: Math.random() * .5 + .2 });

  function draw() {

    if (!run) return;

    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#38bdf8';

    P.forEach(p => {

      p.x += p.vx; p.y += p.vy;

      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }

      if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;

      ctx.globalAlpha = p.a; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();

    });

    raf(draw);

  }

  const upd = () => { const was = run; run = inView && !document.hidden; if (run && !was) raf(draw); };

  new IntersectionObserver(([e]) => { inView = e.isIntersecting; upd(); }).observe(cv);

  document.addEventListener('visibilitychange', upd);

}



// Screenshot asli (opsional): jika assets/kokorblx.png ada, ganti tampilan abstrak

const shotBody = $('.shot-body');

if (shotBody) {

  const img = new Image();

  img.alt = 'Tampilan website KokoRBLX';

  img.onload = () => {
    shotBody.textContent = '';
    shotBody.style.padding = '0';
    shotBody.style.gap = '0';
    shotBody.append(img);
    // Hapus bar tiruan agar navbar asli di screenshot tidak terlihat dobel.
    const shotBar = $('.shot-bar');
    if (shotBar) shotBar.remove();
    $('.shot').removeAttribute('aria-hidden');
  };

  img.src = 'assets/kokorblx.png';

}

const contactForm = document.getElementById('contact-form');
const btn = document.getElementById('button');

if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    // 1. Tahan reload halaman duluan
    event.preventDefault();

    // 2. Ubah teks tombol
    if (btn) btn.innerText = 'Mengirim...';

    const serviceID = 'service_ed61pfi';
    const templateID = 'template_0a3ku1k';

    // 3. Kirim via EmailJS
    emailjs.sendForm(serviceID, templateID, contactForm)
      .then(() => {
        if (btn) btn.innerText = 'Kirim pesan';
        alert('Pesan berhasil terkirim!');
        contactForm.reset();
      })
      .catch((err) => {
        if (btn) btn.innerText = 'Kirim pesan';
        alert('Gagal menggolkan pesan: ' + JSON.stringify(err));
      });
  });
}

/* ===== CV POPUP ===== */
(() => {
  const modal = document.getElementById("cvModal");
  const closeButton = document.getElementById("closeCV");
  const frame = document.getElementById("cvFrame");

  if (!modal || !closeButton || !frame) return;

  // GANTI dengan URL website CV kamu di Vercel.
  const CV_URL = "https://kokorobuxx-stack.github.io/View-my-cv/";

  let previousFocus = null;

  function openCV() {
    previousFocus = document.activeElement;

    if (!frame.src || frame.src === window.location.href) {
      frame.src = CV_URL;
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("cv-modal-open");

    closeButton.focus();
  }

  function closeCV() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cv-modal-open");

    if (previousFocus) previousFocus.focus();
  }

  // Bisa dipanggil oleh tombol mana pun yang memakai data-open-cv.
  document.querySelectorAll("[data-open-cv]").forEach(button => {
    button.addEventListener("click", openCV);
  });

  closeButton.addEventListener("click", closeCV);

  modal.querySelectorAll("[data-close-cv]").forEach(element => {
    element.addEventListener("click", closeCV);
  });

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      modal.classList.contains("active")
    ) {
      closeCV();
    }
  });
})();

/* ===== LOGIKA POP-UP PORTOFOLIO ===== */
const PORTFOLIO_URL = "https://kokorobuxx-stack.github.io/portofolio-patecare/"; 

const portfolioModal = document.getElementById("portfolioModal");
const portfolioFrame = document.getElementById("portfolioFrame");
const closePortfolioBtn = document.getElementById("closePortfolioBtn");
// PERUBAHAN DI SINI: Gunakan querySelectorAll (tambah 'All' dan huruf 's' di nama variabel)
const openPortfolioBtns = document.querySelectorAll("[data-open-portfolio]"); 
const overlayPortfolio = document.querySelector(".portfolio-backdrop[data-close-portfolio]");

let previousFocusPortfolio = null;

function openPortfolio() {
  previousFocusPortfolio = document.activeElement;

  if (!portfolioFrame.src || portfolioFrame.src === window.location.href) {
    portfolioFrame.src = PORTFOLIO_URL;
  }

  portfolioModal.classList.add("active");
  portfolioModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("portfolio-modal-open");

  closePortfolioBtn.focus();
}

function closePortfolio() {
  portfolioModal.classList.remove("active");
  portfolioModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("portfolio-modal-open");

  if (previousFocusPortfolio) previousFocusPortfolio.focus();
}

// PERUBAHAN DI SINI: Pasang fungsi klik ke SEMUA tombol (baik di navbar maupun di hero)
openPortfolioBtns.forEach((btn) => {
  btn.addEventListener("click", openPortfolio);
});

if (closePortfolioBtn) closePortfolioBtn.addEventListener("click", closePortfolio);
if (overlayPortfolio) overlayPortfolio.addEventListener("click", closePortfolio);

// Tutup pakai tombol ESC di keyboard
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && portfolioModal.classList.contains("active")) {
    closePortfolio();
  }
});