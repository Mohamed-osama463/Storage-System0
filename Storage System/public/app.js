/* ══════════════════════════════════════════
   HD For Printing — app.js
   Requires Firebase Compat SDK (app + database)
   loaded in index.html before this file
══════════════════════════════════════════ */

/* ── FIREBASE INIT ── */
const fbApp = firebase.initializeApp({
  apiKey           : "AIzaSyCN86AwMZNyRxRYT6M8gNmt96jHWHo-7Ec",
  authDomain       : "storage-system-d28fa.firebaseapp.com",
  databaseURL      : "https://storage-system-d28fa-default-rtdb.firebaseio.com",
  projectId        : "storage-system-d28fa",
  storageBucket    : "storage-system-d28fa.firebasestorage.app",
  messagingSenderId: "512438373405",
  appId            : "1:512438373405:web:9eae54bb21c537548e8af4",
  measurementId    : "G-RMR4JS8949"
});
const db = fbApp.database();

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */

const ROLE_CONFIG = {
  super   : { label:'سوبر أدمن', tabs:['dashboard','orders','printing','storage'], can:{order:1,del:1,begin:1,done:1,storage:1,cat:1} },
  admin   : { label:'أدمن',      tabs:['dashboard','orders','printing','storage'], can:{order:1,del:1,begin:1,done:1,storage:1,cat:1} },
  printing: { label:'المطبعة',   tabs:['printing'],                               can:{begin:1,done:1} },
  storage : { label:'المخزن',    tabs:['storage'],                                can:{storage:1} },
};

const TASH = [
  'سلوفان','SPOT UV','تكسير','لصق','بصمة','كفراج','ريجا','كرتون',
  'لحام','كعب','منفاخ','يد','تطبيق','قص','سلك','تقفيل','نمرة','فرفرية','دبوس','بشر'
];

const STAGES = [
  {i:'📥',l:'استلام'},{i:'🖥',l:'CTP'},{i:'🖨',l:'طباعة'},
  {i:'✂️',l:'قص'},{i:'🎨',l:'تشطيب'},{i:'📦',l:'تعبئة'},{i:'✅',l:'تسليم'}
];

const ICONS = ['📦','🗂','📄','🖨','✂️','🎨','🧴','📏','🔩','🧵','💧','🗃','📐','🖇','📌','🔖','🏷','⚙️','🎞','🖊'];

const TAB_DEF = {
  orders   : {l:'أوامر الشغل', i:'📋'},
  printing : {l:'المطبعة',     i:'🖨'},
  storage  : {l:'المخزن',      i:'📦'},
  dashboard: {l:'لوحة التحكم', i:'📊'},
};

const DCOLS = ['#D71920','#F8A119','#1A4A7A','#1A7A3A','#7A3A7A','#2E6B7A','#7A5A1A','#5A1A7A','#3A5A1A','#1A3A7A'];

const ACT_META = {
  new    : {icon:'📋', color:'#D71920', label:'أمر جديد'},
  done   : {icon:'✅', color:'#1A7A3A', label:'اكتمل'},
  del    : {icon:'🗑️', color:'#D71920', label:'حذف'},
  low    : {icon:'⚠️', color:'#C47E0E', label:'تحذير مخزن'},
  out    : {icon:'🚨', color:'#D71920', label:'نفذت الكمية'},
  restock: {icon:'📦', color:'#1A4A7A', label:'استلام مخزون'},
};

const DEFCATS = [
  {id:'c1',name:'الورق المكربن',icon:'📄',color:'#D71920',items:{
    i1:{id:'i1',name:'ورق أصل', v:'',     qty:80, min:20,unit:'رزمة',loc:''},
    i2:{id:'i2',name:'ورق وسط', v:'أحمر', qty:60, min:20,unit:'رزمة',loc:''},
    i3:{id:'i3',name:'ورق وسط', v:'أخضر', qty:55, min:20,unit:'رزمة',loc:''},
    i4:{id:'i4',name:'ورق وسط', v:'أزرق', qty:0,  min:20,unit:'رزمة',loc:''},
    i5:{id:'i5',name:'ورق وسط', v:'أصفر', qty:30, min:20,unit:'رزمة',loc:''},
    i6:{id:'i6',name:'ورق آخر', v:'أحمر', qty:10, min:20,unit:'رزمة',loc:''},
    i7:{id:'i7',name:'ورق آخر', v:'أخضر', qty:25, min:20,unit:'رزمة',loc:''},
    i8:{id:'i8',name:'ورق آخر', v:'أزرق', qty:0,  min:20,unit:'رزمة',loc:''},
    i9:{id:'i9',name:'ورق آخر', v:'أصفر', qty:18, min:20,unit:'رزمة',loc:''},
  }},
  {id:'c2',name:'ورق الطبع',icon:'🖨',color:'#1A4A7A',items:{
    i10:{id:'i10',name:'٧٠ جرام ٧٠٪', v:'',qty:120,min:30,unit:'رزمة',loc:''},
    i11:{id:'i11',name:'٧٠ جرام جاير',v:'',qty:85, min:30,unit:'رزمة',loc:''},
    i12:{id:'i12',name:'٨٠ جرام ٧٠٪', v:'',qty:200,min:30,unit:'رزمة',loc:''},
    i13:{id:'i13',name:'٨٠ جرام جاير',v:'',qty:150,min:30,unit:'رزمة',loc:''},
    i14:{id:'i14',name:'١٠٠ جرام',     v:'',qty:40, min:20,unit:'رزمة',loc:''},
  }},
  {id:'c3',name:'ورق الكوشيه',icon:'📋',color:'#7A3A7A',items:{
    i15:{id:'i15',name:'١١٥ جرام',v:'٧٠٪',qty:90, min:20,unit:'رزمة',loc:''},
    i16:{id:'i16',name:'١٣٠ جرام',v:'٧٠٪',qty:110,min:20,unit:'رزمة',loc:''},
    i17:{id:'i17',name:'١٥٠ جرام',v:'٧٠٪',qty:8,  min:20,unit:'رزمة',loc:''},
    i18:{id:'i18',name:'١٧٠ جرام',v:'٧٠٪',qty:60, min:20,unit:'رزمة',loc:''},
    i19:{id:'i19',name:'٢٠٠ جرام',v:'٧٠٪',qty:40, min:20,unit:'رزمة',loc:''},
    i20:{id:'i20',name:'٢٥٠ جرام',v:'٧٠٪',qty:35, min:20,unit:'رزمة',loc:''},
    i21:{id:'i21',name:'٣٠٠ جرام',v:'٧٠٪',qty:25, min:20,unit:'رزمة',loc:''},
    i22:{id:'i22',name:'٣٥٠ جرام',v:'٧٠٪',qty:12, min:20,unit:'رزمة',loc:''},
  }},
  {id:'c4',name:'البرستول',icon:'🗂',color:'#1A7A3A',items:{
    i23:{id:'i23',name:'١٣٠ جرام',v:'',qty:50,min:15,unit:'رزمة',loc:''},
    i24:{id:'i24',name:'١٧٠ جرام',v:'',qty:0, min:15,unit:'رزمة',loc:''},
    i25:{id:'i25',name:'٢٣٠ جرام',v:'',qty:30,min:15,unit:'رزمة',loc:''},
    i26:{id:'i26',name:'٣٠٠ جرام',v:'',qty:20,min:15,unit:'رزمة',loc:''},
  }},
  {id:'c5',name:'الألومنيوم',icon:'🔩',color:'#7A5A1A',items:{
    i27:{id:'i27',name:'فضي لامع',v:'',qty:5,min:3,unit:'بكرة',loc:''},
    i28:{id:'i28',name:'فضي مط',  v:'',qty:3,min:3,unit:'بكرة',loc:''},
    i29:{id:'i29',name:'أبيض',    v:'',qty:7,min:3,unit:'بكرة',loc:''},
  }},
  {id:'c6',name:'السلوفان',icon:'🎞',color:'#2E6B7A',items:{
    i30:{id:'i30',name:'بكرة ٢٣ سم',  v:'',qty:4,min:2,unit:'بكرة',loc:''},
    i31:{id:'i31',name:'بكرة ٣٠ سم',  v:'',qty:0,min:2,unit:'بكرة',loc:''},
    i32:{id:'i32',name:'بكرة ٥٠ سم',  v:'',qty:5,min:2,unit:'بكرة',loc:''},
    i33:{id:'i33',name:'بكرة ٦٩.٥ سم',v:'',qty:1,min:2,unit:'بكرة',loc:''},
  }},
];

/* ══════════════════════════════════════════
   STATE
══════════════════════════════════════════ */

let CU          = null;
let USERS       = {};
let orders      = {};
let cats        = {};
let actLog      = [];
let nextON      = 1;
let doneVisible = false;
let selOrderId  = null;
let openCatId   = null;
let qState      = {cid:null, iid:null, mode:'add'};
let selColor    = '#D71920';
let selIcon     = '📦';
let toastTmr    = null;

/* ══════════════════════════════════════════
   UTILS
══════════════════════════════════════════ */

