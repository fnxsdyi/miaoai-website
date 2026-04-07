// MiaoAI - 纯静态AI工具导航站
(function() {
  'use strict';

  let categories = [];
  let activeCat = 'chat';
  let searchQuery = '';

  // Category icon mapping for tool cards
  const catIcons = {
    chat: '💬', image: '🎨', video: '🎬',
    code: '💻', audio: '🎵', writing: '✍️'
  };

  const colorMap = {
    'from-blue-500 to-cyan-500': 'color-blue',
    'from-pink-500 to-fuchsia-500': 'color-pink',
    'from-orange-400 to-orange-500': 'color-orange',
    'from-green-500 to-emerald-500': 'color-green',
    'from-purple-500 to-pink-500': 'color-purple',
    'from-yellow-500 to-orange-500': 'color-yellow',
    'from-indigo-500 to-purple-500': 'color-indigo',
    'from-red-400 to-rose-500': 'color-red'
  };

  function getColorClass(gradient) {
    return colorMap[gradient] || 'color-blue';
  }

  // Load data
  fetch('/data/tools.json')
    .then(r => r.json())
    .then(data => {
      categories = data;
      renderSidebar();
      renderBottomNav();
      renderTools();
      initSearch();
    });

  // ---- Render Category Sidebar ----
  function renderSidebar() {
    const bar = document.getElementById('categoryBar');
    bar.innerHTML = categories.map(cat => `
      <div class="cat-item ${cat.id === activeCat ? 'active' : ''}" data-cat="${cat.id}">
        <span class="cat-icon">${cat.icon}</span>
        <span>${cat.name}</span>
        <span class="cat-count">${cat.tools.length}</span>
      </div>
    `).join('');
    bar.addEventListener('click', e => {
      const item = e.target.closest('.cat-item');
      if (item) switchCat(item.dataset.cat);
    });
  }

  // ---- Render Bottom Nav ----
  function renderBottomNav() {
    const nav = document.getElementById('bottomNav');
    nav.innerHTML = categories.map(cat => `
      <div class="bnav-item ${cat.id === activeCat ? 'active' : ''}" data-cat="${cat.id}">
        <span class="bnav-icon">${cat.icon}</span>
        <span>${cat.name.replace('AI','')}</span>
      </div>
    `).join('');
    nav.addEventListener('click', e => {
      const item = e.target.closest('.bnav-item');
      if (item) switchCat(item.dataset.cat);
    });
  }

  function switchCat(id) {
    activeCat = id;
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchDropdown').classList.add('hidden');
    renderSidebar();
    renderBottomNav();
    renderTools();
  }

  window.resetView = function() {
    switchCat('chat');
  };

  // ---- Render Tool Cards ----
  function renderTools() {
    const grid = document.getElementById('toolGrid');
    const noResults = document.getElementById('noResults');

    if (searchQuery) {
      const results = [];
      categories.forEach(cat => {
        cat.tools.forEach(tool => {
          const q = searchQuery.toLowerCase();
          const match = tool.name.toLowerCase().includes(q) ||
                        tool.desc.toLowerCase().includes(q) ||
                        (tool.tags && tool.tags.some(t => t.toLowerCase().includes(q)));
          if (match) results.push({ ...tool, catId: cat.id, catIcon: cat.icon, catColor: cat.color });
        });
      });
      if (results.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
        grid.innerHTML = results.map(t => cardHTML(t, t.catId, t.catIcon, t.catColor)).join('');
      }
      return;
    }

    const cat = categories.find(c => c.id === activeCat);
    if (!cat) return;
    noResults.classList.add('hidden');
    grid.innerHTML = cat.tools.map(t => cardHTML(t, activeCat, cat.icon, cat.color)).join('');
  }

  function cardHTML(tool, catId, catIcon, catColor) {
    const colorCls = getColorClass(catColor);
    const tagHTML = (tool.tags || []).map(tag => {
      const cls = ['免费','国产','国际','付费','开源'].includes(tag) ? `tag-${tag}` : 'tag-default';
      return `<span class="tool-tag ${cls}">${tag}</span>`;
    }).join('');
    const hotHTML = tool.hot ? '<span class="tool-hot">HOT</span>' : '';
    return `
      <a class="tool-card" href="${tool.url}" target="_blank" rel="noopener noreferrer">
        <div class="tool-card-header">
          <div class="tool-icon ${colorCls}">${catIcon}</div>
          <div class="tool-info">
            <div class="tool-name">${tool.name}${hotHTML}</div>
          </div>
        </div>
        <div class="tool-desc">${tool.desc}</div>
        <div class="tool-tags">${tagHTML}</div>
      </a>`;
  }

  // ---- Search ----
  function initSearch() {
    const input = document.getElementById('searchInput');
    const dropdown = document.getElementById('searchDropdown');
    let debounce;

    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const q = input.value.trim();
        if (!q) {
          dropdown.classList.add('hidden');
          searchQuery = '';
          renderTools();
          return;
        }
        searchQuery = q;
        const results = [];
        const ql = q.toLowerCase();
        categories.forEach(cat => {
          cat.tools.forEach(tool => {
            if (tool.name.toLowerCase().includes(ql) ||
                tool.desc.toLowerCase().includes(ql) ||
                (tool.tags && tool.tags.some(t => t.toLowerCase().includes(ql)))) {
              results.push({ ...tool, catId: cat.id, catIcon: cat.icon, catColor: cat.color });
            }
          });
        });

        if (results.length > 0 && results.length <= 20) {
          const colorCls = (r) => getColorClass(r.catColor);
          dropdown.innerHTML = results.slice(0, 10).map(r => `
            <div class="search-item" data-url="${r.url}">
              <div class="search-item-icon ${colorCls(r)}">${r.catIcon}</div>
              <div class="search-item-info">
                <div class="search-item-name">${highlight(r.name, ql)}</div>
                <div class="search-item-desc">${r.desc}</div>
              </div>
            </div>
          `).join('');
          dropdown.classList.remove('hidden');
          dropdown.querySelectorAll('.search-item').forEach(el => {
            el.addEventListener('click', () => {
              window.open(el.dataset.url, '_blank');
            });
          });
        } else {
          dropdown.classList.add('hidden');
        }

        renderTools();
      }, 200);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim()) input.dispatchEvent(new Event('input'));
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.search-box')) dropdown.classList.add('hidden');
    });
  }

  function highlight(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="highlight-text">$1</span>');
  }
})();
