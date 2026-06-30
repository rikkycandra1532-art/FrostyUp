/* ============================================================
   joki-paketan.js — Joki Rank Paketan engine
   Flat-price packages for popular rank routes, priced lower
   than the per-star equivalent as an incentive.
============================================================ */
(function(){
  "use strict";

  const PACKAGES = [
    { id:"warrior_epic", from:"Warrior", to:"Epic", stars:35, price:115000, old:135000, tag:null },
    { id:"epic_legend", from:"Epic", to:"Legend", stars:5, price:32000, old:35000, tag:"Populer" },
    { id:"legend_mythic", from:"Legend", to:"Mythic", stars:5, price:42000, old:45000, tag:"Populer" },
    { id:"epic_mythic", from:"Epic", to:"Mythic", stars:10, price:72000, old:80000, tag:"Best Value" },
    { id:"mythic_honor", from:"Mythic", to:"Mythic Honor", stars:50, price:480000, old:550000, tag:null },
    { id:"mythic_glory", from:"Mythic", to:"Mythic Glory", stars:120, price:1250000, old:1440000, tag:"Best Value" }
  ];

  const PAYMENT_FEES = {
    "DANA":0, "OVO":0, "GoPay":0, "ShopeePay":0,
    "QRIS":750, "VA BCA":4000, "VA BRI":4000
  };

  const rupiah = n => "Rp " + Math.round(n).toLocaleString("id-ID");

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

  function renderPackages(){
    packageGrid.innerHTML = PACKAGES.map((pkg, i)=> `
      <label class="package-item" data-index="${i}">
        <input type="radio" name="jokiPackage" value="${i}">
        ${pkg.tag ? `<span class="package-badge">${pkg.tag}</span>` : ''}
        <div class="package-route">${pkg.from} → ${pkg.to}</div>
        <div class="package-stars">${pkg.stars} bintang</div>
        <div class="package-price-row">
          <span class="package-old">${rupiah(pkg.old)}</span>
          <span class="package-price">${rupiah(pkg.price)}</span>
        </div>
        <div class="package-save">Hemat ${rupiah(pkg.old - pkg.price)}</div>
      </label>
    `).join('');

    packageGrid.querySelectorAll('input[name="jokiPackage"]').forEach(radio=>{
      radio.addEventListener('change', (e)=>{
        const idx = parseInt(e.target.value, 10);
        selectedPackage = PACKAGES[idx];
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

    jSumRoute.textContent = `${selectedPackage.from} → ${selectedPackage.to}`;
    jSumRoute.classList.remove('muted');
    jSumStars.textContent = `${selectedPackage.stars} bintang`;
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