const pad       = n => String(n).padStart(4,'0');
const nowTime   = () => new Date().toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'});
const nowDateAr = () => new Date().toLocaleDateString('ar-EG');
const esc       = s  => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('sh');
  if (toastTmr) clearTimeout(toastTmr);
  toastTmr = setTimeout(() => t.classList.remove('sh'), 2700);
}

function setSyncUI(s) {
  const d = document.getElementById('sdot');
  const l = document.getElementById('slbl');
  if (!d) return;
  d.className   = 'sdot' + (s==='sy' ? ' sy' : s==='er' ? ' er' : '');
  l.textContent = {sy:'جارٍ…', er:'خطأ', ok:'متصل'}[s] || 'متصل';
}

const openModal  = id => document.getElementById(id).classList.add('op');
const closeModal = id => document.getElementById(id).classList.remove('op');

function sbadge(s) {
  return {
    pending : '<span class="badge bp">⏳ انتظار</span>',
    printing: '<span class="badge bpr">🖨 طباعة</span>',
    done    : '<span class="badge bd2">✅ مكتمل</span>',
  }[s] || '';
}

function stagesHTML(o) {
  const idx = o.si || 0;
  return '<div class="stages">' +
    STAGES.map((s,i) => {
      const c = i < idx ? 'dn' : i === idx ? 'ac' : '';
      return `<div class="stg ${c}"><div class="sd">${i<idx?'✓':s.i}</div><div class="sg">${s.l}</div></div>`;
    }).join('') +
  '</div>';
}

function getItem(val) {
  if (!val) return null;
  const [cid,iid] = val.split('|');
  const ck = Object.keys(cats).find(k => cats[k].id === cid) || cid;
  return cats[ck]?.items?.[iid] || null;
}

const ordersArr     = () => Object.values(orders).sort((a,b) => b.ts - a.ts);
const catsArr       = () => Object.values(cats);
const fbKeyForOrder = numId => Object.keys(orders).find(k => orders[k].id === numId) || null;
const fbKeyForCat   = catId => Object.keys(cats).find(k => cats[k].id === catId) || catId;

function setBtnLoading(id, loading, normalText) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.disabled  = loading;
  btn.innerHTML = loading
    ? `${normalText} <span class="lbtn-spinner"></span>`
    : normalText;
}

function showErr(elId, msg) {
  const el = document.getElementById(elId);
  el.textContent   = msg;
  el.style.display = 'block';
}
function hideErr(elId) {
  document.getElementById(elId).style.display = 'none';
}

/* ══════════════════════════════════════════
   ACTIVITY LOG
══════════════════════════════════════════ */

async function logAct(type, txt) {
  const now = Date.now();
  if (actLog.find(a => a.type===type && a.txt===txt && now-a.ts < 20000)) return;
  try {
    await db.ref('hd/log').push({type, txt, time:nowTime(), ts:now});
  } catch(e) {
    console.warn('logAct failed:', e);
  }
}

/* ══════════════════════════════════════════
   USERS  (100% Firebase — no hardcoded fallback)
══════════════════════════════════════════ */

function parseUsersSnap(val) {
  USERS = {};
  Object.values(val).forEach(u => {
    if (!u || !u.email) return;
    const tabs = Array.isArray(u.tabs) ? u.tabs : Object.values(u.tabs || {});
    const can  = {};
    if (u.can) Object.keys(u.can).forEach(k => { if (u.can[k]) can[k] = 1; });
    USERS[u.email.toLowerCase()] = {
      name  : u.name     || '',
      role  : u.role     || 'admin',
      lbl   : u.label    || u.lbl || '',
      pw    : u.password || u.pw  || '',
      ini   : u.initials || u.ini || '؟',
      tabs, can, active: u.active !== false,
    };
  });
}

async function loadUsers() {
  try {
    const snap = await db.ref('hd/users').once('value');
    if (snap.exists() && snap.val()) {
      parseUsersSnap(snap.val());
    } else {
      USERS = {};
    }
  } catch(e) {
    console.warn('loadUsers error:', e);
    USERS = {};
  }
}

/* ══════════════════════════════════════════
   SEED CATEGORIES (first run only)
══════════════════════════════════════════ */

async function seedCatsIfEmpty() {
  try {
    const snap = await db.ref('hd/cats').once('value');
    if (!snap.exists() || !Object.keys(snap.val() || {}).length) {
      const obj = {};
      DEFCATS.forEach(c => { obj[c.id] = c; });
      await db.ref('hd/cats').set(obj);
    }
  } catch(e) {
    console.warn('seedCatsIfEmpty failed:', e);
  }
}

/* ══════════════════════════════════════════
   REALTIME LISTENERS
══════════════════════════════════════════ */

function attachListeners() {
  setSyncUI('sy');

  db.ref('hd/orders').on('value',
    snap => { orders = snap.val() || {}; setSyncUI('ok'); refreshCurrentPage(); },
    e    => { setSyncUI('er'); console.error('orders:', e); }
  );
  db.ref('hd/cats').on('value',
    snap => { cats = snap.val() || {}; setSyncUI('ok'); refreshCurrentPage(); },
    e    => { setSyncUI('er'); console.error('cats:', e); }
  );
  db.ref('hd/log').on('value', snap => {
    actLog = Object.values(snap.val() || {}).sort((a,b) => b.ts - a.ts).slice(0,50);
    refreshCurrentPage();
  });
  db.ref('hd/counter').on('value', snap => {
    nextON = snap.val() || 1;
  });
  /* Users realtime — new signups & role changes reflect immediately */
  db.ref('hd/users').on('value', snap => {
    if (snap.exists() && snap.val()) parseUsersSnap(snap.val());
    else USERS = {};
  });
}

function detachListeners() {
  db.ref('hd/orders').off();
  db.ref('hd/cats').off();
  db.ref('hd/log').off();
  db.ref('hd/counter').off();
  db.ref('hd/users').off();
}

function refreshCurrentPage() {
  const ap = document.querySelector('.pg.on');
  if (!ap) return;
  const id = ap.id.replace('pg-','');
  if      (id==='orders')    renderOrders();
  else if (id==='printing')  renderPrinting();
  else if (id==='storage')   renderStorage();
  else if (id==='dashboard') renderDash();
}

/* ══════════════════════════════════════════
   AUTH
══════════════════════════════════════════ */

async function doLogin() {
  const em = (document.getElementById('lu').value || '').trim().toLowerCase();
  const pw =  document.getElementById('lp').value || '';
  hideErr('lerr');

  if (!em) { showErr('lerr','⚠ أدخل البريد الإلكتروني'); return; }
  if (!pw) { showErr('lerr','⚠ أدخل كلمة المرور');       return; }

  setBtnLoading('lbtn', true, 'دخول ←');
  try {
    await loadUsers();

    if (!Object.keys(USERS).length) {
      showErr('lerr','❌ لا توجد حسابات بعد. أنشئ حساباً أولاً من خلال "إنشاء حساب جديد"');
      return;
    }

    const u = USERS[em];
    if (!u)        { showErr('lerr','❌ البريد الإلكتروني غير مسجل'); return; }
    if (!u.active) { showErr('lerr','❌ هذا الحساب معطّل');            return; }
    if (pw !== u.pw) {
      showErr('lerr','❌ كلمة المرور غير صحيحة');
      document.getElementById('lp').value = '';
      return;
    }

    CU = {...u};
    await seedCatsIfEmpty();
    attachListeners();

    document.getElementById('ls').classList.add('hidden');
    document.getElementById('app').classList.add('visible');
    buildNav();
    showTab(CU.tabs[0]);

  } catch(e) {
    console.error('doLogin:', e);
    showErr('lerr','❌ فشل الاتصال: ' + (e.message || 'خطأ غير معروف'));
    CU = null;
  } finally {
    setBtnLoading('lbtn', false, 'دخول ←');
  }
}

async function doSignup() {
  const name  = (document.getElementById('su-name').value  || '').trim();
  const email = (document.getElementById('su-email').value || '').trim().toLowerCase();
  const pw    =  document.getElementById('su-pw').value    || '';
  const pw2   =  document.getElementById('su-pw2').value   || '';
  const role  =  document.getElementById('su-role').value;
  hideErr('su-err');

  if (!name)                          { showErr('su-err','⚠ أدخل الاسم الكامل');              return; }
  if (!email || !email.includes('@')) { showErr('su-err','⚠ أدخل بريد إلكتروني صحيح');       return; }
  if (pw.length < 6)                  { showErr('su-err','⚠ كلمة المرور 6 أحرف على الأقل');   return; }
  if (pw !== pw2)                     { showErr('su-err','⚠ كلمتا المرور غير متطابقتين');     return; }
  if (!role)                          { showErr('su-err','⚠ اختر الدور الوظيفي');              return; }

  setBtnLoading('su-btn', true, 'إنشاء الحساب ←');
  try {
    await loadUsers();

    if (USERS[email]) {
      showErr('su-err','❌ هذا البريد مسجّل مسبقاً');
      return;
    }

    const rc    = ROLE_CONFIG[role];
    const parts = name.split(' ').filter(Boolean);
    const ini   = parts.length >= 2
      ? parts[0].charAt(0) + parts[1].charAt(0)
      : parts[0].charAt(0);

    await db.ref('hd/users').push({
      name,
      email,
      password: pw,
      role,
      label   : rc.label,
      initials: ini,
      tabs    : rc.tabs,
      can     : rc.can,
      active  : true,
    });

    toast('✅ تم إنشاء الحساب بنجاح!');
    switchToLogin();
    document.getElementById('lu').value = email;
    document.getElementById('lp').focus();

  } catch(e) {
    console.error('doSignup:', e);
    showErr('su-err','❌ فشل إنشاء الحساب: ' + (e.message || 'خطأ غير معروف'));
  } finally {
    setBtnLoading('su-btn', false, 'إنشاء الحساب ←');
  }
}

