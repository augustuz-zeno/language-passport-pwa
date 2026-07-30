/* ================= STATE ================= */
let currentView    = 'home';
let currentSubView = 'hira';
let lastMainTab    = null;
let lastSubTab     = null;
let doAnimate      = false; // true = show cube wave on next render

/* ================= THEME ================= */
let isLightTheme = localStorage.getItem('theme') === 'light';
if (isLightTheme) document.documentElement.classList.add('light-theme');

function toggleTheme() {
  isLightTheme = !isLightTheme;
  document.documentElement.classList.toggle('light-theme', isLightTheme);
  localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
  render();
}

/* ================= DATA ================= */
const CATEGORIES = [
  { id: 'tr', title: 'Турецкий',   desc: '29 букв. Латиница.' },
  { id: 'uk', title: 'Украинский', desc: '33 буквы. Кириллица.' },
  { id: 'de', title: 'Немецкий',   desc: '30 букв, умлауты и эсцет. Латиница.' },
  { id: 'ja', title: 'Японский',   desc: 'Хирагана, Катакана, Кандзи.' }
];

const JA_CATEGORIES = [
  { id: 'hira',  title: 'Хирагана' },
  { id: 'kata',  title: 'Катакана' },
  { id: 'kanji', title: 'Кандзи'   }
];

/* ================= TAB BARS ================= */
function getTabBar() {
  const tabs = CATEGORIES.map(cat =>
    `<button class="tab-btn ${currentView === cat.id ? 'active' : ''}" onclick="setView('${cat.id}')">${cat.title}</button>`
  ).join('');
  return `<div class="tab-bar-scroll"><div class="tab-bar" id="main-tabs"><div class="tab-indicator"></div>${tabs}</div></div>`;
}

function getJaTabBar() {
  const tabs = JA_CATEGORIES.map(cat =>
    `<button class="tab-btn ${currentSubView === cat.id ? 'active' : ''}" onclick="setSubView('${cat.id}')">${cat.title}</button>`
  ).join('');
  return `<div class="nav-row"><div class="tab-bar-scroll"><div class="tab-bar" id="sub-tabs"><div class="tab-indicator"></div>${tabs}</div></div></div>`;
}

/* ================= RENDER ================= */
function render() {
  const app = document.getElementById('app');

  const moonSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  const sunSvg  = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  const header = `
    <header>
      <div class="title-block" onclick="setView('home')" style="cursor:pointer" title="На главную">
        <h1>Языковой <span class="accent">passport</span></h1>
        <p class="subtitle">Изучай алфавиты легко и быстро</p>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()" aria-label="Переключить тему">
        ${isLightTheme ? moonSvg : sunSvg}
      </button>
    </header>
  `;

  let body = '';

  if (currentView === 'home') {
    const cards = CATEGORIES.map(cat => `
      <div class="lang-card" onclick="setView('${cat.id}')">
        <div>
          <h2 class="lang-card-title">${cat.title}</h2>
          <p class="lang-card-desc">${cat.desc}</p>
        </div>
        <div class="lang-card-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    `).join('');
    body = `<div class="home-grid">${cards}</div>`;

  } else {
    const backBtn = `
      <button class="back-btn" onclick="setView('home')">
        <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Назад
      </button>`;

    body = `
      <div class="nav-container">
        <div class="nav-row">${backBtn}${getTabBar()}</div>
        ${currentView === 'ja' ? getJaTabBar() : ''}
      </div>`;

    if (currentView === 'tr') {
      body += renderGrid('29 букв. Произношение дано приблизительной русской транскрипцией.', TURKISH, tileLetter);
    } else if (currentView === 'uk') {
      body += renderGrid('33 буквы. Многие похожи на русские — обрати внимание на г/ґ, и/і, е/є.', UKRAINIAN, tileLetter);
    } else if (currentView === 'de') {
      body += renderGrid('30 букв. Включает умлауты Ä, Ö, Ü и эсцет ß.', GERMAN, tileLetter);
    } else if (currentView === 'ja') {
      if (currentSubView === 'hira') {
        body += `<p class="alpha-intro">Хирагана — базовая японская азбука.</p>`;
        body += kanaGroup(HIRAGANA, 'base',    'Основные знаки (годзюон)');
        body += kanaGroup(HIRAGANA, 'daku',    'Звонкие (дакутэн)');
        body += kanaGroup(HIRAGANA, 'handaku', 'Полузвонкие (хандакутэн)');
      } else if (currentSubView === 'kata') {
        body += `<p class="alpha-intro">Катакана — азбука для иностранных слов и имён.</p>`;
        body += kanaGroup(KATAKANA, 'base',    'Основные знаки (годзюон)');
        body += kanaGroup(KATAKANA, 'daku',    'Звонкие (дакутэн)');
        body += kanaGroup(KATAKANA, 'handaku', 'Полузвонкие (хандакутэн)');
      } else if (currentSubView === 'kanji') {
        body += renderGrid('Иероглифы для старта: числа и базовые понятия.', KANJI, tileKanji);
      }
    }
  }

  app.innerHTML = header + `<div id="content">${body}</div>`;

  requestAnimationFrame(() => {
    updateIndicator('#main-tabs', lastMainTab);
    updateIndicator('#sub-tabs',  lastSubTab);
    lastMainTab = lastSubTab = null;
    if (doAnimate) triggerWaveAnimations();
    doAnimate = false;
  });
}

