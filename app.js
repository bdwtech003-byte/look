/* ============================================================
   LOOK — Digital Atelier
   app.js
   ============================================================ */

/* ─────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
   ───────────────────────────────────────────────────────────── */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

let mx = 0, my = 0;   // mouse position
let rx = 0, ry = 0;   // ring position (lags behind)

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

// Ring smoothly follows mouse
(function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

// Hover effect on interactive elements
function bindCursorHover() {
  const targets = 'button, input, .item-card, .chip, .ptab, .skin-btn, .strip-btn, .tray-rm';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width   = '6px';
      cur.style.height  = '6px';
      ring.style.width  = '50px';
      ring.style.height = '50px';
      ring.style.borderColor = 'rgba(201,168,76,.8)';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width   = '12px';
      cur.style.height  = '12px';
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'var(--gold)';
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   2. DATA — CLOTHING CATALOGUE
   ───────────────────────────────────────────────────────────── */
const platforms = {
  zara: {
    items: [
      { id: 1,  name: 'Oversized Wool Coat',   price: '₹12,990', color: '#3d2b1f', accent: '#c8a882', cat: 'Outerwear', tag: 'NEW' },
      { id: 2,  name: 'Ribbed Knit Dress',     price: '₹4,490',  color: '#7a5e50', accent: '#d4b89e', cat: 'Dresses',   tag: 'TRENDING' },
      { id: 3,  name: 'Wide Leg Trousers',     price: '₹3,990',  color: '#1e2035', accent: '#7880d0', cat: 'Bottoms',   tag: '' },
      { id: 4,  name: 'Satin Slip Top',        price: '₹2,990',  color: '#b89aac', accent: '#eadce6', cat: 'Tops',      tag: 'BESTSELLER' },
    ]
  },
  hm: {
    items: [
      { id: 5,  name: 'Linen Blend Blazer',    price: '₹3,499',  color: '#ddd5c0', accent: '#a09070', cat: 'Tops',      tag: 'SALE' },
      { id: 6,  name: 'Floral Midi Skirt',     price: '₹2,299',  color: '#2d5a3d', accent: '#7fc99a', cat: 'Bottoms',   tag: 'NEW' },
      { id: 7,  name: 'Cargo Joggers',         price: '₹1,999',  color: '#454035', accent: '#a8a070', cat: 'Bottoms',   tag: '' },
      { id: 8,  name: 'Cropped Hoodie',        price: '₹1,799',  color: '#c24040', accent: '#f08080', cat: 'Tops',      tag: 'HOT' },
    ]
  },
  myntra: {
    items: [
      { id: 9,  name: 'Anarkali Kurta',        price: '₹1,899',  color: '#5a2278', accent: '#c090e0', cat: 'Ethnic',    tag: 'FESTIVE' },
      { id: 10, name: 'Denim Jacket',          price: '₹2,499',  color: '#1e3a5f', accent: '#5090c0', cat: 'Outerwear', tag: '' },
      { id: 11, name: 'Palazzo Set',           price: '₹1,599',  color: '#b84020', accent: '#e08060', cat: 'Sets',      tag: 'DEAL' },
      { id: 12, name: 'Biker Leather Jacket',  price: '₹5,999',  color: '#181818', accent: '#808080', cat: 'Outerwear', tag: 'PREMIUM' },
    ]
  }
};

// Flat array for quick lookup
const allItems = Object.values(platforms).flatMap(p => p.items);

/* ─────────────────────────────────────────────────────────────
   3. STATE
   ───────────────────────────────────────────────────────────── */
let skin           = '#e8a87c';
let wearing        = [];
let activePlatform = 'zara';

/* ─────────────────────────────────────────────────────────────
   4. RENDER — LEFT PANEL (CATALOGUE)
   ───────────────────────────────────────────────────────────── */
function renderItems() {
  const list  = document.getElementById('items-list');
  const items = platforms[activePlatform].items;

  document.getElementById('count-badge').textContent = `${items.length} PIECES`;
  list.innerHTML = '';

  items.forEach(item => {
    const on = wearing.some(w => w.id === item.id);

    const card = document.createElement('div');
    card.className = 'item-card' + (on ? ' worn' : '');
    card.innerHTML = `
      <div class="swatch">
        <div class="swatch-inner" style="background:${item.color}">
          <div class="swatch-sheen"></div>
          ${item.tag ? `<div class="swatch-tag">${item.tag}</div>` : ''}
        </div>
      </div>
      <div class="item-body">
        <div>
          <div class="item-platform">${activePlatform.toUpperCase()}</div>
          <div class="item-name">${item.name}</div>
        </div>
        <div class="item-bottom">
          <span class="item-price">${item.price}</span>
          <span class="item-cta">${on ? 'WEARING ✓' : 'TRY ON →'}</span>
        </div>
      </div>
      <div class="worn-check">✓</div>
    `;

    card.addEventListener('click', () => toggleItem(item));
    list.appendChild(card);
  });

  // Re-bind cursor hover for newly created cards
  bindCursorHover();
}

/* ─────────────────────────────────────────────────────────────
   5. TOGGLE AN ITEM ON/OFF
   ───────────────────────────────────────────────────────────── */
function toggleItem(item) {
  const idx = wearing.findIndex(w => w.id === item.id);

  if (idx >= 0) {
    // Already worn — remove it
    wearing.splice(idx, 1);
  } else {
    // Remove any item in the same clothing category, then add new one
    wearing = wearing.filter(w => w.cat !== item.cat);
    wearing.push(item);
  }

  doFlash();
  renderItems();
  drawAvatar();
  renderTray();
  syncStatus();
}

/* Remove a single item by ID (called from tray buttons) */
function removeItem(id) {
  const item = allItems.find(i => i.id === id);
  if (item) toggleItem(item);
}

/* Clear entire outfit */
function clearAll() {
  wearing = [];
  renderItems();
  drawAvatar();
  renderTray();
  syncStatus();
}

/* ─────────────────────────────────────────────────────────────
   6. SYNC STATUS (topbar pill + clear button)
   ───────────────────────────────────────────────────────────── */
function syncStatus() {
  const el = document.getElementById('worn-status');
  el.innerHTML = wearing.length === 0
    ? 'No pieces selected'
    : `<b>${wearing.length}</b> piece${wearing.length > 1 ? 's' : ''} on avatar`;

  document.getElementById('clear-btn').style.display = wearing.length ? 'block' : 'none';
}

/* ─────────────────────────────────────────────────────────────
   7. RENDER — OUTFIT TRAY (left panel bottom) + RIGHT STRIP
   ───────────────────────────────────────────────────────────── */
function renderTray() {
  const tray  = document.getElementById('outfit-tray');
  const ti    = document.getElementById('tray-items');
  const strip = document.getElementById('outfit-strip');
  const empty = document.getElementById('empty-hint');
  const tags  = document.getElementById('worn-tags-right');

  if (wearing.length === 0) {
    tray.classList.remove('show');
    strip.classList.remove('show');
    empty.style.display = 'block';
    return;
  }

  tray.classList.add('show');
  strip.classList.add('show');
  empty.style.display = 'none';

  // Left panel tray
  ti.innerHTML = wearing.map(w => `
    <div class="tray-item">
      <span class="tray-dot" style="background:${w.color}"></span>
      <span class="tray-name">${w.name}</span>
      <button class="tray-rm" onclick="removeItem(${w.id})">✕</button>
    </div>
  `).join('');

  // Right panel tags
  tags.innerHTML = wearing.map(w => `
    <div class="worn-tag">
      <span class="tag-dot" style="background:${w.color}; border:1px solid ${w.accent}"></span>
      <span class="tag-txt">${w.name}</span>
    </div>
  `).join('');

  bindCursorHover();
}

/* ─────────────────────────────────────────────────────────────
   8. AVATAR FLASH EFFECT
   ───────────────────────────────────────────────────────────── */
function doFlash() {
  const svg  = document.getElementById('avatar-svg');
  const glow = document.getElementById('avatar-glow');
  const fr   = document.getElementById('flash-ring');

  svg.classList.add('flash');
  glow.classList.add('bright');

  // Restart CSS animation
  fr.style.animation = 'none';
  fr.offsetHeight;   // reflow trigger
  fr.style.animation = 'ringFlash .55s ease forwards';

  setTimeout(() => {
    svg.classList.remove('flash');
    glow.classList.remove('bright');
  }, 500);
}

/* ─────────────────────────────────────────────────────────────
   9. DRAW AVATAR SVG
   ───────────────────────────────────────────────────────────── */
function drawAvatar() {
  const svg = document.getElementById('avatar-svg');

  // Figure out what's being worn
  const top    = wearing.find(w => ['Tops', 'Outerwear', 'Ethnic', 'Sets'].includes(w.cat));
  const bottom = wearing.find(w => w.cat === 'Bottoms');
  const dress  = wearing.find(w => w.cat === 'Dresses');

  const s  = skin;                                     // skin tone
  const bc = top?.color    || '#3a3535';               // body / top colour
  const lc = bottom?.color || dress?.color || '#1e1c18'; // leg colour

  const hasDress  = !!dress;
  const hasCargo  = bottom?.name?.includes('Cargo');
  const hasCoat   = top?.cat === 'Outerwear';
  const hasBlazer = top?.name?.includes('Blazer');

  svg.innerHTML = `
    <!-- ── GROUND SHADOW ── -->
    <ellipse cx="100" cy="412" rx="44" ry="7" fill="rgba(0,0,0,.35)"/>

    <!-- ── LEGS ── -->
    <path d="M74,228 Q70,310 66,406 L84,406 Q89,330 100,296 Q111,330 116,406 L134,406 Q130,310 126,228 Z"
      fill="${hasDress ? bc : lc}"/>

    ${hasCargo ? `
      <rect x="66" y="268" width="18" height="24" rx="2" fill="rgba(0,0,0,.3)"/>
      <line x1="75" y1="268" x2="75" y2="292" stroke="rgba(0,0,0,.2)" stroke-width="1"/>
      <rect x="116" y="268" width="18" height="24" rx="2" fill="rgba(0,0,0,.3)"/>
    ` : ''}

    <!-- ── BODY / TORSO ── -->
    <path d="M64,136 Q50,150 48,176 L46,228 Q70,238 100,236 Q130,238 154,228 L152,176 Q150,150 136,136 Q120,148 100,148 Q80,148 64,136 Z"
      fill="${bc}"/>

    <!-- body sheen -->
    <path d="M64,136 Q50,150 48,176 L54,200 Q68,170 78,155 Q88,148 100,148 Q80,148 64,136 Z"
      fill="rgba(255,255,255,.06)"/>

    ${hasCoat ? `
      <path d="M78,138 Q74,120 88,116 L100,130 L112,116 Q126,120 122,138 Q110,148 100,148 Q90,148 78,138 Z"
        fill="${bc}" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
      <path d="M78,138 L68,200 L80,192 Z" fill="rgba(0,0,0,.15)"/>
      <path d="M122,138 L132,200 L120,192 Z" fill="rgba(0,0,0,.15)"/>
    ` : ''}

    ${hasBlazer ? `
      <path d="M84,138 L74,176 L100,160 Z" fill="${bc}" stroke="rgba(255,255,255,.12)" stroke-width=".8"/>
      <path d="M116,138 L126,176 L100,160 Z" fill="${bc}" stroke="rgba(255,255,255,.12)" stroke-width=".8"/>
      <ellipse cx="100" cy="162" rx="4" ry="5" fill="rgba(255,255,255,.08)"/>
    ` : ''}

    <!-- ── ARMS ── -->
    <path d="M50,140 Q28,165 26,208 L40,211 Q42,174 58,154 Z" fill="${bc}"/>
    <path d="M150,140 Q172,165 174,208 L160,211 Q158,174 142,154 Z" fill="${bc}"/>

    <!-- arm sheen -->
    <path d="M50,140 Q38,155 34,175 Q44,168 54,154 Z" fill="rgba(255,255,255,.05)"/>
    <path d="M150,140 Q162,155 166,175 Q156,168 146,154 Z" fill="rgba(255,255,255,.05)"/>

    <!-- ── FOREARMS & HANDS ── -->
    <path d="M26,208 Q22,230 28,242 L42,238 L40,211 Z" fill="${s}"/>
    <path d="M174,208 Q178,230 172,242 L158,238 L160,211 Z" fill="${s}"/>
    <ellipse cx="29"  cy="246" rx="8" ry="6" fill="${s}"/>
    <ellipse cx="171" cy="246" rx="8" ry="6" fill="${s}"/>

    <!-- ── NECK ── -->
    <path d="M88,118 Q84,112 88,106 Q100,102 112,106 Q116,112 112,118 Q104,128 88,118 Z" fill="${s}"/>

    <!-- ── HEAD (shadow + base) ── -->
    <ellipse cx="100" cy="90" rx="36" ry="40" fill="rgba(0,0,0,.25)" transform="translate(3,6)"/>
    <ellipse cx="100" cy="88" rx="35" ry="40" fill="${s}"/>
    <ellipse cx="88"  cy="72" rx="16" ry="18" fill="rgba(255,255,255,.07)"/>

    <!-- ── HAIR ── -->
    <path d="M65,78 Q68,46 100,44 Q132,46 135,78 Q126,60 100,58 Q74,60 65,78 Z" fill="#140a00"/>
    <path d="M65,78 Q60,95 63,114 Q66,84 74,76 Z" fill="#140a00"/>
    <path d="M135,78 Q140,95 137,114 Q134,84 126,76 Z" fill="#140a00"/>
    <path d="M78,52 Q100,46 118,54 Q105,50 100,50 Q90,50 78,52 Z" fill="rgba(255,255,255,.08)"/>

    <!-- ── EYEBROWS ── -->
    <path d="M81,76 Q87,72 93,75"  stroke="#2a1500" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M107,75 Q113,72 119,76" stroke="#2a1500" stroke-width="2" fill="none" stroke-linecap="round"/>

    <!-- ── EYES ── -->
    <ellipse cx="87"  cy="86" rx="5" ry="6" fill="#1a1008"/>
    <ellipse cx="113" cy="86" rx="5" ry="6" fill="#1a1008"/>
    <!-- iris -->
    <ellipse cx="87"  cy="87" rx="3" ry="3.5" fill="#3a2010"/>
    <ellipse cx="113" cy="87" rx="3" ry="3.5" fill="#3a2010"/>
    <!-- catchlights -->
    <ellipse cx="89"  cy="84" rx="1.5" ry="1.5" fill="rgba(255,255,255,.7)"/>
    <ellipse cx="115" cy="84" rx="1.5" ry="1.5" fill="rgba(255,255,255,.7)"/>
    <!-- lashes -->
    <path d="M82,80 Q87,77 92,80"   stroke="#140a00" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M108,80 Q113,77 118,80" stroke="#140a00" stroke-width="1.5" fill="none" stroke-linecap="round"/>

    <!-- ── NOSE ── -->
    <path d="M97,92 Q100,100 103,92"   stroke="rgba(0,0,0,.15)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M94,103 Q100,106 106,103" stroke="rgba(0,0,0,.1)"  stroke-width="1"   fill="none" stroke-linecap="round"/>

    <!-- ── LIPS ── -->
    <path d="M90,108 Q100,114 110,108" fill="#c07060" opacity=".7"/>
    <path d="M90,108 Q100,105 110,108" fill="#d08070" opacity=".5"/>
    <path d="M90,108 Q100,109 110,108" stroke="#a05040" stroke-width=".8" fill="none"/>

    <!-- ── EARS ── -->
    <ellipse cx="65"  cy="92" rx="5" ry="8" fill="${s}" stroke="rgba(0,0,0,.1)" stroke-width=".5"/>
    <ellipse cx="135" cy="92" rx="5" ry="8" fill="${s}" stroke="rgba(0,0,0,.1)" stroke-width=".5"/>

    <!-- ── SHOES ── -->
    <path d="M60,400 Q54,414 76,416 L84,408 L66,404 Z" fill="#111"/>
    <path d="M60,400 Q54,408 60,412 L76,416 Q54,414 60,400 Z" fill="rgba(255,255,255,.04)"/>
    <path d="M140,400 Q146,414 124,416 L116,408 L134,404 Z" fill="#111"/>
    <path d="M140,400 Q146,408 140,412 L124,416 Q146,414 140,400 Z" fill="rgba(255,255,255,.04)"/>
  `;
}

/* ─────────────────────────────────────────────────────────────
   10. CHAT — ADD A MESSAGE
   ───────────────────────────────────────────────────────────── */
const chatEl = document.getElementById('chat');

function addMsg(role, html) {
  const d = document.createElement('div');
  d.className = `msg ${role}`;
  d.innerHTML = `
    <div class="msg-avatar">${role === 'ai' ? '✦' : '◈'}</div>
    <div class="msg-bubble">${html}</div>
  `;
  chatEl.appendChild(d);
  chatEl.scrollTop = chatEl.scrollHeight;
}

/* ─────────────────────────────────────────────────────────────
   11. HANDLE AI PROMPT
   ───────────────────────────────────────────────────────────── */
function handlePrompt(txt) {
  txt = txt.trim();
  if (!txt) return;

  addMsg('user', `<em>${txt}</em>`);
  document.getElementById('prompt-input').value = '';
  document.getElementById('send-btn').classList.remove('ready');

  // Show typing indicator
  const typingEl = document.getElementById('typing');
  typingEl.classList.add('show');
  chatEl.scrollTop = chatEl.scrollHeight;

  setTimeout(() => {
    typingEl.classList.remove('show');

    const lo = txt.toLowerCase();
    const applied = [];

    // Helper: try to apply item by ID
    const tryId = id => {
      const it = allItems.find(i => i.id === id);
      if (it) { toggleItem(it); applied.push(`<strong>${it.name}</strong>`); }
    };

    // Keyword matching → clothing
    if (lo.includes('coat')   || lo.includes('wool'))               tryId(1);
    if (lo.includes('dress')  || lo.includes('ribbed'))             tryId(2);
    if (lo.includes('trouser')|| lo.includes('wide'))               tryId(3);
    if (lo.includes('satin')  || lo.includes('slip'))               tryId(4);
    if (lo.includes('blazer') || lo.includes('linen'))              tryId(5);
    if (lo.includes('skirt')  || lo.includes('floral'))             tryId(6);
    if (lo.includes('cargo'))                                        tryId(7);
    if (lo.includes('hoodie') || lo.includes('red') || lo.includes('bold')) tryId(8);
    if (lo.includes('ethnic') || lo.includes('wedding') || lo.includes('festive') || lo.includes('kurta')) tryId(9);
    if (lo.includes('denim'))                                        tryId(10);
    if (lo.includes('palazzo')|| lo.includes('set'))                tryId(11);
    if (lo.includes('leather')|| lo.includes('biker'))              tryId(12);
    if (lo.includes('casual') || lo.includes('street'))             { tryId(8); tryId(7); }

    // Build reply
    let reply;

    if (lo.includes('clear') || lo.includes('reset')) {
      clearAll();
      reply = 'Bien sûr. Your canvas is reset. Shall we begin anew with a fresh vision?';
    } else if (applied.length > 0) {
      reply = `Magnifique. I have dressed you in ${applied.join(' paired with ')}. The silhouette is striking — would you like to complete the look further?`;
    } else {
      const suggestions = [
        'the Zara Wool Coat — effortlessly luxurious',
        'the Anarkali Kurta — rich with occasion',
        'the Linen Blazer — quietly powerful',
      ];
      const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
      reply = `For that aesthetic, I would suggest <strong>${pick}</strong>. Browse the collection on your left to visualise it on your form.`;
    }

    addMsg('ai', reply);
  }, 1400);
}

/* ─────────────────────────────────────────────────────────────
   12. EVENT BINDINGS
   ───────────────────────────────────────────────────────────── */

// Platform tabs
document.querySelectorAll('.ptab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activePlatform = btn.dataset.p;
    renderItems();
  });
});

// Skin tone buttons
document.querySelectorAll('.skin-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skin-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    skin = btn.dataset.tone;
    drawAvatar();
  });
});

// Chat input
const promptInput = document.getElementById('prompt-input');
const sendBtn     = document.getElementById('send-btn');

promptInput.addEventListener('input', () => {
  sendBtn.classList.toggle('ready', promptInput.value.trim().length > 0);
});

promptInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handlePrompt(promptInput.value);
});

sendBtn.addEventListener('click', () => handlePrompt(promptInput.value));

// Quick-prompt chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => handlePrompt(chip.dataset.p));
});

/* ─────────────────────────────────────────────────────────────
   13. INITIALISE
   ───────────────────────────────────────────────────────────── */
renderItems();
drawAvatar();
renderTray();
syncStatus();
bindCursorHover();
