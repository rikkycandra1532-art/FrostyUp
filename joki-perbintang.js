/* ============================================================
   joki-perbintang.js — Joki Rank Per Bintang engine
   Calculates star difference between current rank and target
   rank automatically (higher ranks cost more per star).
============================================================ */
(function(){
  "use strict";

  const RANKS = [
    { id:"warrior",  name:"Warrior",      hasDivisions:true,  pricePerStar:1500 },
    { id:"elite",    name:"Elite",        hasDivisions:true,  pricePerStar:2000 },
    { id:"master",   name:"Master",       hasDivisions:true,  pricePerStar:3000 },
    { id:"gm",       name:"Grand Master", hasDivisions:true,  pricePerStar:4000 },
    { id:"epic",     name:"Epic",         hasDivisions:true,  pricePerStar:7000 },
    { id:"legend",   name:"Legend",       hasDivisions:true,  pricePerStar:9000 },
    { id:"mythic",   name:"Mythic",       hasDivisions:false, pricePerStar:11000 },
    { id:"mythic_honor",  name:"Mythic Honor",  hasDivisions:false, pricePerStar:13000 },
    { id:"mythic_glory",  name:"Mythic Glory",  hasDivisions:false, pricePerStar:15000 },
    { id:"mythic_immortal", name:"Mythic Immortal", hasDivisions:false, pricePerStar:20000 }
  ];

  const PAYMENT_FEES = {
    "DANA":0, "OVO":0, "GoPay":0, "ShopeePay":0,
    "QRIS":750, "VA BCA":4000, "VA BRI":4000
  };

  const rupiah = n => "Rp " + Math.round(n).toLocaleString("id-ID");

  function absoluteStarIndex(rankIdx, starsIntoRank){
    let total = 0;
    for(let i=0; i<rankIdx; i++){
      total += RANKS[i].hasDivisions ? 5 : 1;
    }
    return total + starsIntoRank;
  }

  function calcPriceForRange(fromRankIdx, fromStars, toRankIdx, toStars){
    if(fromRankIdx === toRankIdx){
      const stars = Math.max(0, toStars - fromStars);
      return { stars, totalPrice: stars * RANKS[fromRankIdx].pricePerStar };
    }
    let totalStars = 0;
    let totalPrice = 0;

    const firstRank = RANKS[fromRankIdx];
    const firstRankCap = firstRank.hasDivisions ? 5 : 1;
    const starsInFirst = Math.max(0, firstRankCap - fromStars);
    totalStars += starsInFirst;
    totalPrice += starsInFirst * firstRank.pricePerStar;

    for(let i = fromRankIdx + 1; i < toRankIdx; i++){
      const r = RANKS[i];
      const cap = r.hasDivisions ? 5 : 1;
      totalStars += cap;
      totalPrice += cap * r.pricePerStar;
    }

    const lastRank = RANKS[toRankIdx];
    totalStars += toStars;
    totalPrice += toStars * lastRank.pricePerStar;

    return { stars: totalStars, totalPrice };
  }

  const rankFromSel = document.getElementById('rankFrom');
  const rankToSel = document.getElementById('rankTo');
  const starFrom = document.getElementById('starFrom');
  const starTo = document.getElementById('starTo');
  const starFromDisplay = document.getElementById('starFromDisplay');
  const starToDisplay = document.getElementById('starToDisplay');
  const starFromWrap = document.getElementById('starFromWrap');
  const starToWrap = document.getElementById('starToWrap');
  const rankSummaryText = document.getElementById('rankSummaryText');

  const jUserId = document.getElementById('jUserId');
  const jZoneId = document.getElementById('jZoneId');

  const jSumRoute = document.getElementById('jSumRoute');
  const jSumStars = document.getElementById('jSumStars');
  const jSumAccount = document.getElementById('jSumAccount');
  const jSumPayment = document.getElementById('jSumPayment');
  const jSumPerStar = document.getElementById('jSumPerStar');
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
  let lastResult = null;

  function populateRankSelects(){
    const opts = RANKS.map((r,i)=> `<option value="${i}">${r.name}</option>`).join('');
    rankFromSel.innerHTML = `<option value="" disabled selected>Pilih rank sekarang</option>${opts}`;
    rankToSel.innerHTML = `<option value="" disabled selected>Pilih rank tujuan</option>${opts}`;
  }
  populateRankSelects();

  function updateStarPickerVisibility(){
    const fromIdx = rankFromSel.value;
    const toIdx = rankToSel.value;
    starFromWrap.style.display = (fromIdx !== "" && RANKS[fromIdx].hasDivisions) ? '' : 'none';
    starToWrap.style.display = (toIdx !== "" && RANKS[toIdx].hasDivisions) ? '' : 'none';
  }

  starFrom.addEventListener('input', ()=>{
    starFromDisplay.textContent = `★ ${starFrom.value}`;
    recalc();
  });
  starTo.addEventListener('input', ()=>{
    starToDisplay.textContent = `★ ${starTo.value}`;
    recalc();
  });

  rankFromSel.addEventListener('change', ()=>{ updateStarPickerVisibility(); recalc(); });
  rankToSel.addEventListener('change', ()=>{ updateStarPickerVisibility(); recalc(); });

  function recalc(){
    const fromIdx = rankFromSel.value;
    const toIdx = rankToSel.value;

    if(fromIdx === "" || toIdx === ""){
      rankSummaryText.textContent = "Pilih rank sekarang dan rank tujuan untuk melihat estimasi.";
      lastResult = null;
      updateSummary();
      return;
    }

    const fromI = parseInt(fromIdx,10);
    const toI = parseInt(toIdx,10);
    const fromStars = RANKS[fromI].hasDivisions ? parseInt(starFrom.value,10) : 0;
    const toStars = RANKS[toI].hasDivisions ? parseInt(starTo.value,10) : parseInt(starTo.value || 0, 10);

    const fromAbs = absoluteStarIndex(fromI, fromStars);
    const toAbs = absoluteStarIndex(toI, toStars);

    if(toAbs <= fromAbs){
      rankSummaryText.textContent = "Rank tujuan harus lebih tinggi dari rank sekarang.";
      lastResult = null;
      updateSummary();
      return;
    }

    const calc = calcPriceForRange(fromI, fromStars, toI, toStars);
    const avgPerStar = calc.stars > 0 ? calc.totalPrice / calc.stars : 0;

    lastResult = {
      fromName: RANKS[fromI].name + (RANKS[fromI].hasDivisions ? ` ${fromStars}` : ''),
      toName: RANKS[toI].name + (RANKS[toI].hasDivisions ? ` ${toStars}` : ''),
      stars: calc.stars,
      totalPrice: calc.totalPrice,
      avgPerStar
    };

    rankSummaryText.innerHTML = `Estimasi <strong>${calc.stars} bintang</strong> dari <strong>${lastResult.fromName}</strong> ke <strong>${lastResult.toName}</strong>`;
    updateSummary();
  }

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

    if(!lastResult){
      jSumRoute.textContent = 'Belum dipilih';
      jSumRoute.classList.add('muted');
      jSumStars.textContent = '-';
      jSumStars.classList.add('muted');
      jSumPerStar.textContent = rupiah(0);
      jSumSubtotal.textContent = rupiah(0);
      jSumFee.textContent = rupiah(PAYMENT_FEES[selectedPayment] || 0);
      jSumTotal.textContent = rupiah(0);
      jPayBtn.disabled = true;
      jPayBtn.textContent = 'Pilih Rank Dahulu';
      return;
    }

    jSumRoute.textContent = `${lastResult.fromName} → ${lastResult.toName}`;
    jSumRoute.classList.remove('muted');
    jSumStars.textContent = `${lastResult.stars} bintang`;
    jSumStars.classList.remove('muted');
    jSumPerStar.textContent = rupiah(lastResult.avgPerStar) + ' /bintang';

    const fee = PAYMENT_FEES[selectedPayment] || 0;
    const total = lastResult.totalPrice + fee;

    jSumSubtotal.textContent = rupiah(lastResult.totalPrice);
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
    if(jPayBtn.disabled || !lastResult) return;
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
    jSuccessRoute.textContent = `${lastResult.fromName} → ${lastResult.toName}`;
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

  updateStarPickerVisibility();
  updateSummary();

})();
