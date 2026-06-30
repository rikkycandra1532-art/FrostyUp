/* ============================================================
   joki.js — Joki Gendong Rank Mobile Legends engine
   Two pricing modes:
   1) "Per Bintang" — pick current rank + target rank, price is
      calculated automatically star-by-star (higher ranks cost
      more per star, matching common market rates).
   2) "Paket Hemat" — flat-price packages for popular routes,
      priced lower than the per-star equivalent as an incentive.

   This is a single "Joki Gendong" service (joker plays directly
   on the customer's account) — no Solo/Duo/Priority mode choice.
============================================================ */
(function(){
  "use strict";

  /* ----------------------------------------------------------
     RANK DATA (used by Per Bintang mode)
     Each rank has 5 "divisions" (V down to I) except the top
     ranks which are open-ended (counted in plain stars, no
     sub-division), matching how MLBB's ranked ladder actually
     works. pricePerStar = cost to climb ONE star while the
     player is sitting in that rank tier.
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     PACKAGE DATA (used by Paket Hemat mode)
     Flat prices for popular rank routes, priced below what the
     equivalent per-star calculation would cost — the incentive
     for picking a package over manual per-star pricing.
     "old" = the equivalent per-star price, shown crossed out.
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     Convert (rankIndex, division) into one absolute "star index"
     so we can always do toIndex - fromIndex to get total stars,
     regardless of how many ranks/divisions are crossed.
  ---------------------------------------------------------- */
  function absoluteStarIndex(rankIdx, starsIntoRank){
    let total = 0;
    for(let i=0; i<rankIdx; i++){
      total += RANKS[i].hasDivisions ? 5 : 1;
    }
    return total + starsIntoRank;
  }

  // Determine total stars + price for a climb that may span multiple
  // rank tiers, pricing each segment at that segment's per-star rate.
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

  /* ---------------------------------------------------------- */

  const jokiTabs = document.getElementById('jokiTabs');
  const perstarPanel = document.getElementById('perstarPanel');
  const packagePanel = document.getElementById('packagePanel');

  const rankFromSel = document.getElementById('rankFrom');
  const rankToSel = document.getElementById('rankTo');
  const starFrom = document.getElementById('starFrom');
  const starTo = document.getElementById('starTo');
  const starFromDisplay = document.getElementById('starFromDisplay');
  const starToDisplay = document.getElementById('starToDisplay');
  const starFromWrap = document.getElementById('starFromWrap');
  const starToWrap = document.getElementById('starToWrap');
  const rankSummaryText = document.getElementById('rankSummaryText');

  const packageGrid = document.getElementById('packageGrid');

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
  const jSuccessMode = document.getElementById('jSuccessMode');
  const jSuccessTotal = document.getElementById('jSuccessTotal');
  const jOrderAgainBtn = document.getElementById('jOrderAgainBtn');

  let selectedPayment = "QRIS";
  let activeTab = "perstar"; // "perstar" | "package"
  let lastResult = null;      // result from per-star calculator
  let selectedPackage = null; // result from package picker

  /* ---------- Tab switching ---------- */
  jokiTabs.querySelectorAll('.joki-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      activeTab = tab.dataset.tab;
      jokiTabs.querySelectorAll('.joki-tab').forEach(t=> t.classList.toggle('active', t === tab));
      perstarPanel.hidden = activeTab !== 'perstar';
      packagePanel.hidden = activeTab !== 'package';
      updateSummary();
    });
  });

  /* ---------- Populate rank dropdowns (Per Bintang) ---------- */
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
    recalcPerStar();
  });
  starTo.addEventListener('input', ()=>{
    starToDisplay.textContent = `★ ${starTo.value}`;
    recalcPerStar();
  });

  rankFromSel.addEventListener('change', ()=>{ updateStarPickerVisibility(); recalcPerStar(); });
  rankToSel.addEventListener('change', ()=>{ updateStarPickerVisibility(); recalcPerStar(); });

  /* ---------- Per Bintang calculation ---------- */
  function recalcPerStar(){
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

  /* ---------- Package picker (Paket Hemat) ---------- */
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

  /* ---------- Payment ---------- */
  document.querySelectorAll('input[name="jpayment"]').forEach(radio=>{
    radio.addEventListener('change', (e)=>{
      selectedPayment = e.target.value;
      updateSummary();
    });
  });

  /* ---------- Account fields ---------- */
  [jUserId, jZoneId].forEach(el=> el.addEventListener('input', updateSummary));

  /* ---------- Summary ----------
     Reads from whichever pricing mode is active (lastResult for
     Per Bintang, selectedPackage for Paket Hemat) and renders a
     unified summary + total regardless of which mode was used.
  ---------------------------------------------------------- */
  function getActiveSelection(){
    if(activeTab === 'package'){
      if(!selectedPackage) return null;
      return {
        routeLabel: `${selectedPackage.from} → ${selectedPackage.to}`,
        starsLabel: `${selectedPackage.stars} bintang`,
        subtotal: selectedPackage.price
      };
    }
    if(!lastResult) return null;
    return {
      routeLabel: `${lastResult.fromName} → ${lastResult.toName}`,
      starsLabel: `${lastResult.stars} bintang`,
      subtotal: lastResult.totalPrice
    };
  }

  function updateSummary(){
    const account = [jUserId.value.trim(), jZoneId.value.trim()].filter(Boolean).join(' / ');
    jSumAccount.textContent = account || 'Belum diisi';
    jSumAccount.classList.toggle('muted', !account);

    jSumPayment.textContent = selectedPayment;

    const selection = getActiveSelection();

    if(!selection){
      jSumRoute.textContent = 'Belum dipilih';
      jSumRoute.classList.add('muted');
      jSumStars.textContent = '-';
      jSumStars.classList.add('muted');
      jSumPerStar.textContent = rupiah(0);
      jSumSubtotal.textContent = rupiah(0);
      jSumFee.textContent = rupiah(PAYMENT_FEES[selectedPayment] || 0);
      jSumTotal.textContent = rupiah(0);
      jPayBtn.disabled = true;
      jPayBtn.textContent = activeTab === 'package' ? 'Pilih Paket Dahulu' : 'Pilih Rank Dahulu';
      return;
    }

    jSumRoute.textContent = selection.routeLabel;
    jSumRoute.classList.remove('muted');
    jSumStars.textContent = selection.starsLabel;
    jSumStars.classList.remove('muted');

    const fee = PAYMENT_FEES[selectedPayment] || 0;
    const total = selection.subtotal + fee;

    jSumPerStar.textContent = activeTab === 'package' ? 'Harga Paket' : rupiah(lastResult.avgPerStar) + ' /bintang';
    jSumSubtotal.textContent = rupiah(selection.subtotal);
    jSumFee.textContent = rupiah(fee);
    jSumTotal.textContent = rupiah(total);

    const ready = !!account;
    jPayBtn.disabled = !ready;
    jPayBtn.textContent = ready ? `Bayar ${rupiah(total)}` : 'Lengkapi Data Akun';
  }

  /* ---------- Pay flow ---------- */
  function genInvoice(){
    const d = new Date();
    const ymd = d.getFullYear().toString() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
    const rand = Math.floor(1000 + Math.random()*8999);
    return `FRS-JK-${ymd}-${rand}`;
  }

  jPayBtn.addEventListener('click', ()=>{
    if(jPayBtn.disabled || !getActiveSelection()) return;
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
    const selection = getActiveSelection();
    overlayProcessing.hidden = true;
    overlaySuccess.hidden = false;

    jSuccessInvoice.textContent = genInvoice();
    jSuccessRoute.textContent = selection.routeLabel;
    jSuccessMode.textContent = activeTab === 'package' ? 'Joki Gendong (Paket)' : 'Joki Gendong (Per Bintang)';
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

  /* ---------- Init ---------- */
  updateStarPickerVisibility();
  updateSummary();

})();
