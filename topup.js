/* ============================================================
   topup.js — generic top-up engine, config-driven per game
   Game data (GAMES, GAME_ORDER) and shared helpers (getGameIcon,
   getNominalParts) now live in games-data.js — loaded before this
   file. Edit games-data.js to add/change games, prices, or logos.
============================================================ */
(function(){
  "use strict";

  /* ---------------------------------------------------------- */

  const rupiah = n => "Rp " + Math.round(n).toLocaleString("id-ID");

  const PAYMENT_FEES = {
    "DANA":0, "OVO":0, "GoPay":0, "ShopeePay":0,
    "QRIS":750,
    "VA BCA":4000, "VA BRI":4000, "VA Mandiri":4000, "VA BNI":4000
  };

  const PROMO_CODES = {
    "FROSTY10": { type:"percent", value:10, label:"Diskon 10% (khusus pembelian pertama)", oneTimeOnly:true },
    "FROSTYNEW": { type:"flat", value:5000, label:"Potongan Rp 5.000" },
    "FROSTYSTREAK14": { type:"flat", value:10000, label:"Voucher Check In 14 Hari", minSpend:20000 }
  };

  // Tracks which one-time-only promo codes this browser has already
  // redeemed. This is a soft client-side guard only — it can be bypassed
  // via incognito mode or clearing browser data, and is meant to hold
  // back casual reuse until the real backend (with per-account tracking)
  // is in place.
  const USED_PROMO_KEY = "frostyup_used_promos";
  function getUsedPromoCodes(){
    try{
      return JSON.parse(localStorage.getItem(USED_PROMO_KEY) || "[]");
    }catch(e){
      return [];
    }
  }
  function markPromoAsUsed(code){
    try{
      const used = getUsedPromoCodes();
      if(!used.includes(code)){
        used.push(code);
        localStorage.setItem(USED_PROMO_KEY, JSON.stringify(used));
      }
    }catch(e){ /* localStorage unavailable, silently skip */ }
  }
  function isPromoAlreadyUsed(code){
    return getUsedPromoCodes().includes(code);
  }

  /* ---------------------------------------------------------- */

  const state = {
    gameKey: "mlbb",
    fieldValues: {},
    selectedNominal: null,
    selectedPayment: "QRIS",
    promo: null
  };

  // ---- DOM refs ----
  const bcGameName = document.getElementById('bcGameName');
  const gameSwitcher = document.getElementById('gameSwitcher');
  const gameHeaderThumb = document.getElementById('gameHeaderThumb');
  const gameTitle = document.getElementById('gameTitle');
  const gameSoldCount = document.getElementById('gameSoldCount');
  const dynamicFields = document.getElementById('dynamicFields');
  const nicknameResult = document.getElementById('nicknameResult');
  const checkIdBtn = document.getElementById('checkIdBtn');
  const nominalCatWrap = document.getElementById('nominalCatWrap');
  const promoInput = document.getElementById('promoInput');
  const promoBtn = document.getElementById('promoBtn');
  const promoMsg = document.getElementById('promoMsg');
  const waInput = document.getElementById('contactWa');
  const emailInput = document.getElementById('contactEmail');

  const sumGame = document.getElementById('sumGame');
  const sumAccount = document.getElementById('sumAccount');
  const sumProduct = document.getElementById('sumProduct');
  const sumPayment = document.getElementById('sumPayment');
  const sumSubtotal = document.getElementById('sumSubtotal');
  const sumFee = document.getElementById('sumFee');
  const sumDiscountRow = document.getElementById('sumDiscountRow');
  const sumDiscount = document.getElementById('sumDiscount');
  const sumTotal = document.getElementById('sumTotal');
  const payBtn = document.getElementById('payBtn');

  const overlay = document.getElementById('processOverlay');
  const overlayProcessing = document.getElementById('overlayProcessing');
  const overlaySuccess = document.getElementById('overlaySuccess');
  const processSteps = document.getElementById('processSteps');
  const successInvoice = document.getElementById('successInvoice');
  const successGame = document.getElementById('successGame');
  const successAccount = document.getElementById('successAccount');
  const successProduct = document.getElementById('successProduct');
  const successEmail = document.getElementById('successEmail');
  const successTotal = document.getElementById('successTotal');
  const topupAgainBtn = document.getElementById('topupAgainBtn');

  /* toast() helper: use the global showToast() from common.js instead */

  /* getGameIcon() is defined once in games-data.js and shared here */

  /* ---------- Render: game switcher chips ---------- */
  function renderGameSwitcher(){
    gameSwitcher.innerHTML = GAME_ORDER.map(key=>{
      const g = GAMES[key];
      return `<button class="gs-item ${key===state.gameKey?'active':''}" data-key="${key}" type="button">
        ${getGameIcon(g, 'gs-icon')}<span>${g.name}</span>
      </button>`;
    }).join('');

    gameSwitcher.querySelectorAll('.gs-item').forEach(btn=>{
      btn.addEventListener('click', ()=> selectGame(btn.dataset.key));
    });
  }

  /* ---------- Render: dynamic input fields ---------- */
  function renderFields(){
    const game = GAMES[state.gameKey];
    state.fieldValues = {};

    const halfFields = game.fields.filter(f=>f.width==='half');
    const fullFields = game.fields.filter(f=>f.width!=='half');

    let html = '';
    if(halfFields.length){
      html += `<div class="field-row two-col">` + halfFields.map(f=> renderField(f)).join('') + `</div>`;
    }
    fullFields.forEach(f=>{
      html += `<div class="field-row">${renderFieldInner(f)}</div>`;
    });
    if(game.hint){
      html += `<p class="field-hint">${game.hint}</p>`;
    }
    dynamicFields.innerHTML = html;

    dynamicFields.querySelectorAll('input, select').forEach(el=>{
      el.addEventListener('input', onFieldChange);
      el.addEventListener('change', onFieldChange);
    });

    nicknameResult.className = 'nickname-result';
    nicknameResult.textContent = '';
    updateSummary();
  }
  function renderField(f){
    return `<div>${renderFieldInner(f)}</div>`;
  }
  function renderFieldInner(f){
    if(f.type === 'select'){
      const opts = f.options.map(o=>`<option value="${o}">${o}</option>`).join('');
      return `<label for="f_${f.id}">${f.label}</label>
        <select id="f_${f.id}" data-field="${f.id}">
          <option value="" disabled selected>${f.placeholder}</option>${opts}
        </select>`;
    }
    return `<label for="f_${f.id}">${f.label}</label>
      <input type="text" id="f_${f.id}" data-field="${f.id}" placeholder="${f.placeholder}">`;
  }
  function onFieldChange(e){
    state.fieldValues[e.target.dataset.field] = e.target.value.trim();
    nicknameResult.className = 'nickname-result';
    nicknameResult.textContent = '';
    updateSummary();
  }

  /* getNominalParts() is defined once in games-data.js and shared here */

  /* ---------- Render: nominal grid ----------
     Supports two data shapes from games-data.js:
     1) game.nominals  -> flat array (used by FF, PUBGM, etc) — renders
        as a single grid, same as before.
     2) game.categories -> array of { key, label, items[] } (used by
        MLBB) — renders as a tab switcher + one grid per category.
  ---------------------------------------------------------- */
  function renderNominals(){
    const game = GAMES[state.gameKey];
    state.selectedNominal = null;

    if(game.categories && game.categories.length){
      renderCategorizedNominals(game);
    } else {
      renderFlatNominals(game, game.nominals);
    }
  }

  function renderFlatNominals(game, items){
    const wrap = document.getElementById('nominalCatWrap');
    wrap.innerHTML = `<div class="nominal-grid" id="nominalGrid"></div>`;
    const freshGrid = document.getElementById('nominalGrid');
    freshGrid.innerHTML = buildNominalButtons(items, game, game.nominalIcon);
    bindNominalButtonsScoped(freshGrid, items);
  }

  let activeCategoryKey = null;

  function renderCategorizedNominals(game){
    if(!activeCategoryKey || !game.categories.find(c=>c.key===activeCategoryKey)){
      activeCategoryKey = game.categories[0].key;
    }

    const tabsHtml = `<div class="nominal-cat-tabs" id="nominalCatTabs">` +
      game.categories.map(c=>
        `<button type="button" class="nominal-cat-tab ${c.key===activeCategoryKey?'active':''}" data-cat="${c.key}">${c.label}</button>`
      ).join('') +
      `</div>`;

    const wrap = document.getElementById('nominalCatWrap');
    wrap.innerHTML = tabsHtml + `<div class="nominal-grid" id="nominalGridInner"></div>`;

    const gridInner = document.getElementById('nominalGridInner');
    function paintCategory(catKey){
      const cat = game.categories.find(c=>c.key===catKey);
      gridInner.innerHTML = buildNominalButtons(cat.items, game, cat.icon);
      bindNominalButtonsScoped(gridInner, cat.items);
    }
    paintCategory(activeCategoryKey);

    wrap.querySelectorAll('.nominal-cat-tab').forEach(tab=>{
      tab.addEventListener('click', ()=>{
        activeCategoryKey = tab.dataset.cat;
        wrap.querySelectorAll('.nominal-cat-tab').forEach(t=> t.classList.toggle('active', t===tab));
        state.selectedNominal = null;
        updateSummary();
        paintCategory(activeCategoryKey);
      });
    });
  }

  function buildNominalButtons(items, game, iconUrl){
    return items.map((n, i)=>{
      const parts = getNominalParts(n, game);
      return `
      <button class="nominal-item" data-index="${i}" type="button">
        ${n.tag ? `<span class="nominal-tag">${n.tag}</span>` : ''}
        ${parts.breakdown ? `<span class="nominal-bonus-badge">+Bonus</span>` : ''}
        ${iconUrl ? `<img src="${iconUrl}" alt="" class="nominal-icon" loading="lazy">` : ''}
        <div class="nominal-amount">
          ${parts.main}
          ${parts.breakdown ? `<span class="nominal-breakdown">${parts.breakdown}</span>` : ''}
        </div>
        <div class="nominal-price-row">
          ${n.old ? `<span class="nominal-old">${rupiah(n.old)}</span>` : ''}
          <span class="nominal-price">${rupiah(n.price)}</span>
        </div>
      </button>
    `;
    }).join('');
  }

  function bindNominalButtonsScoped(container, items){
    container.querySelectorAll('.nominal-item').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        container.querySelectorAll('.nominal-item').forEach(b=> b.classList.remove('selected'));
        btn.classList.add('selected');
        state.selectedNominal = items[parseInt(btn.dataset.index,10)];
        updateSummary();
      });
    });
  }

  /* ---------- Game select ---------- */
  function selectGame(key){
    if(!GAMES[key]) return;
    state.gameKey = key;
    state.promo = null;
    activeCategoryKey = null;
    promoInput.value = '';
    promoMsg.textContent = '';
    promoMsg.className = 'promo-msg';

    const game = GAMES[key];
    bcGameName.textContent = game.name;
    gameHeaderThumb.innerHTML = getGameIcon(game, 'header-icon');
    gameTitle.textContent = game.name;
    gameSoldCount.textContent = game.sold;
    document.title = `Top Up ${game.name} — FrostyUp`;

    renderGameSwitcher();
    renderFields();
    renderNominals();
    updateSummary();
  }

  /* ---------- Check nickname (simulated) ---------- */
  checkIdBtn.addEventListener('click', ()=>{
    const game = GAMES[state.gameKey];
    const primaryField = game.fields[0];
    const val = state.fieldValues[primaryField.id];
    if(!val){
      nicknameResult.className = 'nickname-result show err';
      nicknameResult.textContent = `Isi ${primaryField.label.toLowerCase()} terlebih dahulu`;
      return;
    }
    checkIdBtn.disabled = true;
    nicknameResult.className = 'nickname-result show';
    nicknameResult.textContent = 'Mengecek akun...';
    setTimeout(()=>{
      const fakeNames = ["FrostyPlayer","IceWarrior","NightHunter","CyanBlade","ArcticKing","ShadowFox"];
      const nickname = fakeNames[Math.floor(Math.random()*fakeNames.length)];
      nicknameResult.className = 'nickname-result show ok';
      nicknameResult.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg> Akun ditemukan: <strong>${nickname}</strong>`;
      checkIdBtn.disabled = false;
    }, 900);
  });

  /* ---------- Promo ---------- */
  promoBtn.addEventListener('click', ()=>{
    const code = promoInput.value.trim().toUpperCase();
    if(!code){
      promoMsg.className = 'promo-msg err';
      promoMsg.textContent = 'Masukkan kode promo';
      return;
    }
    const promo = PROMO_CODES[code];
    if(!promo){
      state.promo = null;
      promoMsg.className = 'promo-msg err';
      promoMsg.textContent = 'Kode promo tidak valid atau sudah berakhir';
    } else if(promo.oneTimeOnly && isPromoAlreadyUsed(code)){
      state.promo = null;
      promoMsg.className = 'promo-msg err';
      promoMsg.textContent = 'Kode ini hanya berlaku untuk pembelian pertama dan sudah pernah kamu pakai';
    } else if(promo.minSpend && (!state.selectedNominal || state.selectedNominal.price < promo.minSpend)){
      state.promo = null;
      promoMsg.className = 'promo-msg err';
      promoMsg.textContent = `Kode ini berlaku untuk top up minimal ${rupiah(promo.minSpend)}`;
    } else {
      state.promo = { ...promo, code };
      promoMsg.className = 'promo-msg ok';
      promoMsg.textContent = `Kode diterapkan: ${promo.label}`;
      showToast('Kode promo berhasil digunakan');
    }
    updateSummary();
  });

  /* ---------- Payment selection ---------- */
  document.querySelectorAll('input[name="payment"]').forEach(radio=>{
    radio.addEventListener('change', (e)=>{
      state.selectedPayment = e.target.value;
      updateSummary();
    });
  });

  /* ---------- Summary calculation ---------- */
  function getAccountLabel(){
    const game = GAMES[state.gameKey];
    const parts = game.fields.map(f=> state.fieldValues[f.id]).filter(Boolean);
    return parts.length ? parts.join(' / ') : null;
  }

  function updateSummary(){
    const game = GAMES[state.gameKey];
    sumGame.textContent = game.name;

    const accountLabel = getAccountLabel();
    sumAccount.textContent = accountLabel || 'Belum diisi';
    sumAccount.classList.toggle('muted', !accountLabel);

    if(state.selectedNominal){
      sumProduct.textContent = getNominalParts(state.selectedNominal, game).main;
      sumProduct.classList.remove('muted');
    } else {
      sumProduct.textContent = 'Belum dipilih';
      sumProduct.classList.add('muted');
    }

    sumPayment.textContent = state.selectedPayment;

    const subtotal = state.selectedNominal ? state.selectedNominal.price : 0;
    const fee = state.selectedNominal ? (PAYMENT_FEES[state.selectedPayment] || 0) : 0;

    // if a min-spend promo is active but the current nominal no longer
    // qualifies (e.g. user switched to a cheaper item after applying it),
    // drop the promo instead of silently keeping an invalid discount
    if(state.promo && state.promo.minSpend && subtotal < state.promo.minSpend){
      const droppedMinSpend = state.promo.minSpend;
      state.promo = null;
      promoMsg.className = 'promo-msg err';
      promoMsg.textContent = `Kode promo dilepas, nominal di bawah minimal ${rupiah(droppedMinSpend)}`;
    }

    let discount = 0;
    if(state.promo && state.selectedNominal){
      discount = state.promo.type === 'percent'
        ? Math.round(subtotal * state.promo.value / 100)
        : state.promo.value;
      discount = Math.min(discount, subtotal);
    }

    sumSubtotal.textContent = rupiah(subtotal);
    sumFee.textContent = rupiah(fee);

    if(discount > 0){
      sumDiscountRow.hidden = false;
      sumDiscount.textContent = '- ' + rupiah(discount);
    } else {
      sumDiscountRow.hidden = true;
    }

    const total = Math.max(0, subtotal + fee - discount);
    sumTotal.textContent = rupiah(total);

    const contactWa = waInput ? waInput.value.trim() : '';
    const contactEmail = emailInput ? emailInput.value.trim() : '';
    const contactValid = contactWa.length >= 9 && /^\S+@\S+\.\S+$/.test(contactEmail);

    const ready = !!state.selectedNominal && !!accountLabel && contactValid;
    payBtn.disabled = !ready;
    payBtn.textContent = !state.selectedNominal
      ? 'Pilih Nominal Dahulu'
      : (!accountLabel ? 'Lengkapi Data Akun'
        : (!contactValid ? 'Lengkapi WhatsApp & Email' : `Bayar ${rupiah(total)}`));
  }

  /* ---------- Pay flow: processing -> success ---------- */
  function genInvoice(){
    const d = new Date();
    const ymd = d.getFullYear().toString() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
    const rand = Math.floor(1000 + Math.random()*8999);
    return `FRS-${ymd}-${rand}`;
  }

  payBtn.addEventListener('click', ()=>{
    if(payBtn.disabled) return;
    startProcessing();
  });

  function startProcessing(){
    overlay.classList.add('show');
    overlayProcessing.hidden = false;
    overlaySuccess.hidden = true;

    const steps = processSteps.querySelectorAll('li');
    steps.forEach(li=> li.classList.remove('active','done'));

    const timings = [0, 900, 1900]; // when each step becomes active
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
    const game = GAMES[state.gameKey];
    overlayProcessing.hidden = true;
    overlaySuccess.hidden = false;

    successInvoice.textContent = genInvoice();
    successGame.textContent = game.name;
    successAccount.textContent = getAccountLabel() || '-';
    successProduct.textContent = state.selectedNominal ? getNominalParts(state.selectedNominal, game).main : '-';
    successTotal.textContent = sumTotal.textContent;

    // lock the one-time promo code now that it has actually been redeemed
    if(state.promo && state.promo.oneTimeOnly && state.promo.code){
      markPromoAsUsed(state.promo.code);
    }

    const emailVal = emailInput ? emailInput.value.trim() : '';
    successEmail.textContent = emailVal || '-';
    showToast(emailVal ? `Pembayaran berhasil! Invoice dikirim ke ${emailVal}` : 'Pembayaran berhasil! Item terkirim otomatis.');
  }

  topupAgainBtn.addEventListener('click', ()=>{
    overlay.classList.remove('show');
    // reset nominal + fields for a fresh order, keep same game
    nominalCatWrap.querySelectorAll('.nominal-item').forEach(b=> b.classList.remove('selected'));
    state.selectedNominal = null;
    dynamicFields.querySelectorAll('input, select').forEach(el=> el.value = '');
    state.fieldValues = {};
    if(waInput) waInput.value = '';
    if(emailInput) emailInput.value = '';
    updateSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  overlay.addEventListener('click', (e)=>{
    if(e.target === overlay && overlaySuccess.hidden === false){
      overlay.classList.remove('show');
    }
  });

  /* ---------- Init ---------- */
  const urlParams = new URLSearchParams(window.location.search);
  const requestedGame = urlParams.get('game');
  if(requestedGame && GAMES[requestedGame]){
    state.gameKey = requestedGame;
  }

  renderGameSwitcher();
  renderFields();
  renderNominals();
  updateSummary();

  if(waInput) waInput.addEventListener('input', updateSummary);
  if(emailInput) emailInput.addEventListener('input', updateSummary);

  // sync header text for the initially selected game (in case it's not the default mlbb)
  (function syncInitialHeader(){
    const game = GAMES[state.gameKey];
    bcGameName.textContent = game.name;
    gameHeaderThumb.innerHTML = getGameIcon(game, 'header-icon');
    gameTitle.textContent = game.name;
    gameSoldCount.textContent = game.sold;
    document.title = `Top Up ${game.name} — FrostyUp`;
  })();

})();
