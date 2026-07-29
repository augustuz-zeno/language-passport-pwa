/* ================= THEME ================= */
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeColorMeta(savedTheme);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeColorMeta(next);
}
function updateThemeColorMeta(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', theme === 'dark' ? '#0f172a' : '#f4f6f8');
}
initTheme();

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
let currentCategory = 'tr';

function speak(text, lang) {
  // Затычка на будущее, аудио пока отключено
  console.log(`[Audio Stub] Should speak: "${text}" with lang "${lang}"`);
}

function getIconSun() {
  return `<svg class="icon-sun" viewBox="0 0 24 24"><path d="M12,2.25c-0.41,0-0.75,0.34-0.75,0.75v2c0,0.41,0.34,0.75,0.75,0.75s0.75-0.34,0.75-0.75v-2C12.75,2.59,12.41,2.25,12,2.25z M5.64,5.64c-0.29-0.29-0.77-0.29-1.06,0c-0.29,0.29-0.29,0.77,0,1.06l1.41,1.41c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22c0.29-0.29,0.29-0.77,0-1.06L5.64,5.64z M19.42,4.58c-0.29-0.29-0.77-0.29-1.06,0l-1.41,1.41c-0.29,0.29-0.29,0.77,0,1.06c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22l1.41-1.41C19.72,5.35,19.72,4.87,19.42,4.58z M12,7.25c-2.62,0-4.75,2.13-4.75,4.75s2.13,4.75,4.75,4.75s4.75-2.13,4.75-4.75S14.62,7.25,12,7.25z M12,15.25c-1.79,0-3.25-1.46-3.25-3.25s1.46-3.25,3.25-3.25s3.25,1.46,3.25,3.25S13.79,15.25,12,15.25z M2.25,12c0-0.41,0.34-0.75,0.75-0.75h2c0.41,0,0.75,0.34,0.75,0.75s-0.34,0.75-0.75,0.75h-2C2.59,12.75,2.25,12.41,2.25,12z M21.75,12c0-0.41-0.34-0.75-0.75-0.75h-2c-0.41,0-0.75,0.34-0.75,0.75s0.34,0.75,0.75,0.75h2C21.41,12.75,21.75,12.41,21.75,12z M6.05,16.89c-0.29-0.29-0.77-0.29-1.06,0l-1.41,1.41c-0.29,0.29-0.29,0.77,0,1.06c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22l1.41-1.41C6.35,17.66,6.35,17.18,6.05,16.89z M18.36,18.36c-0.29-0.29-0.77-0.29-1.06,0c-0.29,0.29-0.29,0.77,0,1.06l1.41,1.41c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22c0.29-0.29,0.29-0.77,0-1.06L18.36,18.36z M12,19c-0.41,0-0.75,0.34-0.75,0.75v2c0,0.41,0.34,0.75,0.75,0.75s0.75-0.34,0.75-0.75v-2C12.75,19.34,12.41,19,12,19z"/></svg>`;
}
function getIconMoon() {
  return `<svg class="icon-moon" viewBox="0 0 24 24"><path d="M12.12,3.31C12,3.29,11.89,3.34,11.83,3.43c-0.06,0.09-0.07,0.21-0.02,0.31c1.39,3.01,0.57,6.64-1.92,8.87c-2.48,2.23-6.14,2.56-9.01,0.81C0.8,12.56,0.68,12.56,0.6,12.64C0.52,12.73,0.5,12.85,0.55,12.95c1.94,4.24,6.23,6.86,10.87,6.86c5.51,0,10.22-3.83,11.39-9.17c0.23-1.07,0.13-2.18-0.29-3.22C22.17,6.54,21.5,5.77,20.67,5.18c-1.28-0.91-2.82-1.4-4.42-1.4C14.93,3.78,13.48,3.44,12.12,3.31z"/></svg>`;
}

function render() {
  const app = document.getElementById('app');
  
  const subs = [
    ['tr', 'Турецкий', TURKISH],
    ['uk', 'Украинский', UKRAINIAN],
    ['hira', 'Хирагана', HIRAGANA],
    ['kata', 'Катакана', KATAKANA],
    ['kanji', 'Кандзи', KANJI]
  ];
  
  const subNavHtml = subs.map(([id, label]) => 
    `<button class="${currentCategory === id ? 'active' : ''}" onclick="setCategory('${id}')">${label}</button>`
  ).join('');

  let contentHtml = '';
  if (currentCategory === 'tr') {
    contentHtml = renderCategory('tr', 'Турецкий алфавит', '29 букв. Произношение дано приблизительной русской транскрипцией.', TURKISH, tile);
  } else if (currentCategory === 'uk') {
    contentHtml = renderCategory('uk', 'Украинский алфавит', '33 буквы. Многие похожи на русские — обрати внимание на г/ґ, и/і, е/є.', UKRAINIAN, tile);
  } else if (currentCategory === 'hira') {
    contentHtml = `<p class="alpha-intro">Хирагана — базовая японская азбука.</p>
      ${kanaGroup(HIRAGANA, 'base', 'Основные знаки (годзюон)')}
      ${kanaGroup(HIRAGANA, 'daku', 'Звонкие (дакутэн)')}
      ${kanaGroup(HIRAGANA, 'handaku', 'Полузвонкие (хандакутэн)')}`;
  } else if (currentCategory === 'kata') {
    contentHtml = `<p class="alpha-intro">Катакана — азбука для иностранных слов и имён.</p>
      ${kanaGroup(KATAKANA, 'base', 'Основные знаки (годзюон)')}
      ${kanaGroup(KATAKANA, 'daku', 'Звонкие (дакутэн)')}
      ${kanaGroup(KATAKANA, 'handaku', 'Полузвонкие (хандакутэн)')}`;
  } else if (currentCategory === 'kanji') {
    contentHtml = renderCategory('kanji', 'Кандзи', 'Иероглифы для старта: числа и базовые понятия.', KANJI, kanjiTile);
  }

  app.innerHTML = `
    <header>
      <div class="title-block">
        <h1>Языковой <span class="accent">паспорт</span></h1>
        <p class="subtitle">Изучай алфавиты легко и быстро</p>
      </div>
      <button class="theme-btn" onclick="toggleTheme()" aria-label="Toggle Theme">
        ${getIconSun()}
        ${getIconMoon()}
      </button>
    </header>
    
    <nav class="subtabs">${subNavHtml}</nav>
    <div id="content">${contentHtml}</div>
  `;
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
  const [ch, pron] = item;
  const lang = catId === 'tr' ? 'tr-TR' : catId === 'uk' ? 'uk-UA' : 'ja-JP';
  const speakCh = catId === 'tr' ? ch.split(' ')[0] : ch.split(' ')[0];
  
  return `
    <div class="alpha-tile" onclick="speak('${speakCh}','${lang}')">
      <div class="alpha-ch">${ch}</div>
      <div class="alpha-pron">${pron}</div>
    </div>
  `;
}

function kanjiTile(item, catId) {
  const [ch, read, mean] = item;
  
  return `
    <div class="alpha-tile kanji-tile" onclick="speak('${ch}','ja-JP')">
      <div class="alpha-ch jp-font">${ch}</div>
      <div class="alpha-pron">${read}</div>
      <div class="kanji-mean">${mean}</div>
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
            <div class="alpha-pron">${pron} <span style="opacity:.6">(${romaji})</span></div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function setCategory(id) {
  currentCategory = id;
  render();
}

// Экспортируем глобально, так как не используем type="module"
window.toggleTheme = toggleTheme;
window.setCategory = setCategory;
window.speak = speak;

// Первичный рендер
render();
