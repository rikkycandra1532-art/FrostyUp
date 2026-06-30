/* ============================================================
   games-data.js — SINGLE SOURCE OF TRUTH for all game data.

   Both index.html (homepage game grid) and topup.html (detail
   top-up page) read from this one file. Edit a game here ONCE
   and it updates everywhere automatically — no need to touch
   script.js or topup.js directly for game/price/logo changes.

   HOW TO USE THIS FILE
   ---------------------------------------------------------------
   1) logoUrl: paste a direct image link (must end in .png/.jpg/
      .webp etc, or be a direct CDN/image URL) OR leave it as ""
      to keep showing the emoji fallback. If the link is broken,
      it auto-falls-back to the emoji too.

   2) nominals: two supported formats —
      a) Auto bonus format (recommended for diamond/currency games):
         { base:156, bonus:16, price:42000, old:46000, tag:null }
         -> displays as "172 Diamonds (156+16)" automatically.
         Set bonus:0 if there's no bonus for that item.
      b) Manual label format (for non-currency products like
         Steam Wallet vouchers where "bonus" doesn't make sense):
         { label:"Rp 45.000", price:47000, old:null, tag:null }

   3) tag: small badge text like "Promo" / "Best Value" / "Populer",
      or null for no badge.
============================================================ */

const GAMES = {
  mlbb: {
    name: "Mobile Legends", cat: "MOBA", emoji: "⚔️", trending: true,
    sold: "128rb+ terjual",
    logoUrl: "https://i.postimg.cc/qqxCYj8z/mlbb-logo-256.png",
    fields: [
      { id:"userid", label:"User ID", placeholder:"Contoh: 123456789", type:"text", width:"half" },
      { id:"zoneid", label:"Zone ID", placeholder:"Contoh: 2201", type:"text", width:"half" }
    ],
    hint: "Lihat User ID dan Zone ID di bawah nama profil dalam game.",
    unit: "Diamonds",
    nominals: [
      { base:86, bonus:0, price:21000, old:null, tag:null },
      { base:156, bonus:16, price:42000, old:46000, tag:null },
      { base:257, bonus:0, price:63000, old:null, tag:null },
      { base:312, bonus:31, price:84000, old:91000, tag:"Populer" },
      { base:518, bonus:51, price:79000, old:102000, tag:"Promo" },
      { base:706, bonus:0, price:168000, old:null, tag:null },
      { base:1283, bonus:129, price:336000, old:355000, tag:"Best Value" },
      { base:2195, bonus:0, price:504000, old:null, tag:null }
    ]
  },
  ff: {
    name: "Free Fire", cat: "Battle Royale", emoji: "🔥", trending: true,
    sold: "94rb+ terjual",
    logoUrl: "",
    fields: [
      { id:"userid", label:"Player ID", placeholder:"Contoh: 987654321", type:"text", width:"full" }
    ],
    hint: "Player ID dapat dilihat di pojok kiri atas dalam game.",
    unit: "Diamonds",
    nominals: [
      { base:70, bonus:0, price:11000, old:null, tag:null },
      { base:140, bonus:0, price:22000, old:null, tag:null },
      { base:310, bonus:31, price:54000, old:58000, tag:null },
      { base:626, bonus:63, price:89000, old:118000, tag:"Promo" },
      { base:1262, bonus:126, price:209000, old:null, tag:"Best Value" },
      { base:1897, bonus:189, price:309000, old:329000, tag:null }
    ]
  },
  pubgm: {
    name: "PUBG Mobile", cat: "Battle Royale", emoji: "🎯", trending: true,
    sold: "76rb+ terjual",
    logoUrl: "",
    fields: [
      { id:"userid", label:"Character ID", placeholder:"Contoh: 5123456789", type:"text", width:"full" }
    ],
    hint: "Character ID dapat dilihat di halaman profil dalam game.",
    unit: "UC",
    nominals: [
      { base:60, bonus:0, price:15000, old:null, tag:null },
      { base:325, bonus:0, price:79000, old:null, tag:null },
      { base:600, bonus:60, price:176000, old:215000, tag:"Promo" },
      { base:1800, bonus:0, price:429000, old:null, tag:"Best Value" },
      { base:3500, bonus:350, price:859000, old:899000, tag:null }
    ]
  },
  hok: {
    name: "Honor of Kings", cat: "MOBA", emoji: "👑", trending: false,
    sold: "21rb+ terjual",
    logoUrl: "",
    fields: [
      { id:"userid", label:"User ID", placeholder:"Contoh: 4412345678", type:"text", width:"half" },
      { id:"server", label:"Server", placeholder:"Pilih server", type:"select", width:"half",
        options:["Asia","Indonesia","Global"] }
    ],
    hint: "User ID dapat dilihat di halaman profil dalam game.",
    unit: "Tokens",
    nominals: [
      { base:60, bonus:0, price:16000, old:null, tag:null },
      { base:300, bonus:0, price:79000, old:null, tag:null },
      { base:890, bonus:90, price:249000, old:269000, tag:"Promo" },
      { base:1800, bonus:180, price:489000, old:null, tag:"Best Value" }
    ]
  },
  genshin: {
    name: "Genshin Impact", cat: "RPG", emoji: "⚡", trending: true,
    sold: "63rb+ terjual",
    logoUrl: "",
    fields: [
      { id:"uid", label:"UID", placeholder:"Contoh: 800123456", type:"text", width:"half" },
      { id:"server", label:"Server", placeholder:"Pilih server", type:"select", width:"half",
        options:["Asia","America","Europe","TW/HK/MO"] }
    ],
    hint: "UID dapat dilihat di pojok kiri bawah dalam game.",
    unit: "Genesis Crystals",
    nominals: [
      { base:60, bonus:0, price:16000, old:null, tag:null },
      { base:300, bonus:30, price:79000, old:null, tag:null },
      { base:980, bonus:110, price:249000, old:269000, tag:"Promo" },
      { base:1980, bonus:260, price:479000, old:null, tag:"Best Value" },
      { base:3280, bonus:600, price:779000, old:799000, tag:null }
    ]
  },
  valorant: {
    name: "Valorant", cat: "FPS", emoji: "🎮", trending: false,
    sold: "18rb+ terjual",
    logoUrl: "",
    fields: [
      { id:"riotid", label:"Riot ID", placeholder:"Contoh: Player#1234", type:"text", width:"full" }
    ],
    hint: "Riot ID format: NamaPengguna#TagLine.",
    unit: "VP",
    nominals: [
      { base:125, bonus:0, price:19000, old:null, tag:null },
      { base:420, bonus:0, price:69000, old:null, tag:null },
      { base:950, bonus:125, price:169000, old:199000, tag:"Promo" },
      { base:2050, bonus:350, price:359000, old:null, tag:"Best Value" }
    ]
  },
  roblox: {
    name: "Roblox", cat: "Sandbox", emoji: "🧱", trending: false,
    sold: "41rb+ terjual",
    logoUrl: "",
    fields: [
      { id:"username", label:"Username", placeholder:"Contoh: frostygamer", type:"text", width:"full" }
    ],
    hint: "Pastikan username sesuai akun Roblox yang aktif.",
    unit: "Robux",
    nominals: [
      { base:80, bonus:0, price:19000, old:null, tag:null },
      { base:400, bonus:0, price:89000, old:null, tag:null },
      { base:700, bonus:100, price:169000, old:189000, tag:"Promo" },
      { base:1450, bonus:250, price:339000, old:null, tag:"Best Value" }
    ]
  },
  codm: {
    name: "Call of Duty Mobile", cat: "FPS", emoji: "🪖", trending: false,
    sold: "15rb+ terjual",
    logoUrl: "",
    fields: [
      { id:"uid", label:"UID Open ID", placeholder:"Contoh: 7712345678", type:"text", width:"full" }
    ],
    hint: "UID Open ID dapat dilihat di pengaturan akun dalam game.",
    unit: "CP",
    nominals: [
      { base:80, bonus:0, price:19000, old:null, tag:null },
      { base:420, bonus:0, price:89000, old:null, tag:null },
      { base:760, bonus:120, price:179000, old:199000, tag:"Promo" },
      { base:2050, bonus:350, price:459000, old:null, tag:"Best Value" }
    ]
  },
  hsr: {
    name: "Honkai: Star Rail", cat: "RPG", emoji: "🚀", trending: true,
    sold: "12rb+ terjual",
    logoUrl: "",
    fields: [
      { id:"uid", label:"UID", placeholder:"Contoh: 600123456", type:"text", width:"half" },
      { id:"server", label:"Server", placeholder:"Pilih server", type:"select", width:"half",
        options:["Asia","America","Europe","TW/HK/MO"] }
    ],
    hint: "UID dapat dilihat di pojok kiri bawah dalam game.",
    unit: "Oneiric Shards",
    nominals: [
      { base:60, bonus:0, price:16000, old:null, tag:null },
      { base:300, bonus:30, price:79000, old:null, tag:null },
      { base:980, bonus:110, price:249000, old:269000, tag:"Promo" },
      { base:1980, bonus:260, price:479000, old:null, tag:"Best Value" }
    ]
  },
  deltaforce: {
    name: "Delta Force", cat: "FPS", emoji: "💣", trending: false,
    sold: "4rb+ terjual",
    logoUrl: "",
    fields: [
      { id:"uid", label:"Player ID", placeholder:"Contoh: 991234567", type:"text", width:"full" }
    ],
    hint: "Player ID dapat dilihat di halaman profil dalam game.",
    unit: "DF Points",
    nominals: [
      { base:60, bonus:0, price:16000, old:null, tag:null },
      { base:270, bonus:30, price:79000, old:89000, tag:"Promo" },
      { base:890, bonus:90, price:249000, old:null, tag:"Best Value" }
    ]
  },
  steam: {
    name: "Steam Wallet", cat: "Voucher", emoji: "💳", trending: false,
    sold: "9rb+ terjual",
    logoUrl: "",
    fields: [
      { id:"email", label:"Email Akun Steam", placeholder:"Contoh: nama@email.com", type:"text", width:"full" }
    ],
    hint: "Kode voucher akan dikirim ke email yang didaftarkan.",
    nominals: [
      { label:"Rp 12.000", price:13000, old:null, tag:null },
      { label:"Rp 45.000", price:47000, old:null, tag:null },
      { label:"Rp 60.000", price:62000, old:65000, tag:"Promo" },
      { label:"Rp 120.000", price:122000, old:null, tag:"Best Value" },
      { label:"Rp 250.000", price:252000, old:259000, tag:null }
    ]
  }
};