function switchToSignup() {
  document.getElementById('login-form').style.display  = 'none';
  document.getElementById('signup-form').style.display = 'block';
  ['su-name','su-email','su-pw','su-pw2'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('su-role').value = '';
  hideErr('su-err');
  document.getElementById('l-title').textContent = 'إنشاء حساب جديد 📝';
  document.getElementById('l-hint').textContent  = 'أدخل بياناتك لإنشاء حسابك';
}

function switchToLogin() {
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('login-form').style.display  = 'block';
  hideErr('lerr');
  document.getElementById('l-title').textContent = 'أهلاً بك 👋';
  document.getElementById('l-hint').textContent  = 'سجّل دخولك للمتابعة';
}

function doLogout() {
  detachListeners();
  CU=null; orders={}; cats={}; actLog=[]; nextON=1;
  selOrderId=null; doneVisible=false; openCatId=null;
  document.getElementById('app').classList.remove('visible');
  document.getElementById('ls').classList.remove('hidden');
  switchToLogin();
  document.getElementById('lu').value = '';
  document.getElementById('lp').value = '';
}

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */

function buildNav() {
  document.getElementById('nuname').textContent = CU.name;
  document.getElementById('nurole').textContent = CU.lbl;
  document.getElementById('navav').textContent  = CU.ini;
  const nt = document.getElementById('ntabs');
  nt.innerHTML = CU.tabs
    .map(t => `<button class="tb" data-tab="${t}">${TAB_DEF[t].i} ${TAB_DEF[t].l}</button>`)
    .join('');
  nt.onclick = e => {
    const b = e.target.closest('[data-tab]');
    if (b) showTab(b.dataset.tab);
  };
}

function showTab(tab) {
  if (!CU || !CU.tabs.includes(tab)) return;
  document.querySelectorAll('.pg').forEach(p => { p.classList.remove('on'); p.style.display='none'; });
  document.querySelectorAll('.tb').forEach(b => b.classList.remove('on'));
  const pg = document.getElementById('pg-'+tab);
  pg.classList.add('on'); pg.style.display = 'flex';
  document.querySelector('[data-tab="'+tab+'"]')?.classList.add('on');
  if      (tab==='orders')    renderOrders();
  else if (tab==='printing')  renderPrinting();
  else if (tab==='storage')   renderStorage();
  else if (tab==='dashboard') renderDash();
}

function initSbToggle(sbId, togId) {
  const sb  = document.getElementById(sbId);
  const tog = document.getElementById(togId);
  if (!sb || !tog) return;
  let collapsed = false;
  tog.onclick = () => { collapsed = !collapsed; sb.classList.toggle('collapsed', collapsed); };
}

/* ══════════════════════════════════════════
   ORDER CARDS & DETAIL
══════════════════════════════════════════ */

function oSquareCard(o) {
  const th = (o.tash||[]).length
    ? '<div class="oc-tash">' +
      (o.tash||[]).slice(0,3).map(t => '<span class="oc-tag">'+esc(t.name||t)+'</span>').join('') +
      '</div>'
    : '';
  return `
    <div class="oc s-${o.status}" data-id="${o.id}">
      <div class="oc-top"><span class="oc-id">#${pad(o.id)}</span>${sbadge(o.status)}</div>
      <div>
        <div class="oc-client">${esc(o.client)}</div>
        <div class="oc-ops">${(o.ops||[]).map(x=>esc(x)).join(' · ')}</div>
      </div>
      <div class="oc-bottom">
        <div class="oc-paper">📄 ${esc(o.pl||'—')}</div>
        <div style="font-size:9px;color:var(--tx4)">${o.date||''}</div>
        ${th}
      </div>
    </div>`;
}

function oDetailHTML(o, mode) {
  const pd = o.paperRows
    ? o.paperRows.map(p => esc(p.label)+(p.dq?' ('+p.dq+')':'')).join(' + ')
    : esc(o.pl||'—');

  let acts = '';
  if (mode==='orders') {
    if (CU?.can?.del) acts += `<button class="btn br sm" data-del="${o.id}">🗑 حذف</button>`;
    acts += `<button class="btn bo sm" id="back-ord-btn">← رجوع</button>`;
  }
  if (mode==='printing') {
    if (o.status==='pending'  && CU?.can?.begin)                              acts += `<button class="btn bge sm" data-begin="${o.id}">▶ بدء</button>`;
    if (o.status==='printing' && CU?.can?.begin && (o.si||0)<STAGES.length-1) acts += `<button class="btn bor sm" data-adv="${o.id}">← التالية</button>`;
    if (o.status==='printing' && CU?.can?.done)                               acts += `<button class="btn bge sm" data-done="${o.id}">✓ إنهاء</button>`;
    if (CU?.can?.del)                                                          acts += `<button class="btn br sm"  data-del2="${o.id}">🗑 حذف</button>`;
    acts += `<button class="btn bo sm" id="back-pr-btn">← رجوع</button>`;
  }

  return `
    <div class="detail-panel">
      <div class="dp-hdr">
        <div>
          <div class="dp-id">#${pad(o.id)} · ${o.date||''}${o.by?' · '+esc(o.by):''}</div>
          <div class="dp-client">${esc(o.client)}</div>
          <div class="dp-sub">${sbadge(o.status)}</div>
        </div>
      </div>
      ${o.status!=='pending' ? stagesHTML(o) : ''}
      <div class="dp-chips">
        <div class="chip"><span class="cl2">الورق</span><span class="cv">${pd}</span></div>
        ${o.sheets ? `<div class="chip"><span class="cl2">الأفرخ</span><span class="cv">${o.sheets}</span></div>`             : ''}
        ${o.pulls  ? `<div class="chip"><span class="cl2">السحبات</span><span class="cv">${esc(String(o.pulls))}</span></div>` : ''}
        ${o.size   ? `<div class="chip"><span class="cl2">المقاس</span><span class="cv">${esc(o.size)}</span></div>`          : ''}
        ${o.colors ? `<div class="chip"><span class="cl2">الألوان</span><span class="cv">${esc(o.colors)}</span></div>`       : ''}
        ${o.ctp    ? `<div class="chip"><span class="cl2">CTP</span><span class="cv">${esc(o.ctp)}</span></div>`              : ''}
        ${o.press  ? `<div class="chip"><span class="cl2">المطبعة</span><span class="cv">${esc(o.press)}</span></div>`        : ''}
      </div>
      ${(o.ops||[]).length
        ? `<div class="dp-sec-t">العمليات</div>${o.ops.map(op=>'<div class="op-item">🔹 '+esc(op)+'</div>').join('')}`
        : ''}
      ${(o.tash||[]).length
        ? `<div class="dp-sec-t" style="margin-top:12px">التشطيب</div>
           <div class="tash-tags">${o.tash.map(t=>'<span class="ttag">'+esc(t.name||t)+(t.note?' · '+esc(t.note):'')+'</span>').join('')}</div>`
        : ''}
      ${o.notes
        ? `<div class="dp-sec-t" style="margin-top:12px">ملاحظات</div><div class="op-item">📝 ${esc(o.notes)}</div>`
        : ''}
      <div class="dp-acts">${acts}</div>
    </div>`;
}

/* ══════════════════════════════════════════
   ORDERS PAGE
══════════════════════════════════════════ */

function renderOrders() {
  const arr = ordersArr();
  const pe  = arr.filter(o=>o.status==='pending').length;
  const pr  = arr.filter(o=>o.status==='printing').length;
  const do_ = arr.filter(o=>o.status==='done').length;

  document.getElementById('sb-stats').innerHTML = `
    <div class="sb-stat"><div class="sb-stat-val">${arr.length}</div><div class="sb-stat-lbl">إجمالي</div></div>
    <div class="sb-stat"><div class="sb-stat-val" style="color:var(--red)">${pr}</div><div class="sb-stat-lbl">طباعة</div></div>
    <div class="sb-stat"><div class="sb-stat-val" style="color:var(--ora)">${pe}</div><div class="sb-stat-lbl">انتظار</div></div>
    <div class="sb-stat"><div class="sb-stat-val" style="color:#22C55E">${do_}</div><div class="sb-stat-lbl">مكتمل</div></div>`;

  const active = arr.filter(o=>o.status!=='done');
  document.getElementById('sb-list').innerHTML = active.length
    ? active.map(o=>`
        <div class="sb-ord s-${o.status}${selOrderId===o.id?' active':''}" data-sbid="${o.id}">
          <div class="sb-ord-id">#${pad(o.id)} ${sbadge(o.status)}</div>
          <div class="sb-ord-cl">${esc(o.client)}</div>
          <div class="sb-ord-meta">${esc((o.ops||[])[0]||'')}</div>
        </div>`).join('')
    : '<div style="color:var(--g5);font-size:11px;padding:5px 4px">لا توجد أوامر نشطة</div>';

  ['pr','pe','do'].forEach(s => {
    const st = {pr:'printing',pe:'pending',do:'done'}[s];
    const os = arr.filter(o=>o.status===st);
    document.getElementById('cnt-'+s).textContent = os.length;
    if (s!=='do' || doneVisible)
      document.getElementById('grid-'+s).innerHTML =
        os.length ? os.map(oSquareCard).join('') : '<div class="empty-card">📭 لا توجد أوامر</div>';
  });

  document.querySelectorAll('#pg-orders .oc').forEach(el =>
    el.classList.toggle('active-card', el.dataset.id===String(selOrderId))
  );
}

function showOrderDetail(id, mode) {
  const o = Object.values(orders).find(x=>x.id===id);
  if (!o) return;
  selOrderId = id;

  if (mode==='orders') {
    document.getElementById('ord-grid-view').style.display = 'none';
    document.getElementById('ord-detail').style.display    = 'block';
    document.getElementById('ord-detail').innerHTML        = oDetailHTML(o,'orders');
    document.getElementById('back-ord-btn').onclick = () => {
      document.getElementById('ord-detail').style.display    = 'none';
      document.getElementById('ord-grid-view').style.display = 'block';
      selOrderId = null; renderOrders();
    };
    renderOrders();
  } else {
    document.getElementById('pr-grid-view').style.display = 'none';
    document.getElementById('pr-detail').style.display    = 'block';
    document.getElementById('pr-detail').innerHTML        = oDetailHTML(o,'printing');
    document.getElementById('back-pr-btn').onclick = () => {
      document.getElementById('pr-detail').style.display    = 'none';
      document.getElementById('pr-grid-view').style.display = 'block';
      selOrderId = null; renderPrinting();
    };
    renderPrinting();
  }
}

function toggleDone() {
  doneVisible = !doneVisible;
  const g   = document.getElementById('grid-do');
  const btn = document.getElementById('done-tog');
  if (doneVisible) {
    g.style.display = 'grid';
    const do_ = ordersArr().filter(o=>o.status==='done');
    g.innerHTML = do_.length ? do_.map(oSquareCard).join('') : '<div class="empty-card">📭 لا توجد أوامر</div>';
    btn.textContent = 'إخفاء';
  } else {
    g.style.display = 'none';
    btn.textContent = 'عرض';
  }
}

/* ══════════════════════════════════════════
   PRINTING PAGE
══════════════════════════════════════════ */

function renderPrinting() {
  const arr = ordersArr();
  const act = arr.filter(o=>o.status==='printing');
  const pnd = arr.filter(o=>o.status==='pending');

  document.getElementById('pr-sb-stats').innerHTML = `
    <div class="sb-stat"><div class="sb-stat-val" style="color:var(--red)">${act.length}</div><div class="sb-stat-lbl">تنفيذ</div></div>
    <div class="sb-stat"><div class="sb-stat-val" style="color:var(--ora)">${pnd.length}</div><div class="sb-stat-lbl">انتظار</div></div>`;

  document.getElementById('pr-sb-active').innerHTML = act.length
    ? act.map(o=>`
        <div class="sb-ord s-printing${selOrderId===o.id?' active':''}" data-prid="${o.id}">
          <div class="sb-ord-id">#${pad(o.id)}</div>
          <div class="sb-ord-cl">${esc(o.client)}</div>
          <div class="sb-ord-meta">${STAGES[o.si||0].i} ${STAGES[o.si||0].l}</div>
        </div>`).join('')
    : '<div style="color:var(--g5);font-size:11px;padding:5px 4px">لا يوجد</div>';

  document.getElementById('pr-sb-pending').innerHTML = pnd.length
    ? pnd.map(o=>`
        <div class="sb-ord s-pending${selOrderId===o.id?' active':''}" data-prid="${o.id}">
          <div class="sb-ord-id">#${pad(o.id)}</div>
          <div class="sb-ord-cl">${esc(o.client)}</div>
        </div>`).join('')
    : '<div style="color:var(--g5);font-size:11px;padding:5px 4px">لا يوجد</div>';

  document.getElementById('cnt-pra').textContent = act.length;
  document.getElementById('cnt-prp').textContent = pnd.length;
  document.getElementById('pgrid-pr').innerHTML  = act.length ? act.map(oSquareCard).join('') : '<div class="empty-card">📭 لا توجد أوامر</div>';
  document.getElementById('pgrid-pe').innerHTML  = pnd.length ? pnd.map(oSquareCard).join('') : '<div class="empty-card">📭 لا توجد أوامر</div>';
}

async function beginJob(numId) {
  if (!CU?.can?.begin) { toast('ليس لديك صلاحية'); return; }
  const fbKey = fbKeyForOrder(numId);
  const o     = orders[fbKey];
  if (!o || o.status!=='pending') return;

  const upd = {};
  if (o.paperRows?.length) {
    for (const pr of o.paperRows) {
      const [cid,iid] = pr.val.split('|');
      const ck   = fbKeyForCat(cid);
      const item = cats[ck]?.items?.[iid];
      if (item && pr.dq > 0) {
        const nq = Math.max(0, item.qty - pr.dq);
        upd[`hd/cats/${ck}/items/${iid}/qty`] = nq;
        if (nq===0)           logAct('out','🚨 نفذت "'+item.name+'" من المخزن');
        else if (nq<item.min) logAct('low','⚠️ "'+item.name+'" منخفضة ('+nq+' '+item.unit+')');
      }
    }
  }
  upd[`hd/orders/${fbKey}/status`]    = 'printing';
  upd[`hd/orders/${fbKey}/si`]        = 1;
  upd[`hd/orders/${fbKey}/startedAt`] = Date.now();

  await db.ref('/').update(upd);
  logAct('new','📋 بدأ #'+pad(numId)+' — "'+o.client+'"');
  toast('▶ بدأ التنفيذ');
}

async function advStage(numId) {
  if (!CU?.can?.begin) { toast('ليس لديك صلاحية'); return; }
  const fbKey = fbKeyForOrder(numId);
  const o     = orders[fbKey];
  if (!o || o.status!=='printing') return;

  const ns = (o.si||0) + 1;
  if (ns >= STAGES.length-1) {
    await db.ref('/').update({
      [`hd/orders/${fbKey}/si`]         : STAGES.length-1,
      [`hd/orders/${fbKey}/status`]     : 'done',
      [`hd/orders/${fbKey}/completedAt`]: Date.now(),
    });
    logAct('done','✅ اكتمل #'+pad(numId)+' — "'+o.client+'"');
    document.getElementById('pr-detail').style.display    = 'none';
    document.getElementById('pr-grid-view').style.display = 'block';
    selOrderId = null;
    toast('✅ اكتمل الأمر');
  } else {
    await db.ref(`hd/orders/${fbKey}/si`).set(ns);
    toast('✓ '+STAGES[ns].l);
    setTimeout(() => showOrderDetail(numId,'printing'), 300);
  }
}

async function doneJob(numId) {
  if (!CU?.can?.done) { toast('ليس لديك صلاحية'); return; }
  const fbKey = fbKeyForOrder(numId);
  const o     = orders[fbKey];
  if (!o || o.status==='done') return;

  await db.ref('/').update({
    [`hd/orders/${fbKey}/status`]     : 'done',
    [`hd/orders/${fbKey}/si`]         : STAGES.length-1,
    [`hd/orders/${fbKey}/completedAt`]: Date.now(),
  });
  logAct('done','✅ اكتمل #'+pad(numId)+' — "'+o.client+'"');
  document.getElementById('pr-detail').style.display    = 'none';
  document.getElementById('pr-grid-view').style.display = 'block';
  selOrderId = null;
  toast('✅ تم الإنهاء');
}

async function delOrder(numId, mode) {
  if (!CU?.can?.del) { toast('ليس لديك صلاحية'); return; }
  if (!confirm('حذف هذا الأمر نهائياً؟')) return;
  const fbKey = fbKeyForOrder(numId);
  const o     = orders[fbKey];
  logAct('del','🗑 حذف #'+pad(numId)+(o?' — "'+o.client+'"':''));
  await db.ref(`hd/orders/${fbKey}`).remove();
  if (mode==='orders') {
    document.getElementById('ord-detail').style.display    = 'none';
    document.getElementById('ord-grid-view').style.display = 'block';
    selOrderId = null;
  } else {
    document.getElementById('pr-detail').style.display    = 'none';
    document.getElementById('pr-grid-view').style.display = 'block';
    selOrderId = null;
  }
  toast('🗑 تم الحذف');
}

/* ══════════════════════════════════════════
   NEW ORDER FORM
══════════════════════════════════════════ */

function showNewForm() {
  if (!CU?.can?.order) { toast('ليس لديك صلاحية'); return; }
  document.getElementById('fnum').textContent  = 'أمر رقم: '+pad(nextON);
  document.getElementById('fdate').textContent = nowDateAr();
  ['f-cl','f-sh','f-pu','f-sz','f-co','f-ct','f-pr','f-no'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('ops-list').innerHTML    = '';
  document.getElementById('paper-list').innerHTML  = '';
  document.getElementById('deduct-prev').innerHTML = '';
  addOp(); addPaper(); buildTashGrid();
  document.querySelectorAll('.pg').forEach(p => { p.classList.remove('on'); p.style.display='none'; });
  document.querySelectorAll('.tb').forEach(b => b.classList.remove('on'));
  const pg = document.getElementById('pg-form');
  pg.classList.add('on'); pg.style.display = 'flex';
}

function addOp() {
  const d  = document.createElement('div'); d.className='opr';
  const ta = document.createElement('textarea'); ta.rows=1; ta.placeholder='وصف العملية…';
  ta.oninput = function(){ this.style.height='auto'; this.style.height=this.scrollHeight+'px'; };
  const rm = document.createElement('button'); rm.type='button'; rm.className='btn br sm';
  rm.style.cssText='padding:4px 8px;flex-shrink:0'; rm.textContent='✕'; rm.onclick=()=>d.remove();
  d.appendChild(ta); d.appendChild(rm);
  document.getElementById('ops-list').appendChild(d);
}

function buildPaperSel(sel) {
  sel.innerHTML = '<option value="">— اختر من المخزن —</option>';
  catsArr().forEach(cat => {
    const items = Object.values(cat.items||{});
    if (!items.length) return;
    const og = document.createElement('optgroup'); og.label=cat.icon+' '+cat.name;
    items.forEach(item => {
      const o = document.createElement('option');
      o.value = cat.id+'|'+item.id;
      o.textContent = item.name+(item.v?' - '+item.v:'')+' ('+item.qty+' '+item.unit+')';
      og.appendChild(o);
    });
    sel.appendChild(og);
  });
}

function addPaper() {
  const d   = document.createElement('div'); d.className='par';
  const sel = document.createElement('select');
  const qty = document.createElement('input'); qty.type='number'; qty.min='0'; qty.placeholder='الكمية'; qty.style.width='75px';
  const rm  = document.createElement('button'); rm.type='button'; rm.className='btn br sm';
  rm.style.cssText='padding:4px 8px;flex-shrink:0'; rm.textContent='✕';
  rm.onclick = () => { d.remove(); updDeduct(); };
  buildPaperSel(sel); sel.onchange=updDeduct; qty.oninput=updDeduct;
  d.appendChild(sel); d.appendChild(qty); d.appendChild(rm);
  document.getElementById('paper-list').appendChild(d);
}

function updDeduct() {
  const rows = [...document.querySelectorAll('.par')];
  const prev = [];
  rows.forEach(r => {
    const pv = r.querySelector('select')?.value; if (!pv) return;
    const item = getItem(pv); if (!item) return;
    const dq    = parseInt(r.querySelector('input[type=number]').value)||0;
    const after = item.qty - dq;
    prev.push(
      '<div class="dr">' +
      '<span>'+esc(item.name)+(item.v?' - '+esc(item.v):'')+' ('+esc(item.unit)+')</span>' +
      '<span class="'+(after<0||after<item.min?'dw':'dok')+'">' +
      item.qty+' → '+Math.max(0,after)+(after<0?' ⚠ لا يكفي':after<item.min?' ⚠ منخفض':' ✓') +
      '</span></div>'
    );
  });
  document.getElementById('deduct-prev').innerHTML = prev.length
    ? '<div class="db"><div class="dt2">📊 معاينة الخصم</div>'+prev.join('')+'</div>'
    : '';
}

function buildTashGrid() {
  const wrap = document.getElementById('tash-grid'); wrap.innerHTML='<div class="tw"></div>';
  const g = wrap.querySelector('.tw');
  TASH.forEach(t => {
    const div = document.createElement('div'); div.className='ti'; div.dataset.tash=t;
    const top = document.createElement('div'); top.className='ti-t';
    const chk = document.createElement('input'); chk.type='checkbox'; chk.className='ti-c'; chk.setAttribute('tabindex','-1');
    const lbl = document.createElement('label'); lbl.className='ti-l'; lbl.textContent=t;
    const nw  = document.createElement('div'); nw.className='ti-n';
    const ta  = document.createElement('textarea'); ta.rows=2; ta.placeholder='ملاحظة…';
    ta.onclick = e => e.stopPropagation();
    nw.appendChild(ta); top.appendChild(chk); top.appendChild(lbl); div.appendChild(top); div.appendChild(nw);
    div.onclick = e => {
      if (e.target.tagName==='TEXTAREA') return;
      const on = !div.classList.contains('on'); div.classList.toggle('on',on); chk.checked=on;
    };
    g.appendChild(div);
  });
}

function getTash() {
  const res = [];
  document.querySelectorAll('.ti.on').forEach(div => {
    const ta = div.querySelector('textarea');
    res.push({name:div.dataset.tash, note:ta?ta.value.trim():''});
  });
  return res;
}

async function submitOrder() {
  if (!CU?.can?.order) { toast('ليس لديك صلاحية'); return; }
  const client = (document.getElementById('f-cl').value||'').trim();
  if (!client) { toast('⚠ أدخل اسم العميل'); return; }

  const ops = [...document.querySelectorAll('#ops-list textarea')].map(t=>t.value.trim()).filter(Boolean);
  if (!ops.length) { toast('⚠ أدخل عملية واحدة على الأقل'); return; }

  const paperRows = [];
  for (const r of [...document.querySelectorAll('.par')]) {
    const pv = r.querySelector('select')?.value; if (!pv) continue;
    const item = getItem(pv); if (!item) continue;
    const dq = parseInt(r.querySelector('input[type=number]').value)||0;
    if (dq===0) continue;
    paperRows.push({val:pv, label:item.name+(item.v?' - '+item.v:''), dq});
  }
  if (!paperRows.length) { toast('⚠ أضف نوع الورق والكمية'); return; }

  let ordNum = nextON;
  await db.ref('hd/counter').transaction(cur => { ordNum=(cur||0)+1; return ordNum; });

  const o = {
    id     : ordNum,
    date   : nowDateAr(),
    ts     : Date.now(),
    client,
    by     : CU.name,
    ops,
    paperRows,
    pl     : paperRows.map(p=>p.label).join(' + '),
    sheets : parseInt(document.getElementById('f-sh').value)||0,
    pulls  : (document.getElementById('f-pu').value||'').trim(),
    size   : (document.getElementById('f-sz').value||'').trim(),
    colors : (document.getElementById('f-co').value||'').trim(),
    ctp    : (document.getElementById('f-ct').value||'').trim(),
    press  : (document.getElementById('f-pr').value||'').trim(),
    notes  : (document.getElementById('f-no').value||'').trim(),
    tash   : getTash(),
    status : 'pending',
    si     : 0,
  };

  await db.ref('hd/orders').push(o);
  logAct('new','📋 #'+pad(ordNum)+' — "'+client+'" · '+ops.slice(0,2).join('، '));
  toast('✅ تم إرسال أمر الشغل');
  showTab('orders');
}

/* ══════════════════════════════════════════
   STORAGE PAGE
══════════════════════════════════════════ */

function renderStorage() {
  const canM   = !!CU?.can?.storage;
  const canCat = !!CU?.can?.cat;
  const addBtn = document.getElementById('add-cat-btn');
  if (addBtn) addBtn.style.display = canCat ? '' : 'none';

  const allI = catsArr().flatMap(c=>Object.values(c.items||{}));
  const out  = allI.filter(i=>i.qty===0).length;
  const low  = allI.filter(i=>i.qty>0&&i.qty<i.min).length;
  const ok   = allI.filter(i=>i.qty>=i.min).length;

  document.getElementById('skpi').innerHTML = `
    <div class="sk"><div class="ski">📦</div><div><div class="skv">${allI.length}</div><div class="skl">إجمالي الأصناف</div></div></div>
    <div class="sk"><div class="ski" style="color:var(--grn)">✅</div><div><div class="skv" style="color:var(--grn)">${ok}</div><div class="skl">متوفر جيد</div></div></div>
    <div class="sk"><div class="ski" style="color:var(--ora-d)">⚠️</div><div><div class="skv" style="color:var(--ora-d)">${low}</div><div class="skl">منخفضة</div></div></div>
    <div class="sk"><div class="ski" style="color:var(--red)">🚨</div><div><div class="skv" style="color:var(--red)">${out}</div><div class="skl">نفذت</div></div></div>`;

  const cgv = document.getElementById('cat-grid-view');
  const cdt = document.getElementById('cat-detail');

  if (openCatId) {
    cgv.style.display='none'; cdt.style.display='block';
    renderCatDetail(openCatId, canM, canCat);
    return;
  }

  cgv.style.display='block'; cdt.style.display='none'; cdt.innerHTML='';

  const q    = (document.getElementById('s-search').value||'').toLowerCase().trim();
  const grid = document.getElementById('cat-grid'); grid.innerHTML='';

  catsArr().forEach(cat => {
    const items = Object.values(cat.items||{});
    const fit   = q ? items.filter(i=>(i.name+i.v+(i.loc||'')).toLowerCase().includes(q)) : items;
    if (q && !fit.length) return;
    const outC = fit.filter(i=>i.qty===0).length;
    const lowC = fit.filter(i=>i.qty>0&&i.qty<i.min).length;
    const okC  = fit.length-outC-lowC;
    const card = document.createElement('div'); card.className='cat-card';
    card.innerHTML = `
      <div class="cat-card-top">
        <div class="cat-stripe" style="background:${cat.color}"></div>
        <div class="cat-icon-wrap" style="background:${cat.color}22;border-color:${cat.color}44">${cat.icon}</div>
        <div class="cat-name">${esc(cat.name)}</div>
        <div class="cat-meta">${fit.length} صنف</div>
      </div>
      <div class="cat-badges">
        ${okC >0?'<span class="badge bok">✓ '+okC +'</span>':''}
        ${lowC>0?'<span class="badge blow">⚠ '+lowC+'</span>':''}
        ${outC>0?'<span class="badge bout">✕ '+outC+'</span>':''}
      </div>`;
    card.onclick = () => { openCatId=cat.id; renderStorage(); };
    grid.appendChild(card);
  });
  if (!grid.children.length)
    grid.innerHTML='<div class="empty-card" style="grid-column:1/-1">📭 لا توجد نتائج</div>';
}

function renderCatDetail(catId, canM, canCat) {
  const ck  = fbKeyForCat(catId);
  const cat = cats[ck];
  if (!cat) { openCatId=null; renderStorage(); return; }

  const det   = document.getElementById('cat-detail'); det.innerHTML='';
  const items = Object.values(cat.items||{});
  let iH = '';

  items.forEach(item => {
    const isOut = item.qty===0;
    const isLow = item.qty>0 && item.qty<item.min;
    const bc    = isOut ? 'var(--red)' : isLow ? 'var(--ora-d)' : 'var(--grn)';
    const pct   = item.min>0 ? Math.min(100,Math.round(item.qty/item.min*100)) : 100;
    const badge = isOut
      ? '<span class="badge bout">نفذت</span>'
      : isLow ? '<span class="badge blow">منخفضة</span>' : '<span class="badge bok">متوفر</span>';
    iH += `
      <div class="item-row">
        <div class="item-info">
          <div class="item-name-t">${esc(item.name)}${item.v?` <span style="color:var(--tx3);font-size:12px;font-weight:600">— ${esc(item.v)}</span>`:''}</div>
          ${item.loc?`<div class="item-loc">📍 ${esc(item.loc)}</div>`:''}
          <div style="margin-top:4px">${badge}</div>
        </div>
        <div class="item-qty-col">
          <div class="item-qty-v" style="color:${bc}">${item.qty}</div>
          <div class="item-qty-u">${esc(item.unit)}</div>
          <div class="item-qty-bar"><div class="item-qty-fill" style="width:${pct}%;background:${bc}"></div></div>
          <div class="item-qty-min">حد: ${item.min}</div>
        </div>
        <div class="item-acts">
          ${canM  ?`<button class="btn bg xs" data-editqty="${catId}|${item.id}">✏ تعديل</button>`:''}
          ${canCat?`<button class="btn br xs" data-delitem="${catId}|${item.id}">✕</button>`:''}
        </div>
      </div>`;
  });

  let addH = '';
  if (canM) {
    addH = `
      <div class="add-item-fc">
        <div class="add-item-title">➕ إضافة صنف جديد لـ "${esc(cat.name)}"</div>
        <div class="aig">
          <div class="aif" style="grid-column:span 2"><label>الاسم *</label><input data-an placeholder="اسم الصنف…"/></div>
          <div class="aif"><label>المواصفة</label><input data-av placeholder="80 جرام…"/></div>
          <div class="aif"><label>الكمية</label><input data-aq type="number" min="0" placeholder="0"/></div>
          <div class="aif"><label>الوحدة</label><input data-au placeholder="رزمة"/></div>
          <div class="aif"><label>الحد الأدنى</label><input data-am type="number" min="0" placeholder="10"/></div>
          <div class="aif"><label>الموقع</label><input data-al placeholder="رف A-2"/></div>
        </div>
        <div style="display:flex;gap:7px">
          <button class="btn bg sm" id="do-add-item">➕ إضافة</button>
          ${canCat?'<button class="btn br sm" id="do-del-cat">🗑 حذف القسم</button>':''}
        </div>
      </div>`;
  }

  det.innerHTML = `
    <div class="detail-panel">
      <div class="dp-hdr">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:56px;height:56px;border-radius:13px;background:${cat.color}22;border:2px solid ${cat.color}44;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">${cat.icon}</div>
          <div>
            <div class="dp-id">قسم المخزن</div>
            <div class="dp-client">${esc(cat.name)}</div>
            <div class="dp-sub"><span class="badge bp">${items.length} صنف</span></div>
          </div>
        </div>
        <button class="btn bo sm" id="back-cat-btn">← رجوع</button>
      </div>
      <div class="dp-chips">
        <div class="chip"><span class="cl2">الأصناف</span><span class="cv">${items.length}</span></div>
        <div class="chip"><span class="cl2">متوفر</span><span class="cv" style="color:var(--grn)">${items.filter(i=>i.qty>=i.min).length}</span></div>
        <div class="chip"><span class="cl2">منخفضة</span><span class="cv" style="color:var(--ora-d)">${items.filter(i=>i.qty>0&&i.qty<i.min).length}</span></div>
        <div class="chip"><span class="cl2">نفذت</span><span class="cv" style="color:var(--red)">${items.filter(i=>i.qty===0).length}</span></div>
      </div>
    </div>
    <div class="item-fc">
      <div class="item-fc-hdr">
        <div style="font-size:14px;font-weight:900">📋 الأصناف</div>
        <span class="sec-cnt">${items.length}</span>
      </div>
      ${items.length ? iH : '<div class="empty-card">📭 لا توجد أصناف</div>'}
    </div>
    ${addH}`;

  det.querySelector('#back-cat-btn').onclick = () => { openCatId=null; renderStorage(); };
  det.querySelectorAll('[data-editqty]').forEach(btn =>
    btn.onclick = () => { const p=btn.dataset.editqty.split('|'); openQtyModal(p[0],p[1]); }
  );
  det.querySelectorAll('[data-delitem]').forEach(btn =>
    btn.onclick = () => { const p=btn.dataset.delitem.split('|'); delItem(p[0],p[1]); }
  );
  det.querySelector('#do-add-item')?.addEventListener('click', () => quickAdd(catId, det));
  det.querySelector('#do-del-cat')?.addEventListener('click',  () => deleteCat(catId));
}

async function quickAdd(catId, container) {
  const ck   = fbKeyForCat(catId);
  const cat  = cats[ck]; if (!cat) return;
  const name = (container.querySelector('[data-an]')?.value||'').trim();
  if (!name) { toast('⚠ أدخل اسم الصنف'); return; }
  const unit   = (container.querySelector('[data-au]')?.value||'').trim() || 'رزمة';
  const newQty = parseInt(container.querySelector('[data-aq]')?.value)||0;
  const iid    = 'i'+Date.now();
  const item   = {
    id  : iid, name,
    v   : (container.querySelector('[data-av]')?.value||'').trim(),
    qty : newQty,
    min : parseInt(container.querySelector('[data-am]')?.value)||0,
    unit,
    loc : (container.querySelector('[data-al]')?.value||'').trim(),
  };
  await db.ref(`hd/cats/${ck}/items/${iid}`).set(item);
  if (newQty>0) logAct('restock','📦 استلام "'+name+'" — '+newQty+' '+unit+' ('+cat.name+')');
  toast('✅ تمت إضافة الصنف');
}

async function delItem(catId, itemId) {
  const ck   = fbKeyForCat(catId);
  const cat  = cats[ck]; if (!cat) return;
  const item = cat.items?.[itemId];
  if (!confirm('حذف "'+(item?.name||'الصنف')+'"؟')) return;
  await db.ref(`hd/cats/${ck}/items/${itemId}`).remove();
  toast('تم حذف الصنف');
}

async function deleteCat(catId) {
  const ck  = fbKeyForCat(catId);
  const cat = cats[ck]; if (!cat) return;
  if (!confirm('حذف قسم "'+cat.name+'" وجميع أصنافه؟')) return;
  await db.ref(`hd/cats/${ck}`).remove();
  openCatId=null; toast('تم حذف القسم');
}

function openCatModal() {
  if (!CU?.can?.cat) { toast('ليس لديك صلاحية'); return; }
  document.getElementById('mc-name').value = '';
  selColor='#D71920'; selIcon='📦';
  document.getElementById('ico-grid').innerHTML =
    ICONS.map(ic=>`<div class="io${ic===selIcon?' on':''}" data-icon="${ic}">${ic}</div>`).join('');
  document.querySelectorAll('.ci').forEach(el => el.classList.toggle('on', el.dataset.c===selColor));
  openModal('m-cat');
}

async function confirmAddCat() {
  const name = (document.getElementById('mc-name').value||'').trim();
  if (!name) { toast('⚠ أدخل اسم القسم'); return; }
  const cid = 'c'+Date.now();
  await db.ref(`hd/cats/${cid}`).set({id:cid, name, icon:selIcon, color:selColor, items:{}});
  closeModal('m-cat'); toast('✅ تمت إضافة القسم');
}

function openQtyModal(catId, itemId) {
  const ck   = fbKeyForCat(catId);
  const cat  = cats[ck];
  const item = cat?.items?.[itemId]; if (!item) return;
  qState = {cid:catId, iid:itemId, mode:'add'};
  document.getElementById('mq-ti').textContent = item.name+(item.v?' — '+item.v:'');
  document.getElementById('mq-sb').textContent = cat.name+' · الحالي: '+item.qty+' '+item.unit;
  document.getElementById('mq-q').value = '';
  document.getElementById('mq-r').value = '';
  document.getElementById('mq-c').textContent = item.qty+' '+item.unit;
  document.getElementById('mq-n').textContent = '—';
  setQM('add'); openModal('m-qty');
}

function setQM(m) {
  qState.mode = m;
  document.getElementById('mq-lbl').textContent =
    {add:'الكمية المضافة', sub:'الكمية المخصومة', set:'الكمية الجديدة'}[m];
  ['add','sub','set'].forEach(x =>
    document.getElementById('qm-'+x).className = 'qm'+(m===x?' '+x:'')
  );
  updQPrev();
}

function updQPrev() {
  const ck   = fbKeyForCat(qState.cid);
  const item = cats[ck]?.items?.[qState.iid]; if (!item) return;
  const v    = parseInt(document.getElementById('mq-q').value)||0;
  const r    = qState.mode==='add' ? item.qty+v : qState.mode==='sub' ? Math.max(0,item.qty-v) : Math.max(0,v);
  const el   = document.getElementById('mq-n');
  el.textContent = r+' '+item.unit;
  el.style.color = r<item.min ? 'var(--red)' : 'var(--ora-d)';
}

async function confirmQAdj() {
  const ck   = fbKeyForCat(qState.cid);
  const cat  = cats[ck];
  const item = cat?.items?.[qState.iid]; if (!item) return;
  const v    = parseInt(document.getElementById('mq-q').value)||0;
  const rsn  = document.getElementById('mq-r').value.trim();
  const old  = item.qty;
  let nq = old;
  if      (qState.mode==='add') nq = old+v;
  else if (qState.mode==='sub') nq = Math.max(0,old-v);
  else                          nq = Math.max(0,v);

  if (qState.mode==='add' && v>0)        logAct('restock','📦 إضافة '+v+' '+item.unit+' لـ "'+item.name+'"'+(rsn?' · '+rsn:''));
  if (nq===0 && old>0)                   logAct('out','🚨 نفذت "'+item.name+'" من مخزن '+cat.name);
  else if (nq<item.min && old>=item.min) logAct('low','⚠️ "'+item.name+'" انخفضت عن الحد ('+nq+' '+item.unit+')');

  await db.ref(`hd/cats/${ck}/items/${qState.iid}/qty`).set(nq);
  closeModal('m-qty'); toast('✅ تم تحديث الكمية');
}

/* ══════════════════════════════════════════
   COLLAPSIBLE SUMMARY CARD
══════════════════════════════════════════ */

function makeSummCard(opts) {
  const wrap = document.createElement('div'); wrap.className='summ-card';

  const top = document.createElement('div'); top.className='summ-top';
  top.innerHTML = `
    <div class="summ-icon" style="background:${opts.iconBg};border-color:${opts.iconBorder};color:${opts.iconColor}">${opts.icon}</div>
    <div class="summ-info">
      <div class="summ-count" style="color:${opts.countColor}">${opts.count}</div>
      <div class="summ-label">${opts.label}</div>
      <div class="summ-hint"><span class="summ-arrow">▼</span> ${opts.hint}</div>
    </div>`;
  wrap.appendChild(top);

  const br = document.createElement('div'); br.className='summ-badges'; br.innerHTML=opts.badges.join('');
  wrap.appendChild(br);

  const body = document.createElement('div'); body.className='summ-body';
  const bh   = document.createElement('div'); bh.className='summ-body-header';
  bh.innerHTML = `<div class="summ-body-title">${opts.bodyTitle}</div><button class="btn bo sm summ-close-btn">↑ إغلاق</button>`;
  body.appendChild(bh);
  const bi = document.createElement('div'); bi.className='summ-body-inner'; bi.appendChild(opts.body);
  body.appendChild(bi);
  wrap.appendChild(body);

  let open = false;
  const toggle = () => {
    open = !open;
    body.classList.toggle('on', open);
    const arr = top.querySelector('.summ-arrow'); if (arr) arr.style.transform=open?'rotate(180deg)':'';
    const hn  = top.querySelector('.summ-hint');
    if (hn) { const t=hn.lastChild; if (t&&t.nodeType===3) t.textContent=' '+(open?'اضغط للإغلاق':opts.hint); }
  };
  top.onclick = toggle;
  br.onclick  = toggle;
  body.querySelector('.summ-close-btn').onclick = e => { e.stopPropagation(); open=true; toggle(); };
  return wrap;
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */

function renderDash() {
  const arr  = ordersArr();
  const allI = catsArr().flatMap(c=>Object.values(c.items||{}));
  const tot  = arr.length;
  const pe   = arr.filter(o=>o.status==='pending').length;
  const pr   = arr.filter(o=>o.status==='printing').length;
  const do_  = arr.filter(o=>o.status==='done').length;
  const out  = allI.filter(i=>i.qty===0).length;
  const clients = new Set(arr.map(o=>o.client)).size;
  const rate    = tot ? Math.round(do_/tot*100) : 0;

  /* KPIs */
  document.getElementById('dkpis').innerHTML = [
    {i:'📋',v:tot,    l:'إجمالي الأوامر', c:'var(--ora)'},
    {i:'🖨',v:pr,     l:'قيد الطباعة',    c:'var(--red)'},
    {i:'⏳',v:pe,     l:'في الانتظار',     c:'var(--ora-d)'},
    {i:'✅',v:do_,    l:'مكتمل',           c:'var(--grn)', t:rate?rate+'%':''},
    {i:'🚨',v:out,    l:'نفذت كميتها',     c:'var(--red)'},
    {i:'👥',v:clients,l:'عملاء',           c:'var(--blu)'},
  ].map(k=>`
    <div class="dk">
      <div class="dkb" style="background:${k.c}"></div>
      <div class="dki">${k.i}</div>
      <div class="dkv" style="color:${k.c}">${k.v}</div>
      <div class="dkl">${k.l}</div>
      ${k.t?`<div style="font-size:11px;font-weight:800;color:${k.c};margin-top:2px">${k.t}</div>`:''}
    </div>`).join('');

  /* Clients */
  const cc = {};
  arr.forEach(o => cc[o.client]=(cc[o.client]||0)+1);
  const topC = Object.entries(cc).sort((a,b)=>b[1]-a[1]);
  const maxC = topC[0] ? topC[0][1] : 1;
  const cGrid = document.createElement('div'); cGrid.className='cl-grid';
  topC.forEach((en,i) => {
    const color  = DCOLS[i%DCOLS.length];
    const pOrds  = arr.filter(o=>o.client===en[0]);
    const doneC  = pOrds.filter(o=>o.status==='done').length;
    const printC = pOrds.filter(o=>o.status==='printing').length;
    const pendC  = pOrds.filter(o=>o.status==='pending').length;
    const pct    = Math.round(en[1]/maxC*100);
    const card   = document.createElement('div'); card.className='cl-card';
    card.innerHTML = `
      <div class="cl-stripe" style="background:${color}"></div>
      <div class="cl-card-top">
        <div class="cl-avatar" style="background:${color}22;border-color:${color}55;color:${color}">${esc(en[0].charAt(0))}</div>
        <div class="cl-name">${esc(en[0])}</div>
      </div>
      <div class="cl-card-bottom">
        <div class="cl-total" style="color:${color}">${en[1]}</div>
        <div class="cl-unit">أمر إجمالي</div>
        <div class="cl-bar"><div class="cl-bar-fill" style="width:${pct}%;background:${color}"></div></div>
        <div class="cl-badges">
          ${printC?`<span class="badge bpr" style="font-size:9px;padding:2px 6px">🖨 ${printC}</span>`:''}
          ${pendC ?`<span class="badge bp"  style="font-size:9px;padding:2px 6px">⏳ ${pendC}</span>` :''}
          ${doneC ?`<span class="badge bd2" style="font-size:9px;padding:2px 6px">✅ ${doneC}</span>` :''}
        </div>
      </div>`;
    card.onclick = () => showTab('orders');
    cGrid.appendChild(card);
  });
  if (!topC.length) cGrid.innerHTML='<div class="empty-card" style="grid-column:1/-1">📭 لا توجد بيانات</div>';
  const dgC = document.getElementById('dg-clients'); dgC.innerHTML='';
  dgC.appendChild(makeSummCard({
    icon:'👥', iconBg:'var(--blu-bg)', iconBorder:'var(--blu-bd)', iconColor:'var(--blu)',
    count:topC.length, countColor:'var(--blu)',
    label:'إجمالي العملاء', hint:'اضغط لعرض قائمة العملاء',
    badges:[
      `<span class="badge bp">📋 ${arr.length} أمر</span>`,
      `<span class="badge bd2">✅ ${do_} مكتمل</span>`,
      `<span class="badge bpr">🖨 ${pr} طباعة</span>`,
    ],
    bodyTitle:`قائمة العملاء (${topC.length})`, body:cGrid,
  }));

  /* Active orders */
  const actO = arr.filter(o=>o.status!=='done');
  const tbl  = document.createElement('div');
  tbl.innerHTML = actO.length
    ? `<div style="overflow-x:auto"><table class="at">
        <thead><tr><th>رقم</th><th>العميل</th><th>الورق</th><th>المرحلة</th><th>الحالة</th></tr></thead>
        <tbody>${actO.map(o => {
          const st = STAGES[o.si||0];
          return `<tr style="cursor:pointer" data-go="${o.id}">
            <td style="font-weight:800">#${pad(o.id)}</td>
            <td style="font-weight:800">${esc(o.client)}</td>
            <td>${esc(o.pl||'—')}</td>
            <td>${st.i} ${st.l}</td>
            <td>${sbadge(o.status)}</td>
          </tr>`;
        }).join('')}</tbody>
      </table></div>`
    : '<div style="color:var(--tx3);font-weight:700;text-align:center;padding:8px 0">لا توجد أوامر نشطة</div>';
  tbl.querySelectorAll('[data-go]').forEach(tr =>
    tr.onclick = () => { showTab('orders'); setTimeout(()=>showOrderDetail(parseInt(tr.dataset.go),'orders'),60); }
  );
  const dgAO = document.getElementById('dg-active-orders'); dgAO.innerHTML='';
  dgAO.appendChild(makeSummCard({
    icon:'📋', iconBg:'var(--ora-bg)', iconBorder:'var(--ora-bd)', iconColor:'var(--ora-d)',
    count:actO.length, countColor:'var(--ora-d)',
    label:'الأوامر النشطة', hint:'اضغط لعرض الأوامر',
    badges:[
      `<span class="badge bpr">🖨 ${pr} طباعة</span>`,
      `<span class="badge bp">⏳ ${pe} انتظار</span>`,
      `<span class="badge bd2">✅ ${do_} مكتمل</span>`,
    ],
    bodyTitle:`الأوامر النشطة (${actO.length})`, body:tbl,
  }));

  /* Activity log */
  const logGrid = document.createElement('div'); logGrid.className='al-grid';
  if (actLog.length) {
    actLog.forEach(a => {
      const m        = ACT_META[a.type]||{icon:'📌',color:'var(--tx4)',label:'نشاط'};
      const card     = document.createElement('div');
      const ordMatch = a.txt.match(/#(\d+)/);
      const isNav    = !!(ordMatch || a.type==='out' || a.type==='low' || a.type==='restock');
      card.className = 'al-card'+(isNav?' clickable':'');
      card.innerHTML = `
        <div class="al-stripe" style="background:${m.color}"></div>
        <div class="al-icon-wrap" style="background:${m.color}22;border-color:${m.color}44">${m.icon}</div>
        <div style="flex:1">
          <div class="al-label" style="color:${m.color}">${m.label}</div>
          <div class="al-txt">${esc(a.txt)}</div>
        </div>
        <div class="al-time">🕐 ${a.time}</div>`;
      if (ordMatch) {
        card.onclick = () => {
          const id = parseInt(ordMatch[1]);
          if (Object.values(orders).find(x=>x.id===id)) {
            showTab('orders'); setTimeout(()=>showOrderDetail(id,'orders'),60);
          }
        };
      } else if (a.type==='out'||a.type==='low'||a.type==='restock') {
        card.onclick = () => showTab('storage');
      }
      logGrid.appendChild(card);
    });
  } else {
    logGrid.innerHTML='<div style="color:var(--tx3);font-weight:700;text-align:center;padding:8px 0">📭 لا توجد أحداث مسجّلة بعد</div>';
  }
  const dgLog = document.getElementById('dg-activity-log'); dgLog.innerHTML='';
  dgLog.appendChild(makeSummCard({
    icon:'🕐', iconBg:'var(--grn-bg)', iconBorder:'var(--grn-bd)', iconColor:'var(--grn)',
    count:actLog.length, countColor:'var(--grn)',
    label:'سجل النشاط', hint:'اضغط لعرض السجل',
    badges:[
      `<span class="badge bd2">✅ ${actLog.filter(a=>a.type==='done').length} اكتمال</span>`,
      `<span class="badge bp">📋 ${actLog.filter(a=>a.type==='new').length} أمر جديد</span>`,
      `<span class="badge bout">🚨 ${actLog.filter(a=>a.type==='out'||a.type==='low').length} تنبيه</span>`,
    ],
    bodyTitle:`آخر الأحداث (${actLog.length})`, body:logGrid,
  }));
}

/* ══════════════════════════════════════════
   WIRE ALL EVENTS
══════════════════════════════════════════ */

/* Login / Signup */
document.getElementById('lbtn').onclick        = doLogin;
document.getElementById('su-btn').onclick      = doSignup;
document.getElementById('goto-signup').onclick = switchToSignup;
document.getElementById('goto-login').onclick  = switchToLogin;
document.getElementById('lp').onkeydown        = e => { if (e.key==='Enter') doLogin(); };
document.getElementById('lu').onkeydown        = e => { if (e.key==='Enter') document.getElementById('lp').focus(); };
document.getElementById('su-pw2').onkeydown    = e => { if (e.key==='Enter') doSignup(); };

/* App nav */
document.getElementById('obtn').onclick     = doLogout;
document.getElementById('new-btn').onclick  = showNewForm;
document.getElementById('done-tog').onclick = e => { e.stopPropagation(); toggleDone(); };

/* Form */
document.getElementById('add-op').onclick  = addOp;
document.getElementById('add-pa').onclick  = addPaper;
document.getElementById('sub-btn').onclick = submitOrder;
document.getElementById('can-btn').onclick = () => showTab('orders');

/* Storage */
document.getElementById('s-search').oninput   = () => { openCatId=null; renderStorage(); };
document.getElementById('add-cat-btn').onclick = openCatModal;

/* Category modal */
document.getElementById('conf-cat').onclick = confirmAddCat;
document.getElementById('cls-cat').onclick  = () => closeModal('m-cat');
document.getElementById('ico-grid').onclick = e => {
  const o = e.target.closest('[data-icon]'); if (!o) return;
  selIcon = o.dataset.icon;
  document.querySelectorAll('.io').forEach(el => el.classList.remove('on'));
  o.classList.add('on');
};
document.querySelectorAll('.ci').forEach(el =>
  el.onclick = () => {
    selColor = el.dataset.c;
    document.querySelectorAll('.ci').forEach(e => e.classList.remove('on'));
    el.classList.add('on');
  }
);

/* Qty modal */
document.getElementById('qm-add').onclick   = () => setQM('add');
document.getElementById('qm-sub').onclick   = () => setQM('sub');
document.getElementById('qm-set').onclick   = () => setQM('set');
document.getElementById('mq-q').oninput     = updQPrev;
document.getElementById('conf-qty').onclick = confirmQAdj;
document.getElementById('cls-qty').onclick  = () => closeModal('m-qty');

/* Orders grids */
['grid-pr','grid-pe','grid-do'].forEach(gid => {
  document.getElementById(gid).onclick = e => {
    const c = e.target.closest('.oc'); if (c) showOrderDetail(parseInt(c.dataset.id),'orders');
  };
});
document.getElementById('sb-list').onclick = e => {
  const b = e.target.closest('[data-sbid]'); if (b) showOrderDetail(parseInt(b.dataset.sbid),'orders');
};
document.getElementById('ord-detail').onclick = e => {
  const d = e.target.closest('[data-del]'); if (d) delOrder(parseInt(d.dataset.del),'orders');
};

/* Printing grids */
['pgrid-pr','pgrid-pe'].forEach(gid => {
  document.getElementById(gid).onclick = e => {
    const c = e.target.closest('.oc'); if (c) showOrderDetail(parseInt(c.dataset.id),'printing');
  };
});
document.getElementById('pr-sb-active').onclick = e => {
  const b = e.target.closest('[data-prid]'); if (b) showOrderDetail(parseInt(b.dataset.prid),'printing');
};
document.getElementById('pr-sb-pending').onclick = e => {
  const b = e.target.closest('[data-prid]'); if (b) showOrderDetail(parseInt(b.dataset.prid),'printing');
};
document.getElementById('pr-detail').onclick = e => {
  const b  = e.target.closest('[data-begin]');
  const a  = e.target.closest('[data-adv]');
  const d  = e.target.closest('[data-done]');
  const d2 = e.target.closest('[data-del2]');
  if (b)       beginJob(parseInt(b.dataset.begin));
  else if (a)  advStage(parseInt(a.dataset.adv));
  else if (d)  doneJob(parseInt(d.dataset.done));
  else if (d2) delOrder(parseInt(d2.dataset.del2),'printing');
};

/* Modals — close on backdrop or Escape */
document.querySelectorAll('.mo').forEach(m =>
  m.onclick = e => { if (e.target===m) m.classList.remove('op'); }
);
document.onkeydown = e => {
  if (e.key==='Escape') document.querySelectorAll('.mo.op').forEach(m => m.classList.remove('op'));
};

/* Sidebar toggles */
initSbToggle('ord-sb','ord-sb-toggle');
initSbToggle('pr-sb', 'pr-sb-toggle');