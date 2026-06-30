/* ============================================================
   kalkulator.js — Win Rate, Magic Wheel, Zodiac calculators
   Mirrors BangJeff's calculator suite:
   https://www.bangjeff.com/id-id/calculator/win-rate
   https://www.bangjeff.com/id-id/calculator/magic-wheel
   https://www.bangjeff.com/id-id/calculator/zodiac
============================================================ */
(function(){
  "use strict";

  /* ---------- Tab switching ---------- */
  const tabs = document.getElementById('kalkTabs');
  const panels = {
    winrate: document.getElementById('winratePanel'),
    magicwheel: document.getElementById('magicwheelPanel'),
    zodiac: document.getElementById('zodiacPanel')
  };
  tabs.querySelectorAll('.kalk-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      const key = tab.dataset.tab;
      tabs.querySelectorAll('.kalk-tab').forEach(t=> t.classList.toggle('active', t === tab));
      Object.keys(panels).forEach(k=> panels[k].hidden = (k !== key));
    });
  });

  /* ============================================================
     WIN RATE CALCULATOR
     Given current total matches (T) and win rate (W%), find how
     many additional matches (n) — assumed all wins — are needed
     to reach a target win rate (R%):
       (W*T/100 + n) / (T + n) = R/100  =>  solve for n
  ============================================================ */
  const wrTotalMatch = document.getElementById('wrTotalMatch');
  const wrCurrentRate = document.getElementById('wrCurrentRate');
  const wrTargetRate = document.getElementById('wrTargetRate');
  const wrCalcBtn = document.getElementById('wrCalcBtn');
  const wrResultBox = document.getElementById('wrResultBox');
  const wrCurrentWins = document.getElementById('wrCurrentWins');
  const wrWinsNeeded = document.getElementById('wrWinsNeeded');
  const wrFinalMatch = document.getElementById('wrFinalMatch');
  const wrErrorMsg = document.getElementById('wrErrorMsg');

  wrCalcBtn.addEventListener('click', ()=>{
    const T = parseFloat(wrTotalMatch.value);
    const W = parseFloat(wrCurrentRate.value);
    const R = parseFloat(wrTargetRate.value);

    wrErrorMsg.hidden = true;
    wrResultBox.hidden = true;

    if(!T || T <= 0 || isNaN(W) || isNaN(R)){
      wrErrorMsg.textContent = 'Isi semua kolom dengan angka yang valid.';
      wrErrorMsg.hidden = false;
      return;
    }
    if(R <= W){
      wrErrorMsg.textContent = 'Target win rate harus lebih besar dari win rate sekarang.';
      wrErrorMsg.hidden = false;
      return;
    }
    if(R >= 100){
      wrErrorMsg.textContent = 'Target win rate harus di bawah 100%.';
      wrErrorMsg.hidden = false;
      return;
    }

    const currentWins = (W / 100) * T;
    const n = (R * T / 100 - currentWins) / (1 - R / 100);
    const winsNeeded = Math.ceil(n);

    wrCurrentWins.textContent = `${Math.round(currentWins)} dari ${T} pertandingan`;
    wrWinsNeeded.textContent = `${winsNeeded} kali menang beruntun`;
    wrFinalMatch.textContent = `${T + winsNeeded} pertandingan`;
    wrResultBox.hidden = false;
  });

  /* ============================================================
     MAGIC WHEEL & ZODIAC CALCULATORS
     Same mechanic for both: a point slider from 0-100 represents
     how far along the player already is on the wheel. Remaining
     diamonds needed scale down linearly as the point increases,
     reaching 0 at 100 points (reward guaranteed).
  ============================================================ */
  function setupWheelCalculator(sliderId, pointResultId, diamondResultId, maxDiamond, maxPoint){
    const slider = document.getElementById(sliderId);
    const pointResult = document.getElementById(pointResultId);
    const diamondResult = document.getElementById(diamondResultId);

    function update(){
      const point = parseInt(slider.value, 10);
      const remainingFraction = (maxPoint - point) / maxPoint;
      const diamondNeeded = Math.round(maxDiamond * remainingFraction);

      pointResult.textContent = point;
      diamondResult.textContent = diamondNeeded.toLocaleString('id-ID');
    }

    slider.addEventListener('input', update);
    update();
  }

  setupWheelCalculator('mwSlider', 'mwPointResult', 'mwDiamondResult', 10800, 200);
  setupWheelCalculator('zdSlider', 'zdPointResult', 'zdDiamondResult', 1700, 100);

})();