/* ================= WAVE ANIMATION ================= */
// Uses IntersectionObserver so each group fires when it scrolls into view
function triggerWaveAnimations() {
  const areas = document.querySelectorAll('.content-area');
  if (!areas.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const grid = entry.target.querySelector('.alpha-grid');
      if (grid && !grid.classList.contains('wave')) {
        void grid.offsetWidth; // force reflow
        grid.classList.add('wave');
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  areas.forEach(area => observer.observe(area));
}

/* ================= TILE RENDERERS ================= */
function tileLetter(item, i) {
  const [ch, trans, hint] = item;
  return `<div class="alpha-tile" style="--i:${i}">
    <div class="alpha-ch">${ch}</div>
    <div class="alpha-trans">${trans}</div>
    ${hint ? `<div class="alpha-hint">${hint}</div>` : ''}
  </div>`;
}

function tileKanji(item, i) {
  const [ch, read, mean] = item;
  return `<div class="alpha-tile" style="--i:${i}">
    <div class="alpha-ch jp-font">${ch}</div>
    <div class="alpha-trans">[${read}]</div>
    <div class="alpha-hint">${mean}</div>
  </div>`;
}

function tileKana(item, i) {
  const [kana, romaji, pron] = item;
  return `<div class="alpha-tile jp-font" style="--i:${i}">
    <div class="alpha-ch jp-font">${kana}</div>
    <div class="alpha-trans">[${romaji}]</div>
    <div class="alpha-hint">${pron}</div>
  </div>`;
}

/* ================= GRID BUILDERS ================= */
function renderGrid(intro, dataArr, renderer) {
  const tiles = dataArr.map((item, i) => renderer(item, i)).join('');
  return `
    <p class="alpha-intro">${intro}</p>
    <div class="content-area"><div class="alpha-grid">${tiles}</div></div>`;
}

function kanaGroup(list, group, title) {
  const items = list.filter(x => x[3] === group);
  if (!items.length) return '';
  const tiles = items.map((item, i) => tileKana(item, i)).join('');
  return `
    <div class="alpha-group-title">${title}</div>
    <div class="content-area"><div class="alpha-grid">${tiles}</div></div>`;
}

/* ================= INDICATOR ================= */
function updateIndicator(selector, lastPos) {
  const container = document.querySelector(selector);
  if (!container) return;
  const active    = container.querySelector('.tab-btn.active');
  const indicator = container.querySelector('.tab-indicator');
  if (!active || !indicator) return;

  const cur = { left: active.offsetLeft, width: active.offsetWidth };

  if (lastPos) {
    indicator.style.transition = 'none';
    indicator.style.left  = lastPos.left  + 'px';
    indicator.style.width = lastPos.width + 'px';
    indicator.getBoundingClientRect(); // force reflow
    indicator.style.transition = 'left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)';
  } else {
    indicator.style.transition = 'none';
  }

  indicator.style.left  = cur.left  + 'px';
  indicator.style.width = cur.width + 'px';
}

/* ================= NAVIGATION ================= */
function setView(id) {
  const activeMain = document.querySelector('#main-tabs .tab-btn.active');
  if (activeMain) lastMainTab = { left: activeMain.offsetLeft, width: activeMain.offsetWidth };

  doAnimate = (id !== 'home'); // animate when entering a language view

  currentView = id;
  if (id === 'ja' && !['hira', 'kata', 'kanji'].includes(currentSubView)) currentSubView = 'hira';

  const cat = CATEGORIES.find(c => c.id === id);
  document.title = id === 'home'
    ? 'Языковой паспорт — Алфавиты'
    : cat ? `${cat.title} — Языковой паспорт` : 'Языковой паспорт';

  render();
}

function setSubView(id) {
  const activeSub = document.querySelector('#sub-tabs .tab-btn.active');
  if (activeSub) lastSubTab = { left: activeSub.offsetLeft, width: activeSub.offsetWidth };

  doAnimate = true;
  currentSubView = id;

  const sub = JA_CATEGORIES.find(c => c.id === id);
  document.title = sub ? `Японский · ${sub.title} — Языковой паспорт` : 'Японский — Языковой паспорт';

  render();
}

/* ================= EXPOSE GLOBALS ================= */
window.setView     = setView;
window.setSubView  = setSubView;
window.toggleTheme = toggleTheme;

/* ================= INIT ================= */
render();
