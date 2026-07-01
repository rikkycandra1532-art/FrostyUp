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

  const brandColor = {
    youtube: "#FF0000",
    netflix: "#E50914",
    spotify: "#1DB954",
    disney: "#113CCF",
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
        ${p.tag ? `<span class="apk-badge" style="background:${brandColor[p.brand]}22;color:${brandColor[p.brand]};border-color:${brandColor[p.brand]}44;">${p.tag}</span>` : ''}
        <div class="apk-card-head">
          <div class="apk-brand-dot" style="background:${brandColor[p.brand]};"></div>
          <div>
            <div class="apk-card-name">${brandLabel[p.brand]}</div>
            <div class="apk-card-type">${p.type} · ${p.duration}</div>
          </div>
        </div>
        <p class="apk-card-desc muted">${p.desc}</p>
        <ul class="apk-features">
          ${p.features.map(f => `<li><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${brandColor[p.brand]}" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>${f}</li>`).join('')}
        </ul>
        <div class="apk-card-footer">
          <div class="apk-price-wrap">
            ${p.old ? `<span class="apk-old-price">${rupiah(p.old)}</span>` : ''}
            <span class="apk-price">${rupiah(p.price)}</span>
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
