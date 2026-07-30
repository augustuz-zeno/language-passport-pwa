/* ================= PWA / CACHE CLEAR ================= */
// Удаляем старые Service Worker'ы, чтобы браузер не отдавал старую кэшированную версию
if('serviceWorker' in navigator){
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}
/* ================= LOGIC ================= */
let currentView = 'home'; // 'home' or category id
let currentSubView = 'hira'; // 'hira', 'kata', 'kanji'
let transitionDirection = 'fade-up';

// Theme Init
let isLightTheme = localStorage.getItem('theme') === 'light';
if (isLightTheme) {
  document.documentElement.classList.add('light-theme');
}

function toggleTheme() {
  isLightTheme = !isLightTheme;
  if (isLightTheme) {
    document.documentElement.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  }
  render();
}

const CATEGORIES = [
  { id: 'tr', title: 'Турецкий', desc: '29 букв. Латиница.' },
  { id: 'uk', title: 'Украинский', desc: '33 буквы. Кириллица.' },
  { id: 'de', title: 'Немецкий', desc: '30 букв, умлауты и эсцет. Латиница.' },
  { id: 'ja', title: 'Японский', desc: 'Хирагана, Катакана, Кандзи.' }
];

const JA_CATEGORIES = [
  { id: 'hira', title: 'Хирагана' },
  { id: 'kata', title: 'Катакана' },
  { id: 'kanji', title: 'Кандзи' }
];

function speak(text, lang) {
  // Затычка на будущее, аудио пока отключено
  console.log(`[Audio Stub] Should speak: "${text}" with lang "${lang}"`);
}

function getTabBar() {
  const tabs = CATEGORIES.map(cat => `
    <button class="tab-btn ${currentView === cat.id ? 'active' : ''}" onclick="setView('${cat.id}')">
      ${cat.title}
    </button>
  `).join('');
  
  return `<div class="tab-bar-scroll"><div class="tab-bar">${tabs}</div></div>`;
}

function getJaTabBar() {
  const tabs = JA_CATEGORIES.map(cat => `
    <button class="tab-btn ${currentSubView === cat.id ? 'active' : ''}" onclick="setSubView('${cat.id}')">
      ${cat.title}
    </button>
  `).join('');
  
  return `<div class="nav-row"><div class="tab-bar-scroll"><div class="tab-bar">${tabs}</div></div></div>`;
}