const GAME_ORDER = ["mlbb","ff","pubgm","hok","genshin","valorant","roblox","codm","hsr","deltaforce","steam"];

/* ----------------------------------------------------------
   Shared helpers used by both script.js and topup.js
---------------------------------------------------------- */

// Renders a game's icon: image from logoUrl if set, otherwise emoji fallback.
// If the image link is broken, it auto-falls-back to the emoji.
function getGameIcon(g, sizeClass){
  if(g.logoUrl && g.logoUrl.trim()){
    return `<img src="${g.logoUrl}" alt="${g.name}" class="game-icon-img ${sizeClass||''}" loading="lazy" onerror="this.outerHTML='<span class=&quot;game-icon-emoji ${sizeClass||''}&quot;>${g.emoji}</span>'">`;
  }
  return `<span class="game-icon-emoji ${sizeClass||''}">${g.emoji}</span>`;
}

// Builds the display label + bonus breakdown for a nominal item.
function getNominalParts(n, game){
  if(n.label){
    return { main: n.label, breakdown: null };
  }
  const total = n.base + (n.bonus || 0);
  const unit = game.unit || '';
  const main = `${total.toLocaleString('id-ID')} ${unit}`;
  const breakdown = n.bonus > 0 ? `(${n.base.toLocaleString('id-ID')}+${n.bonus.toLocaleString('id-ID')})` : null;
  return { main, breakdown };
}
