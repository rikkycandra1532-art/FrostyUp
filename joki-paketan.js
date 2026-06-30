/* ============================================================
   joki-paketan.js — Joki Rank Paketan engine
   Flat-price packages mirroring BangJeff's Joki Rank Paketan MLBB
   structure: routes grouped by starting tier (Grandmaster, Epic,
   Legend, Mythic, Mythic Honor, Mythic Glory), filterable via tabs.
   https://joki.bangjeff.com/products/joki-rank-paketan-mlbb
============================================================ */
(function(){
  "use strict";

  const TIER_FILTERS = [
    { key:"grandmaster", label:"Grandmaster" },
    { key:"epic", label:"Epic" },
    { key:"legend", label:"Legend" },
    { key:"mythic", label:"Mythic" },
    { key:"mythic_honor", label:"Mythic Honor" },
    { key:"mythic_glory", label:"Mythic Glory" },
  ];

  const PACKAGES = [
    { id:"gm_v_epic_v", tier:"grandmaster", from:"GM V", to:"Epic V", desc:"Joki Rank Grandmaster V sampai Epic V", price:115000, old:null, tag:null },
    { id:"gm_v_legend_v", tier:"grandmaster", from:"GM V", to:"Legend V", desc:"Joki Rank Grandmaster V sampai Legend V", price:310000, old:null, tag:null },
    { id:"gm_i_mythic", tier:"grandmaster", from:"GM I", to:"Mythic", desc:"Joki Rank Grandmaster I sampai Mythic", price:420000, old:null, tag:null },
    { id:"gm_ii_mythic", tier:"grandmaster", from:"GM II", to:"Mythic", desc:"Joki Rank Grandmaster II sampai Mythic", price:445000, old:null, tag:null },
    { id:"gm_iii_mythic", tier:"grandmaster", from:"GM III", to:"Mythic", desc:"Joki Rank Grandmaster III sampai Mythic", price:470000, old:null, tag:null },
    { id:"gm_iv_mythic", tier:"grandmaster", from:"GM IV", to:"Mythic", desc:"Joki Rank Grandmaster IV sampai Mythic", price:495000, old:null, tag:null },
    { id:"gm_v_mythic", tier:"grandmaster", from:"GM V", to:"Mythic", desc:"Joki Rank Grandmaster V sampai Mythic", price:520000, old:null, tag:null },
    { id:"epic_v_legend_v", tier:"epic", from:"Epic V", to:"Legend V", desc:"Joki Rank Epic V sampai Legend V", price:185000, old:null, tag:null },
    { id:"epic_i_mythic", tier:"epic", from:"Epic I", to:"Mythic", desc:"Joki Rank Epic I sampai Mythic", price:240000, old:null, tag:null },
    { id:"epic_ii_mythic", tier:"epic", from:"Epic II", to:"Mythic", desc:"Joki Rank Epic II sampai Mythic", price:280000, old:null, tag:null },
    { id:"epic_iii_mythic", tier:"epic", from:"Epic III", to:"Mythic", desc:"Joki Rank Epic III sampai Mythic", price:320000, old:null, tag:null },
    { id:"epic_iv_mythic", tier:"epic", from:"Epic IV", to:"Mythic", desc:"Joki Rank Epic IV sampai Mythic", price:357000, old:null, tag:null },
    { id:"epic_v_mythic", tier:"epic", from:"Epic V", to:"Mythic", desc:"Joki Rank Epic V sampai Mythic", price:395000, old:null, tag:null },
    { id:"legend_i_mythic", tier:"legend", from:"Legend I", to:"Mythic", desc:"Joki Rank Legend I sampai Mythic", price:40000, old:null, tag:null },
    { id:"legend_ii_mythic", tier:"legend", from:"Legend II", to:"Mythic", desc:"Joki Rank Legend II sampai Mythic", price:80000, old:null, tag:null },
    { id:"legend_iii_mythic", tier:"legend", from:"Legend III", to:"Mythic", desc:"Joki Rank Legend III sampai Mythic", price:120000, old:null, tag:null },
    { id:"legend_iv_mythic", tier:"legend", from:"Legend IV", to:"Mythic", desc:"Joki Rank Legend IV sampai Mythic", price:160000, old:null, tag:null },
    { id:"legend_v_mythic", tier:"legend", from:"Legend V", to:"Mythic", desc:"Joki Rank Legend V sampai Mythic", price:200000, old:null, tag:null },
    { id:"mythic_grading_15_star", tier:"mythic", from:"Mythic", to:"Grading 15 Star", desc:"Joki Mythic Grading untuk menyelesaikan placement match dan membantu mendapatkan hasil grading terbaik", price:185000, old:null, tag:null },
    { id:"mythic_mythic_honor_25", tier:"mythic", from:"Mythic", to:"Mythic Honor 25", desc:"Joki Rank Mythic sampai Mythic Honor 25", price:490000, old:null, tag:null },
    { id:"mythic_mythic_glory_50", tier:"mythic", from:"Mythic", to:"Mythic Glory 50", desc:"Joki Rank Mythic sampai Mythic Glory 50", price:1160000, old:null, tag:null },
    { id:"mythic_mythic_immortal_100", tier:"mythic", from:"Mythic", to:"Mythic Immortal 100", desc:"Joki Rank Mythic sampai Mythic Immortal 100", price:2550000, old:null, tag:null },
    { id:"honor_25_glory_50", tier:"mythic_honor", from:"Honor 25", to:"Glory 50", desc:"Joki Rank Mythic Honor 25 sampai Mythic Glory 50", price:665000, old:null, tag:null },
    { id:"honor_25_immortal_100", tier:"mythic_honor", from:"Honor 25", to:"Immortal 100", desc:"Joki Rank Mythic Honor 25 sampai Mythic Immortal 100", price:2150000, old:null, tag:null },
    { id:"glory_50_immortal_100", tier:"mythic_glory", from:"Glory 50", to:"Immortal 100", desc:"Joki Rank Mythic Glory 50 sampai Mythic Immortal 100", price:1475000, old:null, tag:null },
  ];

  const PAYMENT_FEES = {
    "DANA":0, "OVO":0, "GoPay":0, "ShopeePay":0,
    "QRIS":750, "VA BCA":4000, "VA BRI":4000
  };

  const rupiah = n => "Rp " + Math.round(n).toLocaleString("id-ID");

  const tierTabsWrap = document.getElementById('tierTabsWrap');
  const packageGrid = document.getElementById('packageGrid');

  const jUserId = document.getElementById('jUserId');
  const jZoneId = document.getElementById('jZoneId');

  const jSumRoute = document.getElementById('jSumRoute');
  const jSumStars = document.getElementById('jSumStars');
  const jSumAccount = document.getElementById('jSumAccount');
  const jSumPayment = document.getElementById('jSumPayment');
  const jSumSubtotal = document.getElementById('jSumSubtotal');
  const jSumFee = document.getElementById('jSumFee');
  const jSumTotal = document.getElementById('jSumTotal');
  const jPayBtn = document.getElementById('jPayBtn');

  const overlay = document.getElementById('processOverlay');
  const overlayProcessing = document.getElementById('overlayProcessing');
  const overlaySuccess = document.getElementById('overlaySuccess');
  const processSteps = document.getElementById('processSteps');
  const jSuccessInvoice = document.getElementById('jSuccessInvoice');
  const jSuccessRoute = document.getElementById('jSuccessRoute');
  const jSuccessTotal = document.getElementById('jSuccessTotal');
  const jOrderAgainBtn = document.getElementById('jOrderAgainBtn');

  let selectedPayment = "QRIS";
  let selectedPackage = null;
  let activeTier = TIER_FILTERS[0].key;

  function renderTierTabs(){
    tierTabsWrap.innerHTML = `
      <button type="button" class="tier-tab-arrow tier-tab-prev" aria-label="Sebelumnya">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div class="tier-tabs" id="tierTabs">
        ${TIER_FILTERS.map(t => `<button type="button" class="tier-tab ${t.key===activeTier?'active':''}" data-tier="${t.key}">${t.label}</button>`).join('')}
      </div>
      <button type="button" class="tier-tab-arrow tier-tab-next" aria-label="Berikutnya">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    `;

    const tabsScroller = document.getElementById('tierTabs');
    tierTabsWrap.querySelectorAll('.tier-tab').forEach(tab=>{
      tab.addEventListener('click', ()=>{
        activeTier = tab.dataset.tier;
        selectedPackage = null;
        renderTierTabs();
        renderPackages();
        updateSummary();
      });
    });
    tierTabsWrap.querySelector('.tier-tab-prev').addEventListener('click', ()=>{
      tabsScroller.scrollBy({ left: -160, behavior: 'smooth' });
    });
    tierTabsWrap.querySelector('.tier-tab-next').addEventListener('click', ()=>{
      tabsScroller.scrollBy({ left: 160, behavior: 'smooth' });
    });
  }

  function renderPackages(){
    const filtered = PACKAGES.filter(pkg => pkg.tier === activeTier);

    packageGrid.innerHTML = filtered.map((pkg)=> `
      <label class="package-item" data-id="${pkg.id}">
        <input type="radio" name="jokiPackage" value="${pkg.id}">
        ${pkg.tag ? `<span class="package-badge">${pkg.tag}</span>` : ''}
        <div class="package-route">${pkg.from} to ${pkg.to}</div>
        <div class="package-stars">${pkg.desc}</div>
        <div class="package-price-row">
          ${pkg.old ? `<span class="package-old">${rupiah(pkg.old)}</span>` : ''}
          <span class="package-price">${rupiah(pkg.price)}</span>
        </div>
      </label>
    `).join('');

    packageGrid.querySelectorAll('input[name="jokiPackage"]').forEach(radio=>{
      radio.addEventListener('change', (e)=>{
        selectedPackage = PACKAGES.find(p => p.id === e.target.value) || null;
        updateSummary();
      });
    });
  }

  renderTierTabs();
  renderPackages();

  document.querySelectorAll('input[name="jpayment"]').forEach(radio=>{
    radio.addEventListener('change', (e)=>{
      selectedPayment = e.target.value;
      updateSummary();
    });
  });

  [jUserId, jZoneId].forEach(el=> el.addEventListener('input', updateSummary));

  function updateSummary(){
    const account = [jUserId.value.trim(), jZoneId.value.trim()].filter(Boolean).join(' / ');
    jSumAccount.textContent = account || 'Belum diisi';
    jSumAccount.classList.toggle('muted', !account);

    jSumPayment.textContent = selectedPayment;

    if(!selectedPackage){
      jSumRoute.textContent = 'Belum dipilih';
      jSumRoute.classList.add('muted');
      jSumStars.textContent = '-';
      jSumStars.classList.add('muted');
      jSumSubtotal.textContent = rupiah(0);
      jSumFee.textContent = rupiah(PAYMENT_FEES[selectedPayment] || 0);
      jSumTotal.textContent = rupiah(0);
      jPayBtn.disabled = true;
      jPayBtn.textContent = 'Pilih Paket Dahulu';
      return;
    }

    jSumRoute.textContent = `${selectedPackage.from} → ${selectedPackage.to}`;
    jSumRoute.classList.remove('muted');
    jSumStars.textContent = selectedPackage.desc;
    jSumStars.classList.remove('muted');

    const fee = PAYMENT_FEES[selectedPayment] || 0;
    const total = selectedPackage.price + fee;

    jSumSubtotal.textContent = rupiah(selectedPackage.price);
    jSumFee.textContent = rupiah(fee);
    jSumTotal.textContent = rupiah(total);

    const ready = !!account;
    jPayBtn.disabled = !ready;
    jPayBtn.textContent = ready ? `Bayar ${rupiah(total)}` : 'Lengkapi Data Akun';
  }

  function genInvoice(){
    const d = new Date();
    const ymd = d.getFullYear().toString() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
    const rand = Math.floor(1000 + Math.random()*8999);
    return `FRS-JK-${ymd}-${rand}`;
  }

  jPayBtn.addEventListener('click', ()=>{
    if(jPayBtn.disabled || !selectedPackage) return;
    startProcessing();
  });

  function startProcessing(){
    overlay.classList.add('show');
    overlayProcessing.hidden = false;
    overlaySuccess.hidden = true;

    const steps = processSteps.querySelectorAll('li');
    steps.forEach(li=> li.classList.remove('active','done'));

    const timings = [0, 900, 1900];
    timings.forEach((t, i)=>{
      setTimeout(()=>{
        steps.forEach((li, idx)=>{
          li.classList.toggle('active', idx === i);
          li.classList.toggle('done', idx < i);
        });
      }, t);
    });

    setTimeout(()=>{
      steps.forEach(li=> li.classList.add('done'));
      steps.forEach(li=> li.classList.remove('active'));
      showSuccess();
    }, 3000);
  }

  function showSuccess(){
    overlayProcessing.hidden = true;
    overlaySuccess.hidden = false;

    jSuccessInvoice.textContent = genInvoice();
    jSuccessRoute.textContent = `${selectedPackage.from} → ${selectedPackage.to}`;
    jSuccessTotal.textContent = jSumTotal.textContent;

    showToast('Pesanan joki diterima! Tim kami akan menghubungimu.');
  }

  jOrderAgainBtn.addEventListener('click', ()=>{
    overlay.classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  overlay.addEventListener('click', (e)=>{
    if(e.target === overlay && overlaySuccess.hidden === false){
      overlay.classList.remove('show');
    }
  });

  updateSummary();

})();