function render() {
  const app = document.getElementById('app');
  
  const themeIcon = isLightTheme 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  let headerHtml = `
    <header>
      <div class="title-block" onclick="setView('home')" style="cursor: pointer;" title="На главную">
        <h1>Языковой <span class="accent">passport</span></h1>
        <p class="subtitle">Изучай алфавиты легко и быстро</p>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()" aria-label="Переключить тему">
        ${themeIcon}
      </button>
    </header>
  `;

  let contentHtml = '';
  
  if (currentView === 'home') {
    const cardsHtml = CATEGORIES.map(cat => `
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
    
    contentHtml = `<div class="home-grid">${cardsHtml}</div>`;
  } else {
    // Render Category
    const backBtn = `
      <button class="back-btn" onclick="setView('home')">
        <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Назад
      </button>
    `;
    
    let navContent = `
      <div class="nav-container">
        <div class="nav-row">
          ${backBtn}
          ${getTabBar()}
        </div>
        ${currentView === 'ja' ? getJaTabBar() : ''}
      </div>
    `;

    contentHtml = navContent;

    if (currentView === 'tr') {
      contentHtml += renderCategory('tr', 'Турецкий алфавит', '29 букв. Произношение дано приблизительной русской транскрипцией.', TURKISH, tile);
    } else if (currentView === 'uk') {
      contentHtml += renderCategory('uk', 'Украинский алфавит', '33 буквы. Многие похожи на русские — обрати внимание на г/ґ, и/і, е/є.', UKRAINIAN, tile);
    } else if (currentView === 'de') {
      contentHtml += renderCategory('de', 'Немецкий алфавит', '30 букв. Включает умлауты Ä, Ö, Ü и эсцет ß.', GERMAN, tile);
    } else if (currentView === 'ja') {
      if (currentSubView === 'hira') {
        contentHtml += `<p class="alpha-intro">Хирагана — базовая японская азбука.</p>
          ${kanaGroup(HIRAGANA, 'base', 'Основные знаки (годзюон)')}
          ${kanaGroup(HIRAGANA, 'daku', 'Звонкие (дакутэн)')}
          ${kanaGroup(HIRAGANA, 'handaku', 'Полузвонкие (хандакутэн)')}`;
      } else if (currentSubView === 'kata') {
        contentHtml += `<p class="alpha-intro">Катакана — азбука для иностранных слов и имён.</p>
          ${kanaGroup(KATAKANA, 'base', 'Основные знаки (годзюон)')}
          ${kanaGroup(KATAKANA, 'daku', 'Звонкие (дакутэн)')}
          ${kanaGroup(KATAKANA, 'handaku', 'Полузвонкие (хандакутэн)')}`;
      } else if (currentSubView === 'kanji') {
        contentHtml += renderCategory('kanji', 'Кандзи', 'Иероглифы для старта: числа и базовые понятия.', KANJI, kanjiTile);
      }
    }
  }

  app.innerHTML = headerHtml + `<div id="content" class="${transitionDirection}">${contentHtml}</div>`;
}

function renderCategory(catId, title, intro, dataArr, tileRenderer) {
  return `
    <p class="alpha-intro">${intro}</p>
    <div class="alpha-grid">
      ${dataArr.map(item => tileRenderer(item, catId)).join('')}
    </div>
  `;
}

function tile(item, catId) {
  const [ch, trans, hint] = item;
  const lang = catId === 'tr' ? 'tr-TR' : catId === 'uk' ? 'uk-UA' : catId === 'de' ? 'de-DE' : 'ja-JP';
  const speakCh = ch.split(' ')[0];
  
  return `
    <div class="alpha-tile" onclick="speak('${speakCh}','${lang}')">
      <div class="alpha-ch">${ch}</div>
      <div class="alpha-trans">${trans}</div>
      ${hint ? `<div class="alpha-hint">${hint}</div>` : ''}
    </div>
  `;
}

function kanjiTile(item, catId) {
  const [ch, read, mean] = item;
  
  return `
    <div class="alpha-tile kanji-tile" onclick="speak('${ch}','ja-JP')">
      <div class="alpha-ch jp-font">${ch}</div>
      <div class="alpha-trans">[${read}]</div>
      <div class="alpha-hint">${mean}</div>
    </div>
  `;
}

function kanaGroup(list, group, title) {
  const items = list.filter(x => x[3] === group);
  if (items.length === 0) return '';
  
  return `
    <div class="alpha-group-title">${title}</div>
    <div class="alpha-grid">
      ${items.map(item => {
        const [kana, romaji, pron] = item;
        return `
          <div class="alpha-tile jp-font" onclick="speak('${kana}','ja-JP')">
            <div class="alpha-ch jp-font">${kana}</div>
            <div class="alpha-trans">[${romaji}]</div>
            <div class="alpha-hint">${pron}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function setView(id) {
  if (id === 'home') {
    transitionDirection = 'fade-up';
  } else {
    let oldIdx = CATEGORIES.findIndex(c => c.id === currentView);
    let newIdx = CATEGORIES.findIndex(c => c.id === id);
    if (oldIdx !== -1 && newIdx !== -1) {
      transitionDirection = newIdx > oldIdx ? 'slide-left' : 'slide-right';
    } else {
      transitionDirection = 'fade-up';
    }
  }
  currentView = id;
  if (id === 'ja' && !['hira', 'kata', 'kanji'].includes(currentSubView)) {
    currentSubView = 'hira';
  }
  render();
}

function setSubView(id) {
  let oldIdx = JA_CATEGORIES.findIndex(c => c.id === currentSubView);
  let newIdx = JA_CATEGORIES.findIndex(c => c.id === id);
  if (oldIdx !== -1 && newIdx !== -1) {
    transitionDirection = newIdx > oldIdx ? 'slide-left' : 'slide-right';
  } else {
    transitionDirection = 'fade-up';
  }
  currentSubView = id;
  render();
}

window.setView = setView;
window.setSubView = setSubView;
window.speak = speak;
window.toggleTheme = toggleTheme;

// Первичный рендер
render();
