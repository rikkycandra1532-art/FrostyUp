/* ============================================================
   joki-classic.js — Joki MLBB Classic engine
   Flat-price packages based on number of wins (not rank stars) —
   Classic mode in MLBB isn't ranked, so pricing is per-win-count
   instead of per-star.
============================================================ */
(function(){
  "use strict";

  const WIN_PACKAGES = [
    { id:"win10", label:"Menang 10x", price:35000, old:42000, tag:null },
    { id:"win25", label:"Menang 25x", price:80000, old:95000, tag:"Populer" },
    { id:"win50", label:"Menang 50x", price:150000, old:180000, tag:"Best Value" },
    { id:"win100", label:"Menang 100x", price:280000, old:340000, tag:"Best Value" }
  ];

  const PAYMENT_FEES = {
    "DANA":0, "OVO":0, "GoPay":0, "ShopeePay":0,
    "QRIS":750, "VA BCA":4000, "VA BRI":4000
  };

  const rupiah = n => "Rp " + Math.round(n).toLocaleString("id-ID");

  const winPackageGrid = document.getElementById('winPackageGrid');

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

  // Rough estimate: ~15 minutes per match on average, used only to
  // give the customer a sense of duration, not a strict guarantee.
  function estimateDuration(winCount){
    const totalMinutes = winCount * 18; // assumes ~70% win rate, so more matches than wins
    const hours = Math.round(totalMinutes / 60 * 10) / 10;
    return `± ${hours} jam`;
  }

  function renderPackages(){
    winPackageGrid.innerHTML = WIN_PACKAGES.map((pkg, i)=> `
      <label class="package-item" data-index="${i}">
        <input type="radio" name="jokiWinPackage" value="${i}">
        ${pkg.tag ? `<span class="package-badge">${pkg.tag}</span>` : ''}
        <div class="package-route">${pkg.label}</div>
        <div class="package-stars">Estimasi ${estimateDuration(parseInt(pkg.label.match(/\d+/)[0],10))}</div>
        <div class="package-price-row">
          <span class="package-old">${rupiah(pkg.old)}</span>
          <span class="package-price">${rupiah(pkg.price)}</span>
        </div>
        <div class="package-save">Hemat ${rupiah(pkg.old - pkg.price)}</div>
      </label>
    `).join('');

    winPackageGrid.querySelectorAll('input[name="jokiWinPackage"]').forEach(radio=>{
      radio.addEventListener('change', (e)=>{
        const idx = parseInt(e.target.value, 10);
        selectedPackage = WIN_PACKAGES[idx];
        updateSummary();
      });
    });
  }
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

    const winCount = parseInt(selectedPackage.label.match(/\d+/)[0], 10);

    jSumRoute.textContent = selectedPackage.label;
    jSumRoute.classList.remove('muted');
    jSumStars.textContent = estimateDuration(winCount);
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
    jSuccessRoute.textContent = selectedPackage.label;
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
