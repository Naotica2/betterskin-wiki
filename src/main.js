import './style.css';
import 'highlight.js/styles/github-dark.min.css';
import { marked } from 'marked';
import hljs from 'highlight.js';

// ===== Configuration =====
const NAV_ICONS = {
  'README.md': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  'installation.md': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  'download-and-install-skin-packs.md': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  'create-your-own-skin-packs.md': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  'custom-3d-geometry.md': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>',
  'faq.md': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
};

// ===== State =====
let navItems = [];
let docsCache = {};
let currentPage = '';

// ===== DOM Refs =====
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarNav = document.getElementById('sidebarNav');
const hamburger = document.getElementById('hamburger');
const contentEl = document.getElementById('content');
const pageNavEl = document.getElementById('pageNav');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const themeLabel = document.getElementById('themeLabel');
const topbarTitle = document.getElementById('topbarTitle');

// ===== Marked Configuration =====
marked.use({
  gfm: true,
  breaks: false,
  // Rewrite .md links to hash navigation
  walkTokens(token) {
    if (token.type === 'link') {
      const href = token.href || '';
      if (href.endsWith('.md') && !href.startsWith('http')) {
        token.href = '#/' + href;
      }
    }
  },
  renderer: {
    code({ text, lang }) {
      let highlighted;
      if (lang && hljs.getLanguage(lang)) {
        highlighted = hljs.highlight(text, { language: lang }).value;
      } else {
        highlighted = hljs.highlightAuto(text).value;
      }
      return `<pre><code class="hljs language-${lang || 'plaintext'}">${highlighted}</code></pre>`;
    },
  },
});

// ===== Theme =====
function getTheme() {
  return localStorage.getItem('wiki-theme') || 'dark';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('wiki-theme', theme);
  themeLabel.textContent = theme === 'dark' ? 'Dark mode' : 'Light mode';
  // Swap highlight.js stylesheet
  updateHljsTheme(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function updateHljsTheme(theme) {
  const existing = document.querySelector('link[data-hljs-theme]');
  if (existing) existing.remove();

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.setAttribute('data-hljs-theme', '');
  link.href = theme === 'dark'
    ? 'https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github-dark.min.css'
    : 'https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css';
  document.head.appendChild(link);
}

// ===== Parse SUMMARY.md =====
async function parseSummary() {
  try {
    const resp = await fetch('/docs/SUMMARY.md');
    const text = await resp.text();
    const lines = text.split('\n');
    const items = [];

    for (const line of lines) {
      const match = line.match(/\*\s+\[(.+?)\]\((.+?)\)/);
      if (match) {
        items.push({ title: match[1], file: match[2] });
      }
    }

    navItems = items;
    return items;
  } catch (e) {
    console.error('Failed to parse SUMMARY.md:', e);
    return [];
  }
}

// ===== Render Sidebar Navigation =====
function renderNav(activeFile) {
  sidebarNav.innerHTML = '';
  navItems.forEach((item) => {
    const el = document.createElement('a');
    el.className = 'nav-item' + (item.file === activeFile ? ' active' : '');
    el.href = '#/' + item.file;

    const iconSvg = NAV_ICONS[item.file] || NAV_ICONS['README.md'];
    el.innerHTML = `<span class="nav-icon">${iconSvg}</span><span>${item.title}</span>`;

    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.file);
    });

    sidebarNav.appendChild(el);
  });
}

// ===== Fetch & Render Markdown =====
async function fetchDoc(file) {
  if (docsCache[file]) return docsCache[file];
  try {
    const resp = await fetch('/docs/' + file);
    if (!resp.ok) throw new Error('Not found');
    const text = await resp.text();
    docsCache[file] = text;
    return text;
  } catch (e) {
    return `# Page Not Found\n\nThe page **${file}** could not be loaded.`;
  }
}

