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
    categories: [
      { key:"weekly", label:"Weekly Diamond Pass", icon:"https://i.postimg.cc/PJ045hLp/2e15f8f5-48a9-4e7f-8547-9db7f68924a5.webp", items: [
        { label:"Weekly Diamond Pass", price:28000, old:null, tag:null },
        { label:"2x Weekly Diamond Pass", price:57558, old:null, tag:null },
        { label:"3x Weekly Diamond Pass", price:86337, old:null, tag:null },
        { label:"4x Weekly Diamond Pass", price:115116, old:null, tag:null },
        { label:"5x Weekly Diamond Pass", price:143895, old:null, tag:null },
      ]},
      { key:"misi", label:"Misi Top Up", icon:"https://i.postimg.cc/PJ045hLp/2e15f8f5-48a9-4e7f-8547-9db7f68924a5.webp", items: [
        { base:51, bonus:5, price:15383, old:null, tag:null },
        { base:100, bonus:10, price:30285, old:null, tag:null },
        { base:250, bonus:27, price:75712, old:null, tag:null },
        { base:503, bonus:65, price:148783, old:null, tag:null },
        { base:1006, bonus:130, price:297565, old:null, tag:null },
      ]},
      { key:"first", label:"Bonus TopUp Pertama", icon:"https://i.postimg.cc/PJ045hLp/2e15f8f5-48a9-4e7f-8547-9db7f68924a5.webp", items: [
        { base:50, bonus:50, price:14500, old:null, tag:null },
        { base:150, bonus:150, price:42300, old:null, tag:null },
        { base:250, bonus:250, price:70100, old:null, tag:null },
        { base:500, bonus:500, price:141100, old:null, tag:null },
      ]},
      { key:"special", label:"Special Items", icon:"https://i.postimg.cc/PJ045hLp/2e15f8f5-48a9-4e7f-8547-9db7f68924a5.webp", items: [
        { label:"Weekly Elite Pack", price:14290, old:null, tag:null },
        { label:"Monthly Epic Pack", price:70405, old:null, tag:null },
        { label:"Twilight Pass", price:141700, old:null, tag:null },
      ]},
      { key:"diamond", label:"Top Up Diamond", icon:"https://i.postimg.cc/C59NxYZq/a93aec53-89b0-410a-a99b-b991069e49a3.webp", items: [
        { base:5, bonus:0, price:1489, old:null, tag:null },
        { base:10, bonus:1, price:2826, old:null, tag:null },
        { base:9, bonus:1, price:3030, old:null, tag:null },
        { base:11, bonus:1, price:3474, old:null, tag:null },
        { base:13, bonus:1, price:4039, old:null, tag:null },
        { base:15, bonus:0, price:4465, old:null, tag:null },
        { base:16, bonus:1, price:4654, old:null, tag:null },
        { base:17, bonus:1, price:5049, old:null, tag:null },
        { base:17, bonus:2, price:5459, old:null, tag:null },
        { base:20, bonus:2, price:5654, old:null, tag:null },
        { base:18, bonus:2, price:6060, old:null, tag:null },
        { base:25, bonus:3, price:7941, old:null, tag:null },
        { base:28, bonus:2, price:8522, old:null, tag:null },
        { base:30, bonus:3, price:9310, old:null, tag:null },
        { base:33, bonus:3, price:10096, old:null, tag:null },
        { base:31, bonus:3, price:10098, old:null, tag:null },
        { base:40, bonus:4, price:11910, old:null, tag:null },
        { base:38, bonus:4, price:11979, old:null, tag:null },
        { base:32, bonus:3, price:12874, old:null, tag:null },
        { base:42, bonus:3, price:13040, old:null, tag:null },
        { base:42, bonus:4, price:13125, old:null, tag:null },
        { base:45, bonus:5, price:13964, old:null, tag:null },
        { base:51, bonus:5, price:14133, old:null, tag:null },
        { base:49, bonus:5, price:14939, old:null, tag:null },
        { base:53, bonus:6, price:15880, old:null, tag:null },
        { base:55, bonus:5, price:17164, old:null, tag:null },
        { base:58, bonus:6, price:17368, old:null, tag:null },
        { base:62, bonus:5, price:18446, old:null, tag:null },
        { base:59, bonus:6, price:18584, old:null, tag:null },
        { base:61, bonus:5, price:18616, old:null, tag:null },
        { base:64, bonus:7, price:19354, old:null, tag:null },
        { base:64, bonus:6, price:20072, old:null, tag:null },
        { base:67, bonus:7, price:20190, old:null, tag:null },
        { base:70, bonus:8, price:21339, old:null, tag:null },
        { base:78, bonus:8, price:21525, old:null, tag:null },
        { base:68, bonus:7, price:21614, old:null, tag:null },
        { base:73, bonus:7, price:22005, old:null, tag:null },
        { base:77, bonus:8, price:22827, old:null, tag:null },
        { base:76, bonus:8, price:23220, old:null, tag:null },
        { base:75, bonus:8, price:23270, old:null, tag:null },
        { base:80, bonus:8, price:24228, old:null, tag:null },
        { base:81, bonus:8, price:24402, old:null, tag:null },
        { base:84, bonus:8, price:25238, old:null, tag:null },
        { base:89, bonus:9, price:27137, old:null, tag:null },
        { base:91, bonus:9, price:27345, old:null, tag:null },
        { base:102, bonus:10, price:28265, old:null, tag:null },
        { base:102, bonus:11, price:30768, old:null, tag:null },
        { base:101, bonus:11, price:31160, old:null, tag:null },
        { base:105, bonus:11, price:32169, old:null, tag:null },
        { base:117, bonus:12, price:34736, old:null, tag:null },
        { base:116, bonus:12, price:35129, old:null, tag:null },
        { base:134, bonus:14, price:40380, old:null, tag:null },
        { base:156, bonus:16, price:42905, old:null, tag:"Populer" },
        { base:127, bonus:13, price:43659, old:null, tag:null },
        { base:154, bonus:16, price:45653, old:null, tag:null },
        { base:160, bonus:16, price:48457, old:null, tag:null },
        { base:167, bonus:17, price:51711, old:null, tag:null },
        { base:203, bonus:20, price:56529, old:null, tag:null },
        { base:200, bonus:22, price:60569, old:null, tag:null },
        { base:234, bonus:23, price:64210, old:null, tag:null },
        { base:217, bonus:23, price:64473, old:null, tag:null },
        { base:218, bonus:23, price:66096, old:null, tag:null },
        { base:257, bonus:27, price:76382, old:null, tag:null },
        { base:256, bonus:40, price:79351, old:null, tag:null },
        { base:276, bonus:29, price:83789, old:null, tag:null },
        { base:303, bonus:33, price:84792, old:null, tag:null },
        { base:312, bonus:32, price:85809, old:null, tag:null },
        { base:254, bonus:30, price:87552, old:null, tag:null },
        { base:333, bonus:37, price:100948, old:null, tag:null },
        { base:333, bonus:33, price:103422, old:null, tag:null },
        { base:346, bonus:38, price:104986, old:null, tag:null },
        { base:390, bonus:39, price:107114, old:null, tag:null },
        { base:367, bonus:41, price:109108, old:null, tag:null },
        { base:317, bonus:38, price:109475, old:null, tag:null },
        { base:366, bonus:40, price:111043, old:null, tag:null },
        { base:468, bonus:46, price:128420, old:null, tag:null },
        { base:383, bonus:46, price:131351, old:null, tag:null },
        { base:504, bonus:66, price:141319, old:null, tag:null },
        { base:467, bonus:51, price:141327, old:null, tag:null },
        { base:546, bonus:54, price:149945, old:null, tag:null },
        { base:500, bonus:54, price:151424, old:null, tag:null },
        { base:625, bonus:81, price:171139, old:null, tag:null },
        { base:637, bonus:79, price:189162, old:null, tag:null },
        { base:668, bonus:82, price:197909, old:null, tag:null },
        { base:671, bonus:78, price:206844, old:null, tag:null },
        { base:703, bonus:87, price:209351, old:null, tag:null },
        { base:781, bonus:97, price:214043, old:null, tag:"Best Value" },
        { base:633, bonus:83, price:218949, old:null, tag:null },
        { base:774, bonus:101, price:228133, old:null, tag:null },
        { base:779, bonus:95, price:232570, old:null, tag:null },
        { base:859, bonus:104, price:235348, old:null, tag:null },
        { base:836, bonus:130, price:252369, old:null, tag:null },
        { base:937, bonus:113, price:256947, old:null, tag:null },
        { base:936, bonus:112, price:280015, old:null, tag:null },
        { base:1007, bonus:156, price:282637, old:null, tag:null },
        { base:953, bonus:114, price:285063, old:null, tag:null },
        { base:1093, bonus:127, price:299558, old:null, tag:null },
        { base:940, bonus:144, price:327435, old:null, tag:null },
        { base:1250, bonus:162, price:342277, old:null, tag:null },
        { base:1206, bonus:152, price:358134, old:null, tag:null },
        { base:1339, bonus:167, price:398513, old:null, tag:null },
        { base:1484, bonus:185, price:406487, old:null, tag:null },
        { base:1252, bonus:194, price:436627, old:null, tag:null },
        { base:1509, bonus:195, price:446348, old:null, tag:null },
        { base:1708, bonus:302, price:495941, old:null, tag:null },
        { base:1860, bonus:335, price:510747, old:null, tag:null },
        { base:1500, bonus:270, price:537351, old:null, tag:null },
        { base:2015, bonus:383, price:565273, old:null, tag:null },
        { base:2172, bonus:367, price:596555, old:null, tag:null },
        { base:2041, bonus:339, price:596889, old:null, tag:null },
        { base:2211, bonus:367, price:644724, old:null, tag:null },
        { base:2485, bonus:416, price:681885, old:null, tag:null },
        { base:2461, bonus:394, price:720436, old:null, tag:null },
        { base:2714, bonus:432, price:793506, old:null, tag:null },
        { base:3099, bonus:589, price:852071, old:null, tag:null },
        { base:2964, bonus:459, price:869218, old:null, tag:null },
        { base:2500, bonus:475, price:875746, old:null, tag:null },
        { base:2501, bonus:475, price:875746, old:null, tag:null },
        { base:3247, bonus:491, price:955022, old:null, tag:null },
        { base:3416, bonus:604, price:991882, old:null, tag:null },
        { base:3724, bonus:670, price:1023210, old:null, tag:null },
        { base:3383, bonus:643, price:1034216, old:null, tag:null },
        { base:4003, bonus:827, price:1190256, old:null, tag:null },
        { base:4027, bonus:829, price:1197767, old:null, tag:null },
        { base:4252, bonus:706, price:1241612, old:null, tag:null },
        { base:4203, bonus:849, price:1250824, old:null, tag:null },
        { base:4649, bonus:883, price:1287060, old:null, tag:null },
        { base:4506, bonus:892, price:1339038, old:null, tag:null },
        { base:5035, bonus:1007, price:1413185, old:null, tag:null },
        { base:5274, bonus:964, price:1458198, old:null, tag:null },
        { base:5009, bonus:957, price:1487820, old:null, tag:null },
        { base:5124, bonus:906, price:1487822, old:null, tag:null },
        { base:5711, bonus:1129, price:1686196, old:null, tag:null },
        { base:6044, bonus:1166, price:1787144, old:null, tag:null },
        { base:5000, bonus:1000, price:1792940, old:null, tag:null },
        { base:6509, bonus:1218, price:1797806, old:null, tag:null },
        { base:6464, bonus:1221, price:1910691, old:null, tag:null },
        { base:6832, bonus:1208, price:1983763, old:null, tag:null },
        { base:7740, bonus:1548, price:2137267, old:null, tag:null },
        { base:7419, bonus:1431, price:2182137, old:null, tag:null },
        { base:6252, bonus:1250, price:2185247, old:null, tag:null },
        { base:8006, bonus:1654, price:2380511, old:null, tag:null },
        { base:8540, bonus:1510, price:2479704, old:null, tag:null },
        { base:10839, bonus:2137, price:2989338, old:null, tag:null },
        { base:12389, bonus:2431, price:3424326, old:null, tag:null },
        { base:12009, bonus:2481, price:3570766, old:null, tag:null },
        { base:13664, bonus:2416, price:3967526, old:null, tag:null },
        { base:15480, bonus:3096, price:4274534, old:null, tag:null },
        { base:17080, bonus:3020, price:4959407, old:null, tag:null },
        { base:23220, bonus:4644, price:6475918, old:null, tag:null },
      ]}
    ]
  },
  ff: {
    name: "Free Fire", cat: "Battle Royale", emoji: "🔥", trending: true,
    sold: "94rb+ terjual",
    logoUrl: "https://i.postimg.cc/PqCxzkTV/ff.png",
    fields: [
      { id:"userid", label:"Player ID", placeholder:"Contoh: 987654321", type:"text", width:"full" }
    ],
    hint: "Player ID dapat dilihat di pojok kiri atas dalam game.",
    unit: "Diamonds",
    categories: [
      { key:"membership", label:"Membership", icon:"https://i.postimg.cc/1Rb2tZ1b/6b93b7e9-3ef4-4d16-9fb7-4f878d1390ba.webp", items: [
        { label:"BP Card", price:43807, old:null, tag:null }
      ]},
      { key:"diamond", label:"Diamonds", icon:"https://i.postimg.cc/L4GwXMFb/1fdbc02c-9c9c-4134-90a1-6f36c062d91f.webp", items: [
        { label:"5 Diamonds", price:949, old:null, tag:null },
        { label:"12 Diamonds", price:1896, old:null, tag:null },
        { label:"10 Diamonds", price:1897, old:null, tag:null },
        { label:"15 Diamonds", price:2846, old:null, tag:null },
        { label:"20 Diamonds", price:3794, old:null, tag:null },
        { label:"25 Diamonds", price:4743, old:null, tag:null },
        { label:"30 Diamonds", price:5691, old:null, tag:null },
        { label:"50 Diamonds", price:7583, old:null, tag:null },
        { label:"40 Diamonds", price:7588, old:null, tag:null },
        { label:"55 Diamonds", price:8532, old:null, tag:null },
        { label:"70 Diamonds", price:9479, old:null, tag:null },
        { label:"60 Diamonds", price:9480, old:null, tag:null },
        { label:"75 Diamonds", price:10428, old:null, tag:null },
        { label:"80 Diamonds", price:11376, old:null, tag:null },
        { label:"90 Diamonds", price:13273, old:null, tag:null },
        { label:"95 Diamonds", price:14221, old:null, tag:null },
        { label:"100 Diamonds", price:15170, old:null, tag:null },
        { label:"120 Diamonds", price:17062, old:null, tag:null },
        { label:"125 Diamonds", price:18010, old:null, tag:null },
        { label:"140 Diamonds", price:18957, old:null, tag:null },
        { label:"130 Diamonds", price:18959, old:null, tag:null },
        { label:"145 Diamonds", price:19905, old:null, tag:null },
        { label:"150 Diamonds", price:20854, old:null, tag:null },
        { label:"160 Diamonds", price:22750, old:null, tag:null },
        { label:"170 Diamonds", price:24647, old:null, tag:null },
        { label:"190 Diamonds", price:26540, old:null, tag:null },
        { label:"180 Diamonds", price:26544, old:null, tag:null },
        { label:"210 Diamonds", price:28435, old:null, tag:null },
        { label:"200 Diamonds", price:28436, old:null, tag:null },
        { label:"230 Diamonds", price:32229, old:null, tag:null },
        { label:"260 Diamonds", price:36018, old:null, tag:null },
        { label:"250 Diamonds", price:36023, old:null, tag:null },
        { label:"280 Diamonds", price:37913, old:null, tag:null },
        { label:"300 Diamonds", price:41707, old:null, tag:null },
        { label:"355 Diamonds", price:47390, old:null, tag:null },
        { label:"350 Diamonds", price:47391, old:null, tag:null },
        { label:"360 Diamonds", price:48339, old:null, tag:null },
        { label:"375 Diamonds", price:51184, old:null, tag:null },
        { label:"405 Diamonds", price:54973, old:null, tag:null },
        { label:"400 Diamonds", price:55926, old:null, tag:null },
        { label:"425 Diamonds", price:56869, old:null, tag:null },
        { label:"420 Diamonds", price:57818, old:null, tag:null },
        { label:"455 Diamonds", price:62560, old:null, tag:null },
        { label:"475 Diamonds", price:64451, old:null, tag:null },
        { label:"495 Diamonds", price:66346, old:null, tag:null },
        { label:"500 Diamonds", price:67295, old:null, tag:null },
        { label:"512 Diamonds", price:69191, old:null, tag:null },
        { label:"510 Diamonds", price:69192, old:null, tag:null },
        { label:"515 Diamonds", price:70140, old:null, tag:null },
        { label:"520 Diamonds", price:71089, old:null, tag:null },
        { label:"545 Diamonds", price:73929, old:null, tag:null },
        { label:"565 Diamonds", price:75825, old:null, tag:null },
        { label:"600 Diamonds", price:82464, old:null, tag:null },
        { label:"635 Diamonds", price:85302, old:null, tag:null },
        { label:"645 Diamonds", price:87199, old:null, tag:null },
        { label:"655 Diamonds", price:89096, old:null, tag:null },
        { label:"720 Diamonds", price:94780, old:null, tag:null },
        { label:"710 Diamonds", price:94780, old:null, tag:null },
        { label:"725 Diamonds", price:95728, old:null, tag:null },
        { label:"700 Diamonds", price:95730, old:null, tag:null },
        { label:"740 Diamonds", price:98574, old:null, tag:null },
        { label:"770 Diamonds", price:102362, old:null, tag:null },
        { label:"790 Diamonds", price:104258, old:null, tag:null },
        { label:"800 Diamonds", price:106155, old:null, tag:null },
        { label:"820 Diamonds", price:109949, old:null, tag:null },
        { label:"840 Diamonds", price:111841, old:null, tag:null },
        { label:"860 Diamonds", price:113736, old:null, tag:null },
        { label:"910 Diamonds", price:121319, old:null, tag:null },
        { label:"930 Diamonds", price:123214, old:null, tag:null },
        { label:"925 Diamonds", price:124164, old:null, tag:null },
        { label:"1000 Diamonds", price:132692, old:null, tag:null },
        { label:"1050 Diamonds", price:140275, old:null, tag:null },
        { label:"1075 Diamonds", price:142170, old:null, tag:null },
        { label:"1060 Diamonds", price:142172, old:null, tag:null },
        { label:"1080 Diamonds", price:143118, old:null, tag:null },
        { label:"1125 Diamonds", price:149752, old:null, tag:null },
        { label:"1145 Diamonds", price:151648, old:null, tag:null },
        { label:"1200 Diamonds", price:160179, old:null, tag:null },
        { label:"1215 Diamonds", price:161126, old:null, tag:null },
        { label:"1300 Diamonds", price:173450, old:null, tag:null },
        { label:"1450 Diamonds", price:189558, old:null, tag:null },
        { label:"1440 Diamonds", price:189559, old:null, tag:null },
        { label:"1490 Diamonds", price:197146, old:null, tag:null },
        { label:"1510 Diamonds", price:199038, old:null, tag:null },
        { label:"1580 Diamonds", price:208516, old:null, tag:null },
        { label:"1795 Diamonds", price:237898, old:null, tag:null },
        { label:"1800 Diamonds", price:238847, old:null, tag:null },
        { label:"1875 Diamonds", price:246426, old:null, tag:null },
        { label:"1975 Diamonds", price:261595, old:null, tag:null },
        { label:"2000 Diamonds", price:264435, old:null, tag:null },
        { label:"2005 Diamonds", price:265384, old:null, tag:null },
        { label:"2020 Diamonds", price:268229, old:null, tag:null },
        { label:"2100 Diamonds", price:277705, old:null, tag:null },
        { label:"2140 Diamonds", price:283391, old:null, tag:null },
        { label:"2180 Diamonds", price:284338, old:null, tag:null },
        { label:"2160 Diamonds", price:284338, old:null, tag:null },
        { label:"2190 Diamonds", price:286234, old:null, tag:null },
        { label:"2200 Diamonds", price:288131, old:null, tag:null },
        { label:"2210 Diamonds", price:290028, old:null, tag:null },
        { label:"2225 Diamonds", price:292874, old:null, tag:null },
        { label:"2280 Diamonds", price:299507, old:null, tag:null },
        { label:"2350 Diamonds", price:308984, old:null, tag:null },
        { label:"2355 Diamonds", price:309933, old:null, tag:null },
        { label:"2400 Diamonds", price:314669, old:null, tag:null },
        { label:"2575 Diamonds", price:339315, old:null, tag:null },
        { label:"2720 Diamonds", price:359220, old:null, tag:null },
        { label:"2750 Diamonds", price:361110, old:null, tag:null },
        { label:"3000 Diamonds", price:394286, old:null, tag:null },
        { label:"3310 Diamonds", price:435038, old:null, tag:null },
        { label:"3640 Diamonds", price:473895, old:null, tag:null },
        { label:"3620 Diamonds", price:473896, old:null, tag:null },
        { label:"3675 Diamonds", price:480535, old:null, tag:null },
        { label:"3800 Diamonds", price:496645, old:null, tag:null },
        { label:"4050 Diamonds", price:529816, old:null, tag:null },
        { label:"4340 Diamonds", price:569625, old:null, tag:null },
        { label:"4450 Diamonds", price:581947, old:null, tag:null },
        { label:"4720 Diamonds", price:617013, old:null, tag:null },
        { label:"4800 Diamonds", price:630286, old:null, tag:null },
        { label:"4850 Diamonds", price:637869, old:null, tag:null },
        { label:"5500 Diamonds", price:719374, old:null, tag:null },
        { label:"5600 Diamonds", price:732644, old:null, tag:null },
        { label:"6000 Diamonds", price:784771, old:null, tag:null },
        { label:"6480 Diamonds", price:848279, old:null, tag:null },
        { label:"6550 Diamonds", price:854909, old:null, tag:null },
        { label:"6900 Diamonds", price:901350, old:null, tag:null },
        { label:"7290 Diamonds", price:947789, old:null, tag:null },
        { label:"7295 Diamonds", price:948737, old:null, tag:null },
        { label:"7310 Diamonds", price:951583, old:null, tag:null },
        { label:"7340 Diamonds", price:955372, old:null, tag:null },
        { label:"7360 Diamonds", price:957267, old:null, tag:null },
        { label:"7430 Diamonds", price:966745, old:null, tag:null },
        { label:"7645 Diamonds", price:995179, old:null, tag:null },
        { label:"7650 Diamonds", price:996127, old:null, tag:null },
        { label:"8010 Diamonds", price:1042568, old:null, tag:null },
        { label:"8730 Diamonds", price:1137348, old:null, tag:null },
        { label:"9290 Diamonds", price:1214121, old:null, tag:null },
        { label:"9800 Diamonds", price:1277621, old:null, tag:null },
        { label:"14580 Diamonds", price:1895577, old:null, tag:null },
        { label:"36500 Diamonds", price:4738942, old:null, tag:null },
        { label:"37050 Diamonds", price:4813819, old:null, tag:null },
        { label:"73100 Diamonds", price:9477884, old:null, tag:null }
      ]}
    ]
  },
  pubgm: {
    name: "PUBG Mobile", cat: "Battle Royale", emoji: "🎯", trending: true,
    sold: "76rb+ terjual",
    logoUrl: "https://i.postimg.cc/rp7pfYwY/pubgm.png",
    fields: [
      { id:"userid", label:"Character ID", placeholder:"Contoh: 5123456789", type:"text", width:"full" }
    ],
    hint: "Character ID dapat dilihat di halaman profil dalam game.",
    unit: "UC",
    nominalIcon: "https://i.postimg.cc/Vs2p6cP3/2cd035db-9530-4169-8eaf-7e471d1856c0.webp",
    nominals: [
      { base:60, bonus:0, price:17165, old:null, tag:null },
      { base:300, bonus:25, price:84854, old:null, tag:null },
      { base:600, bonus:60, price:169407, old:null, tag:null },
      { base:1500, bonus:300, price:423654, old:null, tag:null },
      { base:3000, bonus:850, price:847307, old:null, tag:null },
    ]
  },
  hok: {
    name: "Honor of Kings", cat: "MOBA", emoji: "👑", trending: false,
    sold: "21rb+ terjual",
    logoUrl: "https://i.postimg.cc/k4wKj7WG/hok.png",
    fields: [
      { id:"userid", label:"User ID", placeholder:"Contoh: 4412345678", type:"text", width:"half" },
      { id:"server", label:"Server", placeholder:"Pilih server", type:"select", width:"half",
        options:["Asia","Indonesia","Global"] }
    ],
    hint: "User ID dapat dilihat di halaman profil dalam game.",
    unit: "Tokens",
    nominalIcon: "https://i.postimg.cc/HWFRxCCG/8bada0e8-0ce4-452b-b706-ae65a189f6de.webp",
    nominals: [
      { label:"80 Tokens", price:16094, old:null, tag:null },
      { label:"240 Tokens", price:48659, old:null, tag:null },
      { label:"400 Tokens", price:81033, old:null, tag:null },
      { label:"560 Tokens", price:113598, old:null, tag:null },
      { label:"830 Tokens", price:162255, old:null, tag:null },
      { label:"1245 Tokens", price:243476, old:null, tag:null },
      { label:"2508 Tokens", price:487141, old:null, tag:null },
      { label:"4180 Tokens", price:812026, old:null, tag:null },
      { label:"8360 Tokens", price:1624240, old:null, tag:null },
    ]
  },
  genshin: {
    name: "Genshin Impact", cat: "RPG", emoji: "⚡", trending: true,
    sold: "63rb+ terjual",
    logoUrl: "https://i.postimg.cc/zBpKdqTB/genshin.png",
    fields: [
      { id:"uid", label:"UID", placeholder:"Contoh: 800123456", type:"text", width:"half" },
      { id:"server", label:"Server", placeholder:"Pilih server", type:"select", width:"half",
        options:["Asia","America","Europe","TW/HK/MO"] }
    ],
    hint: "UID dapat dilihat di pojok kiri bawah dalam game.",
    unit: "Genesis Crystals",
    nominalIcon: "https://i.postimg.cc/bYn6LyJL/d32a9681-d682-4bc5-94bd-76ec32a5314e.webp",
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
    logoUrl: "https://i.postimg.cc/NMbmNQR2/valorant.png",
    fields: [
      { id:"riotid", label:"Riot ID", placeholder:"Contoh: Player#1234", type:"text", width:"full" }
    ],
    hint: "Riot ID format: NamaPengguna#TagLine.",
    unit: "VP",
    categories: [
      { key:"id", label:"Indonesia", icon:"https://i.postimg.cc/8kx95VVG/515b0ad1-fb09-43d4-b47f-f58960dd6b08.webp", items: [
        { label:"475 Points", price:53850, old:null, tag:null },
        { label:"950 Points", price:107699, old:null, tag:null },
        { label:"1000 Points", price:107699, old:null, tag:null },
        { label:"1475 Points", price:161548, old:null, tag:null },
        { label:"2050 Points", price:215396, old:null, tag:null },
        { label:"2000 Points", price:215397, old:null, tag:null },
        { label:"2525 Points", price:269245, old:null, tag:null },
        { label:"3050 Points", price:323094, old:null, tag:null },
        { label:"3650 Points", price:374057, old:null, tag:null },
        { label:"4125 Points", price:427906, old:null, tag:null },
        { label:"4100 Points", price:430791, old:null, tag:null },
        { label:"4650 Points", price:481756, old:null, tag:null },
        { label:"5350 Points", price:537527, old:null, tag:null },
        { label:"5700 Points", price:589453, old:null, tag:null },
        { label:"5825 Points", price:591376, old:null, tag:null },
        { label:"6350 Points", price:645225, old:null, tag:null },
        { label:"7300 Points", price:748114, old:null, tag:null },
        { label:"7400 Points", price:752922, old:null, tag:null },
        { label:"8400 Points", price:860620, old:null, tag:null },
        { label:"9000 Points", price:911583, old:null, tag:null },
        { label:"8990 Points", price:911583, old:null, tag:null },
        { label:"10000 Points", price:1019282, old:null, tag:null },
        { label:"11000 Points", price:1056782, old:null, tag:null },
        { label:"10700 Points", price:1075053, old:null, tag:null },
        { label:"11475 Points", price:1110631, old:null, tag:null },
        { label:"12000 Points", price:1164480, old:null, tag:null },
        { label:"13050 Points", price:1272177, old:null, tag:null },
        { label:"14650 Points", price:1430839, old:null, tag:null },
        { label:"16700 Points", price:1646234, old:null, tag:null },
        { label:"18400 Points", price:1809703, old:null, tag:null },
        { label:"20000 Points", price:1968365, old:null, tag:null },
        { label:"22000 Points", price:2113563, old:null, tag:null },
      ]},
      { key:"ph", label:"Philippines", icon:"https://i.postimg.cc/8kx95VVG/515b0ad1-fb09-43d4-b47f-f58960dd6b08.webp", items: [
        { label:"475 VP", price:56282, old:null, tag:null },
        { label:"1000 VP", price:112847, old:null, tag:null },
        { label:"2050 VP", price:225975, old:null, tag:null },
        { label:"3650 VP", price:395666, old:null, tag:null },
        { label:"5350 VP", price:565359, old:null, tag:null },
        { label:"11000 VP", price:1131000, old:null, tag:null },
      ]},
      { key:"sg", label:"Singapore", icon:"https://i.postimg.cc/8kx95VVG/515b0ad1-fb09-43d4-b47f-f58960dd6b08.webp", items: [
        { label:"475 VP", price:93045, old:null, tag:null },
        { label:"1000 VP", price:186380, old:null, tag:null },
        { label:"2050 VP", price:359716, old:null, tag:null },
        { label:"3650 VP", price:626385, old:null, tag:null },
        { label:"5350 VP", price:893055, old:null, tag:null },
        { label:"11000 VP", price:1799732, old:null, tag:null },
      ]},
      { key:"my", label:"Malaysia", icon:"https://i.postimg.cc/8kx95VVG/515b0ad1-fb09-43d4-b47f-f58960dd6b08.webp", items: [
        { label:"475 VP", price:77227, old:null, tag:null },
        { label:"1000 VP", price:158938, old:null, tag:null },
        { label:"2050 VP", price:310105, old:null, tag:null },
        { label:"3650 VP", price:541338, old:null, tag:null },
        { label:"5350 VP", price:772172, old:null, tag:null },
        { label:"11000 VP", price:1548030, old:null, tag:null },
      ]}
    ]
  },
  roblox: {
    name: "Roblox", cat: "Sandbox", emoji: "🧱", trending: false,
    sold: "41rb+ terjual",
    logoUrl: "https://i.postimg.cc/63znHBCG/roblox.png",
    fields: [
      { id:"username", label:"Username", placeholder:"Contoh: frostygamer", type:"text", width:"full" }
    ],
    hint: "Pastikan username sesuai akun Roblox yang aktif.",
    unit: "Robux",
    categories: [
      { key:"robux", label:"Robux", icon:"https://i.postimg.cc/jdN9nkRG/demon-robux.webp", items: [
        { label:"200 Robux (Promo)", price:68284, old:null, tag:null },
        { label:"300 Robux (Promo)", price:89229, old:null, tag:null },
        { label:"400 Robux", price:104571, old:null, tag:null },
        { label:"800 Robux", price:159835, old:null, tag:null },
        { label:"2.000 Robux", price:393917, old:null, tag:null },
        { label:"4.500 Robux", price:866379, old:null, tag:null },
        { label:"10.000 Robux", price:1791679, old:null, tag:null },
      ]},
      { key:"giftcard_usd", label:"Gift Card USD", items: [
        { label:"Roblox 10 USD", price:173461, old:null, tag:null },
        { label:"Roblox 25 USD", price:433745, old:null, tag:null },
        { label:"Roblox 30 USD", price:552049, old:null, tag:null },
        { label:"Roblox 50 USD", price:867301, old:null, tag:null },
      ]},
      { key:"giftcard_idr", label:"Gift Card IDR", items: [
        { label:"Roblox IDR 65.000", price:64723, old:null, tag:null },
        { label:"Roblox IDR 100.000", price:98445, old:null, tag:null },
        { label:"Roblox IDR 300.000", price:295333, old:null, tag:null },
        { label:"Roblox IDR 500.000", price:489080, old:null, tag:null },
      ]}
    ]
  },
  codm: {
    name: "Call of Duty Mobile", cat: "FPS", emoji: "🪖", trending: false,
    sold: "15rb+ terjual",
    logoUrl: "https://i.postimg.cc/26ThHCnD/codm.png",
    fields: [
      { id:"uid", label:"UID Open ID", placeholder:"Contoh: 7712345678", type:"text", width:"full" }
    ],
    hint: "UID Open ID dapat dilihat di pengaturan akun dalam game.",
    unit: "Top Up Instant Indonesia",
    categories: [
      { key:"regular", label:"CP", icon:"https://i.postimg.cc/65RS41BS/ef8a491b-202c-49d0-9915-86d609db48fb.webp", items: [
        { label:"31 CP", price:4679, old:null, tag:null },
        { label:"63 CP", price:9570, old:null, tag:null },
        { label:"128 CP", price:19139, old:null, tag:null },
        { label:"321 CP", price:47846, old:null, tag:null },
        { label:"645 CP", price:95691, old:null, tag:null },
        { label:"800 CP", price:112292, old:null, tag:null },
        { label:"1373 CP", price:191381, old:null, tag:null },
        { label:"2060 CP", price:287072, old:null, tag:null },
        { label:"2750 CP", price:355588, old:null, tag:null },
        { label:"3564 CP", price:478452, old:null, tag:null },
        { label:"5618 CP", price:683102, old:null, tag:null },
        { label:"7656 CP", price:956902, old:null, tag:null },
        { label:"15312 CP", price:1966671, old:null, tag:null },
        { label:"38280 CP", price:4916678, old:null, tag:null },
        { label:"76560 CP", price:9833355, old:null, tag:null },
      ]},
      { key:"instant", label:"Top Up Instant (Belum Kaitkan Garena)", icon:"https://i.postimg.cc/65RS41BS/ef8a491b-202c-49d0-9915-86d609db48fb.webp", items: [
        { label:"63 CP", price:9471, old:null, tag:null },
        { label:"128 CP", price:18942, old:null, tag:null },
        { label:"321 CP", price:47355, old:null, tag:null },
        { label:"645 CP", price:94709, old:null, tag:null },
        { label:"1373 CP", price:189418, old:null, tag:null },
        { label:"2060 CP", price:284127, old:null, tag:null },
        { label:"3564 CP", price:473545, old:null, tag:null },
        { label:"7656 CP", price:947089, old:null, tag:null },
      ]}
    ]
  },
  hsr: {
    name: "Honkai: Star Rail", cat: "RPG", emoji: "🚀", trending: true,
    sold: "12rb+ terjual",
    logoUrl: "https://i.postimg.cc/MTtVsz1G/hsr.png",
    fields: [
      { id:"uid", label:"UID", placeholder:"Contoh: 600123456", type:"text", width:"half" },
      { id:"server", label:"Server", placeholder:"Pilih server", type:"select", width:"half",
        options:["Asia","America","Europe","TW/HK/MO"] }
    ],
    hint: "UID dapat dilihat di pojok kiri bawah dalam game.",
    unit: "Oneiric Shards",
    categories: [
      { key:"special", label:"Special Item", icon:"https://i.postimg.cc/L4vJcfh7/HONKAI-STAR-2.webp", items: [
        { label:"Express Supply Pass", price:58188, old:null, tag:null },
        { label:"2x Express Supply Pass", price:116376, old:null, tag:null },
        { label:"3x Express Supply Pass", price:174564, old:null, tag:null },
        { label:"4x Express Supply Pass", price:232752, old:null, tag:null },
        { label:"5x Express Supply Pass", price:290940, old:null, tag:null }
      ]},
      { key:"diamond", label:"Top Up", icon:"https://i.postimg.cc/rygDBWzv/HONKAI-STAR-1.webp", items: [
        { base:60, bonus:0, price:11840, old:null, tag:null },
        { base:300, bonus:30, price:58566, old:null, tag:null },
        { base:980, bonus:110, price:181390, old:null, tag:null },
        { base:1280, bonus:140, price:239956, old:null, tag:null },
        { base:1980, bonus:260, price:367214, old:null, tag:null },
        { base:3280, bonus:600, price:612357, old:null, tag:null },
        { base:6480, bonus:1600, price:1166049, old:null, tag:"Best Value" }
      ]}
    ]
  },
  deltaforce: {
    name: "Delta Force", cat: "FPS", emoji: "💣", trending: false,
    sold: "4rb+ terjual",
    logoUrl: "https://i.postimg.cc/DZ5LC71y/deltaforce.png",
    fields: [
      { id:"uid", label:"Player ID", placeholder:"Contoh: 991234567", type:"text", width:"full" }
    ],
    hint: "Player ID dapat dilihat di halaman profil dalam game.",
    unit: "Delta Coins",
    categories: [
      { key:"special", label:"Special Item (Indonesia)", icon:"https://i.postimg.cc/HWFRxCCC/129603240-ezgif-(1).webp", items: [
        { label:"Blaze Supplies - Garena (ID)", price:7588, old:null, tag:null },
        { label:"Blaze Supplies Advanced - Garena (ID)", price:21679, old:null, tag:null },
      ]},
      { key:"id", label:"Delta Coins (Indonesia)", icon:"https://i.postimg.cc/pX8751P3/IMG-1714.webp", items: [
        { base:18, bonus:0, price:5166, old:null, tag:null },
        { base:30, bonus:0, price:7749, old:null, tag:null },
        { base:60, bonus:0, price:17220, old:null, tag:null },
        { base:300, bonus:20, price:75768, old:null, tag:null },
        { base:420, bonus:40, price:104180, old:null, tag:null },
        { base:680, bonus:70, price:146082, old:null, tag:null },
        { base:1280, bonus:200, price:291876, old:null, tag:null },
        { base:3280, bonus:670, price:729259, old:null, tag:null },
        { base:6480, bonus:1620, price:1458518, old:null, tag:null },
        { base:12960, bonus:3240, price:2917034, old:null, tag:null },
        { base:19440, bonus:4860, price:4375550, old:null, tag:null },
      ]},
      { key:"my", label:"Delta Coins (Malaysia)", icon:"https://i.postimg.cc/pX8751P3/IMG-1714.webp", items: [
        { base:18, bonus:1, price:4790, old:null, tag:null },
        { base:30, bonus:1, price:8074, old:null, tag:null },
        { base:60, bonus:2, price:16420, old:null, tag:null },
        { base:300, bonus:30, price:80775, old:null, tag:null },
        { base:420, bonus:54, price:113340, old:null, tag:null },
        { base:680, bonus:92, price:161320, old:null, tag:null },
        { base:1280, bonus:239, price:322959, old:null, tag:null },
        { base:1680, bonus:352, price:401726, old:null, tag:null },
        { base:3280, bonus:769, price:807557, old:null, tag:null },
        { base:6480, bonus:1815, price:1615204, old:null, tag:null },
        { base:12960, bonus:3629, price:3230727, old:null, tag:null },
        { base:19440, bonus:5444, price:4845929, old:null, tag:null },
      ]}
    ]
  },
  steam: {
    name: "Steam Wallet", cat: "Voucher", emoji: "💳", trending: false,
    sold: "9rb+ terjual",
    logoUrl: "https://i.postimg.cc/Hx3XSTb5/steam.png",
    fields: [
      { id:"email", label:"Email Akun Steam", placeholder:"Contoh: nama@email.com", type:"text", width:"full" }
    ],
    hint: "Kode voucher akan dikirim ke email yang didaftarkan.",
    nominalIcon: "https://i.postimg.cc/KcCwzyy2/1754497879-Video-Game-Computer-Icons-Counter-Strike-Source-Logo-PNG-1-removebg-preview-ezgif.webp",
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
