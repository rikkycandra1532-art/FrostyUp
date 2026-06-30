/* ============================================================
   common.js — shared interactions used on EVERY page
   (navbar, mobile drawer, theme toggle, language toggle,
   floating chat button, ambient frost particle background)

   Loaded on both index.html and topup.html. Page-specific
   features (game grid, countdown, spin wheel, etc.) live in
   script.js (homepage-only) and topup.js (topup-page-only).
============================================================ */
(function(){
  "use strict";

  /* ---------- Toast helper (exposed globally so other page
     scripts like topup.js / script.js can reuse the same toast) ---------- */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  window.showToast = function(msg){
    if(!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toastEl.classList.remove('show'), 2600);
  };

  /* ---------- Smooth scroll for anchor links only ----------
     CSS `scroll-behavior: smooth` on <html> affects ALL scrolling,
     including manual mouse wheel input, which can feel overly fast
     or "floaty" on desktop. Instead, scroll-behavior stays "auto"
     globally, and we apply a smooth scroll manually only when an
     in-page anchor link (href="#id") is clicked.
  ---------------------------------------------------------- */
  document.addEventListener('click', (e)=>{
    const link = e.target.closest('a[href^="#"]');
    if(!link) return;
    const id = link.getAttribute('href').slice(1);
    if(!id) return;
    const target = document.getElementById(id);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- Navbar scroll state ---------- */
  const nav = document.getElementById('nav');
  if(nav){
    function onScroll(){
      if(window.scrollY > 12) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  /* ---------- Mobile drawer ---------- */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('mobileDrawer');
  if(burger && drawer){
    burger.addEventListener('click', ()=>{
      const open = drawer.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true':'false');
    });
    drawer.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{
        drawer.classList.remove('open');
        burger.classList.remove('open');
      });
    });
  }

  /* ---------- Theme toggle (Dark / Light) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const iconSun = document.getElementById('iconSun');
  const iconMoon = document.getElementById('iconMoon');
  if(themeToggle){
    let isLight = false; // in-memory only, no localStorage per artifact rules
    function applyTheme(){
      document.documentElement.classList.toggle('light', isLight);
      if(iconSun) iconSun.style.display = isLight ? 'none' : 'block';
      if(iconMoon) iconMoon.style.display = isLight ? 'block' : 'none';
    }
    themeToggle.addEventListener('click', ()=>{
      isLight = !isLight;
      applyTheme();
      showToast(isLight ? 'Mode terang diaktifkan' : 'Mode gelap diaktifkan');
    });
  }

  /* ---------- Language toggle (demo) ---------- */
  const langToggle = document.getElementById('langToggle');
  if(langToggle){
    let isID = true;
    langToggle.addEventListener('click', ()=>{
      isID = !isID;
      langToggle.textContent = isID ? 'ID' : 'EN';
      showToast(isID ? 'Bahasa diubah ke Indonesia' : 'Language switched to English (demo)');
    });
  }

  /* ---------- Floating chat FAB ---------- */
  const fabMain = document.getElementById('fabMain');
  const fabMenu = document.getElementById('fabMenu');
  const fabWrap = document.getElementById('fabWrap');
  if(fabMain && fabMenu && fabWrap){
    fabMain.addEventListener('click', ()=>{
      fabMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e)=>{
      if(!fabWrap.contains(e.target)){
        fabMenu.classList.remove('open');
      }
    });
  }

  /* ============================================================
     Ambient frost particle canvas (signature visual)
  ============================================================ */
  const canvas = document.getElementById('frostCanvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight * 0.4);
    }

    function initParticles(){
      const count = Math.min(70, Math.floor(window.innerWidth / 18));
      particles = Array.from({length: count}, ()=> ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.6,
        vy: Math.random() * 0.35 + 0.08,
        vx: (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.5 + 0.15
      }));
    }

    function drawParticles(){
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = '#bfe9ff';
      particles.forEach(p=>{
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
        p.y += p.vy;
        p.x += p.vx;
        if(p.y > h){ p.y = -4; p.x = Math.random() * w; }
      });
      ctx.globalAlpha = 1;
    }

    function loop(){
      drawParticles();
      requestAnimationFrame(loop);
    }

    if(!reduceMotion){
      resize();
      initParticles();
      loop();
      window.addEventListener('resize', ()=>{
        resize();
        initParticles();
      });
    } else {
      canvas.style.display = 'none';
    }
  }

})();