async function renderPage(file) {
  contentEl.innerHTML = '<div class="content-loading"><div class="spinner"></div><p>Loading...</p></div>';

  const md = await fetchDoc(file);
  const html = marked.parse(md);
  contentEl.innerHTML = html;
  contentEl.style.animation = 'none';
  // Trigger reflow
  void contentEl.offsetWidth;
  contentEl.style.animation = '';

  // Add copy buttons to code blocks
  contentEl.querySelectorAll('pre').forEach((pre) => {
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });

  // Update page title
  const h1 = contentEl.querySelector('h1');
  const pageTitle = h1 ? h1.textContent : 'Better Skin Wiki';
  document.title = pageTitle + ' — Better Skin Wiki';
  topbarTitle.textContent = pageTitle;

  // Render prev/next navigation
  renderPageNav(file);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Page Navigation (Prev/Next) =====
function renderPageNav(currentFile) {
  const idx = navItems.findIndex((item) => item.file === currentFile);
  let html = '';

  if (idx > 0) {
    const prev = navItems[idx - 1];
    html += `<a class="page-nav-link page-nav-link--prev" href="#/${prev.file}">
      <span class="page-nav-label">← Previous</span>
      <span class="page-nav-title">${prev.title}</span>
    </a>`;
  }

  if (idx < navItems.length - 1 && idx >= 0) {
    const next = navItems[idx + 1];
    html += `<a class="page-nav-link page-nav-link--next" href="#/${next.file}">
      <span class="page-nav-label">Next →</span>
      <span class="page-nav-title">${next.title}</span>
    </a>`;
  }

  pageNavEl.innerHTML = html;

  // Add click listeners
  pageNavEl.querySelectorAll('.page-nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const file = link.getAttribute('href').replace('#/', '');
      navigateTo(file);
    });
  });
}

// ===== Navigation =====
function navigateTo(file) {
  currentPage = file;
  window.location.hash = '/' + file;
  renderNav(file);
  renderPage(file);
  closeSidebar();
}

function getFileFromHash() {
  const hash = window.location.hash.replace('#/', '');
  return hash || 'README.md';
}

// ===== Mobile Sidebar =====
function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
  hamburger.classList.add('active');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  hamburger.classList.remove('active');
}

function toggleSidebar() {
  if (sidebar.classList.contains('open')) closeSidebar();
  else openSidebar();
}

// ===== Search =====
async function handleSearch(query) {
  if (!query.trim()) {
    searchResults.classList.remove('active');
    searchResults.innerHTML = '';
    return;
  }

  const q = query.toLowerCase();
  const results = [];

  for (const item of navItems) {
    const md = await fetchDoc(item.file);
    const lines = md.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(q)) {
        results.push({
          title: item.title,
          file: item.file,
          matchLine: lines[i].replace(/^#+\s*/, '').replace(/[*_`]/g, '').trim(),
        });
        break; // one match per page is enough
      }
    }
  }

  if (results.length === 0) {
    searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
  } else {
    searchResults.innerHTML = results.map((r) =>
      `<div class="search-result-item" data-file="${r.file}">
        <strong>${r.title}</strong>
        <span class="search-match">${r.matchLine.substring(0, 80)}</span>
      </div>`
    ).join('');

    searchResults.querySelectorAll('.search-result-item[data-file]').forEach((el) => {
      el.addEventListener('click', () => {
        navigateTo(el.dataset.file);
        searchInput.value = '';
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
      });
    });
  }

  searchResults.classList.add('active');
}

// ===== Event Listeners =====
hamburger.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
themeToggle.addEventListener('click', toggleTheme);
themeToggleMobile.addEventListener('click', toggleTheme);

searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
searchInput.addEventListener('focus', () => {
  if (searchInput.value.trim()) handleSearch(searchInput.value);
});

// Close search on click outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.sidebar-search')) {
    searchResults.classList.remove('active');
  }
});

// Keyboard shortcut for search
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === 'Escape') {
    searchInput.blur();
    searchResults.classList.remove('active');
    closeSidebar();
  }
});

// Hash change
window.addEventListener('hashchange', () => {
  const file = getFileFromHash();
  if (file !== currentPage) {
    currentPage = file;
    renderNav(file);
    renderPage(file);
  }
});

// ===== Init =====
async function init() {
  setTheme(getTheme());
  await parseSummary();
  const file = getFileFromHash();
  currentPage = file;
  renderNav(file);
  renderPage(file);
}

init();
