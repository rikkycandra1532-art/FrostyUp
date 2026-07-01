/* ============================================================
   apk.js — Halaman Langganan Premium (YouTube, Netflix, dll)
   FrostyUp
============================================================ */
(function(){
  "use strict";

  const rupiah = n => "Rp " + Math.round(n).toLocaleString("id-ID");

  // ---- Data produk langganan ----
  const PRODUCTS = [
    // YOUTUBE PREMIUM
    { id:"yt-1m", brand:"youtube", name:"YouTube Premium", duration:"1 Bulan", type:"Sharing", desc:"Nikmati YouTube tanpa iklan, download offline, dan YouTube Music. Satu profil dalam akun keluarga bersama.", price:18000, old:25000, tag:"Terlaris", features:["Tanpa iklan","YouTube Music","Download offline","Background play"] },
    { id:"yt-3m", brand:"youtube", name:"YouTube Premium", duration:"3 Bulan", type:"Sharing", desc:"Paket hemat 3 bulan tanpa iklan. Cocok untuk pemakaian jangka menengah.", price:50000, old:75000, tag:"Hemat", features:["Tanpa iklan","YouTube Music","Download offline","Background play"] },
    { id:"yt-12m", brand:"youtube", name:"YouTube Premium", duration:"12 Bulan", type:"Sharing", desc:"Paket tahunan paling hemat. Harga per bulan lebih murah dari kopi sachetan.", price:180000, old:300000, tag:"Best Value", features:["Tanpa iklan","YouTube Music","Download offline","Background play","Hemat 40%"] },

    // NETFLIX
    { id:"nf-1m-std", brand:"netflix", name:"Netflix", duration:"1 Bulan", type:"Standard (2 layar)", desc:"Tonton film dan serial Netflix favorit di resolusi HD hingga 1080p. Bisa 2 layar sekaligus.", price:55000, old:65000, tag:null, features:["Full HD 1080p","2 layar bersamaan","Download 2 perangkat","Semua konten Netflix"] },
    { id:"nf-1m-pre", brand:"netflix", name:"Netflix", duration:"1 Bulan", type:"Premium (4 layar)", desc:"Resolusi tertinggi hingga 4K Ultra HD, Dolby Atmos, dan 4 layar sekaligus. Terbaik untuk keluarga.", price:75000, old:95000, tag:"4K UHD", features:["4K Ultra HD","Dolby Atmos","4 layar bersamaan","Download 6 perangkat"] },
    { id:"nf-3m-std", brand:"netflix", name:"Netflix", duration:"3 Bulan", type:"Standard (2 layar)", desc:"Hemat lebih banyak dengan paket 3 bulan. Cocok untuk marathon serial favoritmu.", price:150000, old:195000, tag:"Hemat", features:["Full HD 1080p","2 layar bersamaan","Download 2 perangkat"] },

    // SPOTIFY
    { id:"sp-1m", brand:"spotify", name:"Spotify Premium", duration:"1 Bulan", type:"Individual", desc:"Streaming musik tanpa batas, tanpa iklan, kualitas audio tinggi, dan bisa download untuk didengar offline.", price:20000, old:29000, tag:"Populer", features:["Tanpa iklan","Download offline","Kualitas Very High","Skip tak terbatas"] },
    { id:"sp-3m", brand:"spotify", name:"Spotify Premium", duration:"3 Bulan", type:"Individual", desc:"Nikmati 3 bulan penuh musik tanpa gangguan iklan dengan harga yang lebih hemat.", price:55000, old:87000, tag:"Hemat", features:["Tanpa iklan","Download offline","Kualitas Very High","Skip tak terbatas"] },
    { id:"sp-12m", brand:"spotify", name:"Spotify Premium", duration:"12 Bulan", type:"Individual", desc:"Harga terbaik untuk pendengar setia musik. Hemat hingga 37% dibanding bayar bulanan.", price:190000, old:300000, tag:"Best Value", features:["Tanpa iklan","Download offline","Kualitas Very High","Hemat 37%"] },

    // DISNEY+ HOTSTAR
    { id:"ds-1m", brand:"disney", name:"Disney+ Hotstar", duration:"1 Bulan", type:"Mobile", desc:"Tonton konten Disney, Marvel, Star Wars, Pixar, dan National Geographic di perangkat mobile.", price:25000, old:35000, tag:null, features:["Disney Original","Marvel & Star Wars","National Geographic","Konten lokal"] },
    { id:"ds-1m-pre", brand:"disney", name:"Disney+ Hotstar", duration:"1 Bulan", type:"Premium", desc:"Akses penuh konten 4K, multi-perangkat, dan streaming live sports. Pengalaman menonton terbaik.", price:45000, old:59000, tag:"4K", features:["4K + HDR","Live Sports","4 perangkat","Download offline"] },
    { id:"ds-12m", brand:"disney", name:"Disney+ Hotstar", duration:"12 Bulan", type:"Premium", desc:"Paket tahunan Disney+ Hotstar paling hemat. Akses semua konten premium selama 12 bulan penuh.", price:480000, old:600000, tag:"Best Value", features:["4K + HDR","Live Sports","4 perangkat","Hemat 20%"] },
  ];

  // SVG logo per brand — akurat sesuai warna dan bentuk resmi
  const brandLogo = {
    youtube: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#FF0000"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8ZM9.7 15.5V8.5l6.3 3.5-6.3 3.5Z"/></svg>`,
    netflix: `<svg viewBox="0 0 111 190" width="18" height="22" fill="#E50914"><path d="M0 0h30l36 100V0h30v190l-30-1-36-99v100H0z"/></svg>`,
    spotify: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
    disney: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M11.26 6.89c-.49.04-1.4.24-2.05.74-.47.37-.75.89-.75 1.43 0 .93.71 1.56 1.86 1.56.8 0 1.56-.29 2.15-.82.1.25.17.52.17.82 0 1.1-.9 2-2 2s-2-.9-2-2c0-.3.07-.59.18-.85-.65.52-1.05 1.3-1.05 2.17 0 1.55 1.26 2.81 2.81 2.81 1.55 0 2.81-1.26 2.81-2.81 0-.74-.28-1.41-.74-1.91.36-.44.58-1.01.58-1.63 0-1.13-.72-2.06-1.97-1.51zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`,
  };

  const brandBg = {
    youtube: "rgba(255,0,0,0.12)",
    netflix: "rgba(229,9,20,0.12)",
    spotify: "rgba(29,185,84,0.12)",
    disney: "rgba(17,60,207,0.15)",
  };
  const brandLabel = {
    youtube: "YouTube Premium",
    netflix: "Netflix",
    spotify: "Spotify Premium",
    disney: "Disney+ Hotstar",
  };

  let activeFilter = "all";

  // ---- Filter tabs ----
  const filterWrap = document.getElementById('apkFilterWrap');
  const apkGrid = document.getElementById('apkGrid');

  if(filterWrap){
    filterWrap.querySelectorAll('.apk-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        filterWrap.querySelectorAll('.apk-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGrid();
      });
    });
  }

  function renderGrid(){
    const filtered = activeFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter(p => p.brand === activeFilter);

    apkGrid.innerHTML = filtered.map(p => `
      <div class="apk-card glass" data-brand="${p.brand}">
        ${p.tag ? `<span class="apk-badge apk-badge-${p.brand}">${p.tag}</span>` : ''}
        <div class="apk-card-head">
          <div class="apk-brand-logo" style="background:${brandBg[p.brand]};">
            ${brandLogo[p.brand]}
          </div>
          <div>
            <div class="apk-card-name">${brandLabel[p.brand]}</div>
            <div class="apk-card-type">${p.type} · ${p.duration}</div>
          </div>
        </div>
        <p class="apk-card-desc muted">${p.desc}</p>
        <ul class="apk-features apk-features-${p.brand}">
          ${p.features.map(f => `<li><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>${f}</li>`).join('')}
        </ul>
        <div class="apk-card-footer">
          <div class="apk-price-wrap">
            ${p.old ? `<span class="apk-old-price">Rp ${p.old.toLocaleString("id-ID")}</span>` : ''}
            <span class="apk-price apk-price-${p.brand}">Rp ${p.price.toLocaleString("id-ID")}</span>
            <span class="apk-per">/${p.duration.toLowerCase()}</span>
          </div>
          <button class="btn btn-primary apk-buy-btn" data-id="${p.id}" type="button">Beli Sekarang</button>
        </div>
      </div>
    `).join('');

    // Bind tombol beli
    apkGrid.querySelectorAll('.apk-buy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = PRODUCTS.find(p => p.id === btn.dataset.id);
        if(!product) return;
        // Redirect ke WhatsApp untuk order (sampai backend siap)
        const msg = encodeURIComponent(
          `Halo FrostyUp! Saya ingin membeli:\n` +
          `Produk: ${brandLabel[product.brand]} ${product.type} ${product.duration}\n` +
          `Harga: ${rupiah(product.price)}\n\n` +
          `Mohon informasi selanjutnya 🙏`
        );
        window.open(`https://wa.me/62xxxxxxxxxx?text=${msg}`, '_blank');
      });
    });
  }

  renderGrid();

})();
