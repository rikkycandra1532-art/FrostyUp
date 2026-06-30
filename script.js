/* ============================================================
   script.js — homepage-only interactions
   Shared interactions (navbar, drawer, theme, fab chat, frost
   particles) now live in common.js, loaded before this file.
   Game data (GAMES, GAME_ORDER, getGameIcon) comes from
   games-data.js, also loaded before this file.
============================================================ */
(function(){
  "use strict";

  /* ---------- Promo popup ---------- */
  const promoOverlay = document.getElementById('promoOverlay');
  const promoClose = document.getElementById('promoClose');
  const promoCopyBtn = document.getElementById('promoCopyBtn');
  const promoCtaBtn = document.getElementById('promoCtaBtn');
  if(promoOverlay){
    // shows on every page load/refresh, as requested
    requestAnimationFrame(()=> promoOverlay.classList.add('show'));

    function closePromo(){ promoOverlay.classList.remove('show'); }

    if(promoClose) promoClose.addEventListener('click', closePromo);
    // click anywhere on the dark overlay (outside the modal) closes it
    promoOverlay.addEventListener('click', (e)=>{
      if(e.target === promoOverlay) closePromo();
    });
    if(promoCopyBtn){
      promoCopyBtn.addEventListener('click', async ()=>{
        try{
          await navigator.clipboard.writeText('FROSTY10');
          showToast('Kode promo FROSTY10 disalin');
        }catch(e){
          showToast('Gagal menyalin, salin manual ya');
        }
      });
    }
    if(promoCtaBtn){
      promoCtaBtn.addEventListener('click', ()=>{
        closePromo();
        document.getElementById('games')?.scrollIntoView({ behavior:'smooth' });
      });
    }
  }

  /* ---------- Hero banner slider ---------- */
  const track = document.getElementById('bannerTrack');
  const dotsWrap = document.getElementById('bannerDots');
  const prevBtn = document.getElementById('bannerPrev');
  const nextBtn = document.getElementById('bannerNext');
  const slider = document.getElementById('bannerSlider');

  if(track){
    const slides = Array.from(track.children);
    let current = 0;
    let autoTimer = null;
    const AUTO_MS = 5000;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'banner-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Ke slide ${i+1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render(){
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d,i) => d.classList.toggle('active', i === current));
    }
    function goTo(i){
      current = (i + slides.length) % slides.length;
      render();
      restartAuto();
    }
    function next(){ goTo(current + 1); }
    function prev(){ goTo(current - 1); }

    function startAuto(){
      if(reduceMotion) return;
      stopAuto();
      autoTimer = setInterval(next, AUTO_MS);
    }
    function stopAuto(){
      if(autoTimer) clearInterval(autoTimer);
    }
    function restartAuto(){ stopAuto(); startAuto(); }

    if(nextBtn) nextBtn.addEventListener('click', next);
    if(prevBtn) prevBtn.addEventListener('click', prev);

    // pause on hover (desktop)
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    // swipe support (mobile)
    let touchStartX = 0, touchDeltaX = 0, isTouching = false;
    track.addEventListener('touchstart', (e) => {
      isTouching = true;
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
      stopAuto();
    }, { passive: true });
    track.addEventListener('touchmove', (e) => {
      if(!isTouching) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });
    track.addEventListener('touchend', () => {
      if(!isTouching) return;
      isTouching = false;
      if(Math.abs(touchDeltaX) > 50){
        touchDeltaX < 0 ? next() : prev();
      } else {
        startAuto();
      }
    });

    // keyboard arrows when slider focused
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowRight') next();
      if(e.key === 'ArrowLeft') prev();
    });

    render();
    startAuto();
  }

  /* ---------- Animated counters ---------- */
  const statEls = document.querySelectorAll('.stat-num');
  function formatNumber(num, decimals, suffix){
    let str;
    if(decimals){
      str = num.toFixed(decimals);
    } else if(num >= 1000000){
      str = (num/1000000).toFixed(1).replace(/\.0$/,'') + 'Jt';
    } else if(num >= 1000){
      str = (num/1000).toFixed(0) + 'rb';
    } else {
      str = Math.round(num).toString();
    }
    return str + (suffix || '');
  }
  function animateCount(el){
    const target = parseFloat(el.dataset.count);
    const decimals = el.dataset.decimal ? parseInt(el.dataset.decimal,10) : 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1-p, 3);
      const val = target * eased;
      el.textContent = formatNumber(val, decimals, suffix);
      if(p < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target, decimals, suffix);
    }
    requestAnimationFrame(tick);
  }
  const statObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statEls.forEach(el=> statObserver.observe(el));

  /* ---------- Scroll reveal for sections ---------- */
  const revealTargets = document.querySelectorAll('.game-card, .flash-card, .vip-card, .rfeat, .blog-card, .dash-item, .trust-item, .reward-card');
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el,i)=>{
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity .5s ease ${ (i % 6) * 0.06}s, transform .5s ease ${ (i % 6) * 0.06}s`;
    revealObserver.observe(el);
  });

  /* ---------- Game grid render ----------
     Game data comes from games-data.js (GAMES, GAME_ORDER, getGameIcon)
     loaded before this file — single source of truth shared with topup.js
  ---------------------------------------------------------- */
  const gameGrid = document.getElementById('gameGrid');
  if(gameGrid){
    gameGrid.innerHTML = GAME_ORDER.map(key => {
      const g = GAMES[key];
      return `
      <a href="topup.html?game=${key}" class="game-card" tabindex="0">
        <div class="game-thumb">
          ${g.trending ? '<span class="game-trending">Trending</span>' : ''}
          ${getGameIcon(g, 'card-icon')}
        </div>
        <div class="game-body">
          <div class="game-name">${g.name}</div>
          <div class="game-cat">${g.cat}</div>
          <span class="game-btn">Top Up</span>
        </div>
      </a>
    `;
    }).join('');

    // re-observe newly created cards for reveal animation
    gameGrid.querySelectorAll('.game-card').forEach((el,i)=>{
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = `opacity .5s ease ${ (i % 6) * 0.06}s, transform .5s ease ${ (i % 6) * 0.06}s`;
      revealObserver.observe(el);
    });
  }

  /* ---------- Countdown timer (Flash Sale) ---------- */
  const cdH = document.getElementById('cdH');
  const cdM = document.getElementById('cdM');
  const cdS = document.getElementById('cdS');
  if(cdH){
    function getDeadline(){
      const now = new Date();
      const d = new Date(now);
      d.setHours(Math.ceil((now.getHours()+0.01)/6)*6, 0, 0, 0);
      if(d <= now) d.setHours(d.getHours()+6);
      return d;
    }
    let deadline = getDeadline();
    function pad(n){ return n.toString().padStart(2,'0'); }
    function tickCountdown(){
      const now = new Date();
      let diff = deadline - now;
      if(diff <= 0){ deadline = getDeadline(); diff = deadline - now; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      cdH.textContent = pad(h);
      cdM.textContent = pad(m);
      cdS.textContent = pad(s);
    }
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }

  /* ---------- Cek Pesanan tracker (demo) ---------- */
  const trackBtn = document.getElementById('trackBtn');
  const invoiceInput = document.getElementById('invoiceInput');
  if(trackBtn){
    trackBtn.addEventListener('click', ()=>{
      const val = invoiceInput.value.trim();
      if(!val){
        showToast('Masukkan nomor invoice terlebih dahulu');
        return;
      }
      showToast(`Melacak invoice ${val}...`);
    });
  }

  /* ---------- Lucky Spin ----------
     Weighted prize table: most spins land on "Coba Lagi Besok" or small
     prizes. Big prizes have low odds and the top voucher is capped at
     Rp 5.000 (was Rp 20.000) to keep the giveaway cost sustainable.
  ---------------------------------------------------------- */
  const spinBtn = document.getElementById('spinBtn');
  const spinWheel = document.getElementById('spinWheel');
  const spinResult = document.getElementById('spinResult');
  const prizes = [
    { label: 'Coba Lagi Besok', weight: 40 },
    { label: 'Diamond Gratis 10', weight: 22 },
    { label: 'Cashback 1%', weight: 15 },
    { label: 'Voucher Rp 2.000', weight: 12 },
    { label: 'Diamond Gratis 20', weight: 7 },
    { label: 'Voucher Rp 5.000', weight: 4 }
  ];
  function pickWeightedPrize(){
    const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
    let roll = Math.random() * totalWeight;
    for(let i = 0; i < prizes.length; i++){
      roll -= prizes[i].weight;
      if(roll <= 0) return i;
    }
    return prizes.length - 1;
  }
  let spinning = false;
  let currentRotation = 0;
  if(spinBtn){
    spinBtn.addEventListener('click', ()=>{
      if(spinning) return;
      spinning = true;
      spinBtn.disabled = true;
      spinBtn.style.opacity = '.6';
      const prizeIndex = pickWeightedPrize();
      const segDeg = 360 / prizes.length;
      const extraSpins = 5 * 360;
      const target = extraSpins + (360 - (prizeIndex * segDeg) - segDeg/2);
      currentRotation += target;
      spinWheel.style.transform = `rotate(${currentRotation}deg)`;
      spinResult.textContent = 'Memutar...';
      setTimeout(()=>{
        const prizeLabel = prizes[prizeIndex].label;
        spinResult.textContent = `🎉 Selamat! Kamu mendapatkan: ${prizeLabel}`;
        showToast(`Hadiah: ${prizeLabel}`);
        spinning = false;
        spinBtn.disabled = false;
        spinBtn.style.opacity = '1';
      }, 3300);
    });
  }

  /* ---------- Daily check-in ---------- */
  const checkinBtn = document.getElementById('checkinBtn');
  if(checkinBtn){
    checkinBtn.addEventListener('click', ()=>{
      checkinBtn.textContent = 'Sudah Check In Hari Ini ✓';
      checkinBtn.disabled = true;
      checkinBtn.style.opacity = '.7';
      showToast('Check in berhasil! +500 poin');
    });
  }

  /* ---------- Copy referral link ---------- */
  const copyRefBtn = document.getElementById('copyRefBtn');
  const refLink = document.getElementById('refLink');
  if(copyRefBtn){
    copyRefBtn.addEventListener('click', async ()=>{
      const text = refLink.textContent;
      try{
        await navigator.clipboard.writeText(text);
        showToast('Link referral disalin ke clipboard');
      }catch(e){
        showToast('Gagal menyalin link, salin manual ya');
      }
    });
  }

})();
