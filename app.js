/* ==========================================================================
   CONNECT NIGERIA DESIGN SYSTEM — APP CONTROLLER & INTERACTIVITY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initShowcaseTabs();
  initColorSwatches();
  initTypeTester();
  initCommandPalette();
  initToastTriggers();
  initModal();
  initChatDemo();
  initPriceSlider();
  initUploader();
  initCodeCopyButtons();
  initIconExplorer();
  initBrandIdentity();
});

/* --- 1. Theme Management (Light / Dark) --- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('cn-ds-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  applyTheme(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('cn-ds-theme', theme);
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.innerHTML = theme === 'dark' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
}

/* --- 2. Navigation & Mobile Drawer --- */
function initNavigation() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('app-sidebar');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !mobileBtn.contains(e.target) && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }

  // Smooth scroll and active state sync
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          if (sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
          }
        }
      }
    });
  });

  // IntersectionObserver for scrollspy
  const sections = document.querySelectorAll('.ds-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(l => {
          if (l.getAttribute('href') === `#${id}`) {
            navLinks.forEach(link => link.classList.remove('active'));
            l.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(sec => observer.observe(sec));
}

/* --- 3. Component Showcase Tabs (Preview / Code) --- */
function initShowcaseTabs() {
  document.querySelectorAll('.showcase-card').forEach(card => {
    const tabs = card.querySelectorAll('.showcase-tab');
    const previewBody = card.querySelector('.showcase-body');
    const codePanel = card.querySelector('.showcase-code-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const mode = tab.dataset.mode;
        if (mode === 'preview') {
          if (previewBody) previewBody.style.display = 'flex';
          if (codePanel) codePanel.classList.remove('active');
        } else if (mode === 'code') {
          if (previewBody) previewBody.style.display = 'none';
          if (codePanel) codePanel.classList.add('active');
        }
      });
    });
  });
}

/* --- 4. Color Swatches Click-to-Copy --- */
function initColorSwatches() {
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const hex = swatch.dataset.hex;
      const token = swatch.dataset.token;
      if (hex) {
        navigator.clipboard.writeText(hex).then(() => {
          showToast(`Copied ${hex} (${token}) to clipboard`, 'success');
        });
      }
    });
  });
}

/* --- 5. Interactive Type Tester --- */
function initTypeTester() {
  const sizeSlider = document.getElementById('type-size-slider');
  const sizeVal = document.getElementById('type-size-val');
  const weightSelect = document.getElementById('type-weight-select');
  const output = document.getElementById('type-tester-output');

  if (sizeSlider && output) {
    sizeSlider.addEventListener('input', (e) => {
      const size = e.target.value;
      output.style.fontSize = `${size}px`;
      if (sizeVal) sizeVal.textContent = `${size}px`;
    });
  }

  if (weightSelect && output) {
    weightSelect.addEventListener('change', (e) => {
      output.style.fontWeight = e.target.value;
    });
  }
}

/* --- 6. Command Palette (Ctrl+K) --- */
function initCommandPalette() {
  const trigger = document.getElementById('search-trigger');
  const backdrop = document.getElementById('cmd-palette-backdrop');
  const input = document.getElementById('cmd-input');
  const resultsList = document.getElementById('cmd-results-list');

  const navItems = [
    { title: 'Overview & Philosophy', href: '#overview', cat: 'Introduction' },
    { title: 'CN Green (Primary Brand Palette)', href: '#colors-green', cat: 'Foundations' },
    { title: 'CN Yellow / Amber Palette', href: '#colors-amber', cat: 'Foundations' },
    { title: 'CN Blue / Slate Palette', href: '#colors-slate', cat: 'Foundations' },
    { title: 'CN White / Grayscale Palette', href: '#colors-white', cat: 'Foundations' },
    { title: 'Semantic Status Colors', href: '#colors-semantic', cat: 'Foundations' },
    { title: 'Typography Scale (Archivo)', href: '#typography', cat: 'Foundations' },
    { title: 'Elevation & Shadows', href: '#elevation', cat: 'Foundations' },
    { title: 'Spacing & 4px Baseline', href: '#spacing', cat: 'Foundations' },
    { title: 'Responsive Grids (1440/1280/768/390)', href: '#grid', cat: 'Foundations' },
    { title: 'System Iconography (1,170+ Lib)', href: '#icons', cat: 'Foundations' },
    { title: 'Logos & Favicons (Official Assets)', href: '#brand-identity', cat: 'Foundations' },
    { title: 'Button Component Matrix', href: '#buttons', cat: 'Components' },
    { title: 'Status Badges & Chips', href: '#badges', cat: 'Components' },
    { title: 'Form Controls & Inputs', href: '#forms', cat: 'Components' },
    { title: 'Price Range Slider (Dual-Thumb)', href: '#slider', cat: 'Components' },
    { title: 'Product Listing Card (Grid)', href: '#card-grid', cat: 'Marketplace' },
    { title: 'Product Listing Card (List)', href: '#card-list', cat: 'Marketplace' },
    { title: 'Verified Seller Card', href: '#seller-card', cat: 'Marketplace' },
    { title: 'Faceted Search & Filter Sidebar', href: '#faceted-filter', cat: 'Marketplace' },
    { title: 'In-App Messaging & Chat Thread', href: '#chat-thread', cat: 'Overlays' },
    { title: 'Drag & Drop Media Uploader', href: '#uploader', cat: 'Overlays' },
    { title: 'Toast Notifications', href: '#toasts', cat: 'Feedback' },
    { title: 'Modals & Dialogs', href: '#modals', cat: 'Feedback' },
    { title: 'Token Export & Inspection', href: '#token-export', cat: 'Developer Tools' }
  ];

  function openPalette() {
    if (backdrop) {
      backdrop.classList.add('is-open');
      if (input) {
        input.value = '';
        renderResults('');
        input.focus();
      }
    }
  }

  function closePalette() {
    if (backdrop) backdrop.classList.remove('is-open');
  }

  function renderResults(query) {
    if (!resultsList) return;
    const filtered = navItems.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.cat.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      resultsList.innerHTML = `<li style="padding: 16px; color: var(--color-text-muted); text-align: center;">No design system tokens or components found.</li>`;
      return;
    }

    resultsList.innerHTML = filtered.map(item => `
      <li class="cmd-result-item" data-href="${item.href}">
        <span>${item.title}</span>
        <span class="showcase-badge">${item.cat}</span>
      </li>
    `).join('');

    resultsList.querySelectorAll('.cmd-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const href = item.dataset.href;
        closePalette();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  if (trigger) trigger.addEventListener('click', openPalette);
  
  if (input) {
    input.addEventListener('input', (e) => renderResults(e.target.value));
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closePalette();
    });
  }

  // Keyboard shortcut Ctrl+K / Cmd+K and Esc
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openPalette();
    }
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) {
      closePalette();
    }
  });
}

/* --- 7. Toast Notification System --- */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' 
    ? '✓' 
    : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-weight: bold;">${icon}</span>
      <span style="font-size: 13px; font-weight: 500;">${message}</span>
    </div>
    <button style="color: var(--color-text-muted); font-size: 14px;" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 250ms ease, transform 250ms ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

function initToastTriggers() {
  document.querySelectorAll('[data-toast-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.toastTrigger;
      const msg = btn.dataset.toastMsg || `Sample ${type} toast notification triggered!`;
      showToast(msg, type);
    });
  });
}

/* --- 8. Modals & Dialogs --- */
function initModal() {
  const backdrop = document.getElementById('demo-modal-backdrop');
  const openBtns = document.querySelectorAll('.open-modal-trigger');
  const closeBtns = document.querySelectorAll('.modal-close-trigger');

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (backdrop) backdrop.classList.add('is-open');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (backdrop) backdrop.classList.remove('is-open');
    });
  });

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('is-open');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) {
      backdrop.classList.remove('is-open');
    }
  });
}

/* --- 9. In-App Messaging & Chat Demo --- */
function initChatDemo() {
  const input = document.getElementById('chat-demo-input');
  const sendBtn = document.getElementById('chat-demo-send');
  const container = document.getElementById('chat-demo-messages');
  const quickReplies = document.querySelectorAll('.quick-reply-pill');

  function sendMessage(text) {
    if (!text.trim() || !container) return;
    
    // Add Outgoing Message
    const bubbleOut = document.createElement('div');
    bubbleOut.className = 'chat-bubble chat-bubble-outgoing';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubbleOut.innerHTML = `
      ${text}
      <div class="chat-bubble-time">${time} • Read</div>
    `;
    container.appendChild(bubbleOut);
    container.scrollTop = container.scrollHeight;

    if (input) input.value = '';

    // Auto-reply simulation
    setTimeout(() => {
      const bubbleIn = document.createElement('div');
      bubbleIn.className = 'chat-bubble chat-bubble-incoming';
      const replies = [
        "Yes, the item is 100% genuine and available for pickup or express delivery in Lagos!",
        "Thanks for reaching out! We can inspect the item today if you are around Ikeja.",
        "Best price is ₦42,000 for immediate payment. Let me know if that works!"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      bubbleIn.innerHTML = `
        ${randomReply}
        <div class="chat-bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      `;
      container.appendChild(bubbleIn);
      container.scrollTop = container.scrollHeight;
    }, 750);
  }

  if (sendBtn && input) {
    sendBtn.addEventListener('click', () => sendMessage(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage(input.value);
    });
  }

  quickReplies.forEach(pill => {
    pill.addEventListener('click', () => {
      sendMessage(pill.textContent.trim());
    });
  });
}

/* --- 10. Interactive Price Range Slider --- */
function initPriceSlider() {
  const slider = document.getElementById('price-slider-input');
  const display = document.getElementById('price-slider-display');

  if (slider && display) {
    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value).toLocaleString();
      display.textContent = `₦${val}`;
    });
  }
}

/* --- 12. Drag & Drop Image Uploader --- */
function initUploader() {
  const dropzone = document.getElementById('uploader-dropzone');
  const queue = document.getElementById('uploader-queue');

  if (!dropzone || !queue) return;

  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--cn-green-700)';
      dropzone.style.background = 'var(--cn-green-100)';
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--cn-green-500)';
      dropzone.style.background = 'var(--cn-green-50)';
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  dropzone.addEventListener('click', () => {
    // Simulate picking a demo image
    const demoFiles = [{ name: 'camera_front_hd.jpg', size: '2.4 MB' }];
    handleFiles(demoFiles);
  });

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      const item = document.createElement('div');
      item.className = 'upload-progress-card';
      item.innerHTML = `
        <div style="font-size: 20px;">🖼️</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 4px;">
            <span>${file.name || 'product_photo.png'}</span>
            <span style="color: var(--cn-green-700); font-family: var(--font-family-mono);">100%</span>
          </div>
          <div class="upload-progress-bar">
            <div class="upload-progress-fill" style="width: 100%;"></div>
          </div>
        </div>
        <button style="color: var(--feedback-error); font-size: 14px; font-weight: bold; padding: 4px;" onclick="this.parentElement.remove()">✕</button>
      `;
      queue.appendChild(item);
      showToast(`Uploaded ${file.name || 'product_photo.png'} successfully!`, 'success');
    });
  }
}

/* --- 13. Copy Buttons in Code Panels --- */
function initCodeCopyButtons() {
  document.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeSnippet = btn.parentElement.querySelector('code');
      if (codeSnippet) {
        navigator.clipboard.writeText(codeSnippet.innerText).then(() => {
          showToast('Code snippet copied to clipboard!', 'success');
        });
      }
    });
  });
}

/* ==========================================================================
   14. SYSTEM ICONOGRAPHY EXPLORER (FIGMA NODE 51:12627)
   ========================================================================== */

function initIconExplorer() {
  const grid = document.getElementById('icon-display-grid');
  const searchInput = document.getElementById('icon-search-input');
  const searchClear = document.getElementById('icon-search-clear');
  const categoryChips = document.querySelectorAll('.icon-cat-chip');
  const sizePills = document.querySelectorAll('#icon-size-pills .icon-pill-btn');
  const strokePills = document.querySelectorAll('#icon-stroke-pills .icon-pill-btn');
  const colorDots = document.querySelectorAll('#icon-color-swatches .icon-color-dot');
  const displayCount = document.getElementById('icon-display-count');
  const resultsInfo = document.getElementById('icon-results-info');
  const emptyState = document.getElementById('icon-empty-state');
  const resetBtn = document.getElementById('icon-reset-btn');

  if (!grid) return;

  // Curated Essential Icons from Figma 24px System (Node 51:12627)
  const iconLibrary = [
    // Finance & eCommerce
    { name: 'shopping-cart-01', cat: 'ecommerce', paths: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>' },
    { name: 'shopping-bag-01', cat: 'ecommerce', paths: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>' },
    { name: 'tag-01', cat: 'ecommerce', paths: '<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>' },
    { name: 'wallet-01', cat: 'ecommerce', paths: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>' },
    { name: 'credit-card-01', cat: 'ecommerce', paths: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>' },
    { name: 'receipt', cat: 'ecommerce', paths: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>' },
    { name: 'coins-01', cat: 'ecommerce', paths: '<ellipse cx="12" cy="7" rx="8" ry="4"/><path d="M4 7v6c0 2.21 3.58 4 8 4s8-1.79 8-4V7"/><path d="M4 13v6c0 2.21 3.58 4 8 4s8-1.79 8-4v-6"/>' },
    { name: 'bank', cat: 'ecommerce', paths: '<path d="m2 9 10-7 10 7"/><path d="M4 9v11"/><path d="M8 9v11"/><path d="M16 9v11"/><path d="M20 9v11"/><path d="M2 20h20"/>' },
    { name: 'percent-01', cat: 'ecommerce', paths: '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>' },
    { name: 'package', cat: 'ecommerce', paths: '<path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/>' },

    // General & Actions
    { name: 'search-lg', cat: 'general', paths: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>' },
    { name: 'heart', cat: 'general', paths: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>' },
    { name: 'star-01', cat: 'general', paths: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
    { name: 'bookmark', cat: 'general', paths: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>' },
    { name: 'share-01', cat: 'general', paths: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>' },
    { name: 'filter-lines', cat: 'general', paths: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>' },
    { name: 'check', cat: 'general', paths: '<polyline points="20 6 9 17 4 12"/>' },
    { name: 'x-close', cat: 'general', paths: '<line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>' },
    { name: 'plus', cat: 'general', paths: '<line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>' },
    { name: 'minus', cat: 'general', paths: '<line x1="5" x2="19" y1="12" y2="12"/>' },
    { name: 'settings-01', cat: 'general', paths: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
    { name: 'sliders-01', cat: 'general', paths: '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/>' },
    { name: 'info-circle', cat: 'general', paths: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>' },
    { name: 'help-circle', cat: 'general', paths: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/>' },
    { name: 'trash-01', cat: 'general', paths: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>' },
    { name: 'copy-01', cat: 'general', paths: '<rect width="13" height="13" x="9" y="9" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' },
    { name: 'eye', cat: 'general', paths: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>' },
    { name: 'eye-off', cat: 'general', paths: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>' },
    { name: 'refresh-cw', cat: 'general', paths: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/>' },
    { name: 'external-link', cat: 'general', paths: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>' },

    // Communication
    { name: 'message-chat-circle', cat: 'communication', paths: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' },
    { name: 'message-dots-square', cat: 'communication', paths: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" x2="8.01" y1="10" y2="10"/><line x1="12" x2="12.01" y1="10" y2="10"/><line x1="16" x2="16.01" y1="10" y2="10"/>' },
    { name: 'mail-01', cat: 'communication', paths: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>' },
    { name: 'phone', cat: 'communication', paths: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>' },
    { name: 'send-01', cat: 'communication', paths: '<line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>' },
    { name: 'inbox-01', cat: 'communication', paths: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>' },
    { name: 'annotation', cat: 'communication', paths: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><line x1="9" x2="15" y1="10" y2="10"/>' },

    // Alerts & Feedback
    { name: 'alert-circle', cat: 'alerts', paths: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>' },
    { name: 'alert-triangle', cat: 'alerts', paths: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>' },
    { name: 'bell-01', cat: 'alerts', paths: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>' },
    { name: 'announcement-01', cat: 'alerts', paths: '<path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>' },
    { name: 'thumbs-up', cat: 'alerts', paths: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3"/>' },
    { name: 'check-circle', cat: 'alerts', paths: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
    { name: 'x-circle', cat: 'alerts', paths: '<circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/>' },

    // Security & Trust
    { name: 'shield-tick', cat: 'security', paths: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>' },
    { name: 'shield-01', cat: 'security', paths: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
    { name: 'lock-01', cat: 'security', paths: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
    { name: 'unlock-01', cat: 'security', paths: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>' },
    { name: 'key-01', cat: 'security', paths: '<path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5-2 2 1.5 1.5L9 14l-1.5-1.5-2 2 1.5 1.5L4 19a3 3 0 1 1-2-2l7-7 1.5 1.5 2-2L11 8l3-3 1.5 1.5 2-2 3.5 3.5Z"/>' },
    { name: 'fingerprint-01', cat: 'security', paths: '<path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>' },

    // Users & Profiles
    { name: 'user-01', cat: 'users', paths: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
    { name: 'users-01', cat: 'users', paths: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
    { name: 'user-check-01', cat: 'users', paths: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>' },
    { name: 'user-plus-01', cat: 'users', paths: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>' },
    { name: 'user-circle', cat: 'users', paths: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>' },

    // Media & Devices
    { name: 'camera-01', cat: 'media', paths: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>' },
    { name: 'video-recorder', cat: 'media', paths: '<polygon points="23 7 16 12 23 17 23 7"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>' },
    { name: 'image-01', cat: 'media', paths: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>' },
    { name: 'monitor-01', cat: 'media', paths: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>' },
    { name: 'smartphone-01', cat: 'media', paths: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/>' },
    { name: 'mic-01', cat: 'media', paths: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="23"/><line x1="8" x2="16" y1="23" y2="23"/>' },

    // Maps & Travel
    { name: 'marker-pin-01', cat: 'maps', paths: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>' },
    { name: 'map-01', cat: 'maps', paths: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>' },
    { name: 'navigation-pointer-01', cat: 'maps', paths: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>' },
    { name: 'compass-01', cat: 'maps', paths: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>' },
    { name: 'car-01', cat: 'maps', paths: '<path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H7.5a1 1 0 0 0-.8.4L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>' },
    { name: 'flag-01', cat: 'maps', paths: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>' },
    { name: 'globe-01', cat: 'maps', paths: '<circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' },

    // Files & Content
    { name: 'file-01', cat: 'files', paths: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>' },
    { name: 'folder', cat: 'files', paths: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>' },
    { name: 'upload-cloud-01', cat: 'files', paths: '<polyline points="16 16 12 12 8 16"/><line x1="12" x2="12" y1="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><polyline points="16 16 12 12 8 16"/>' },
    { name: 'download-cloud-01', cat: 'files', paths: '<polyline points="8 17 12 21 16 17"/><line x1="12" x2="12" y1="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>' },
    { name: 'paperclip', cat: 'files', paths: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>' },
    { name: 'edit-01', cat: 'files', paths: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>' },

    // Arrows & Direction
    { name: 'arrow-right', cat: 'arrows', paths: '<line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/>' },
    { name: 'arrow-left', cat: 'arrows', paths: '<line x1="19" x2="5" y1="12" y2="12"/><polyline points="12 19 5 12 12 5"/>' },
    { name: 'arrow-up', cat: 'arrows', paths: '<line x1="12" x2="12" y1="19" y2="5"/><polyline points="5 12 12 5 19 12"/>' },
    { name: 'arrow-down', cat: 'arrows', paths: '<line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/>' },
    { name: 'chevron-right', cat: 'arrows', paths: '<polyline points="9 18 15 12 9 6"/>' },
    { name: 'chevron-left', cat: 'arrows', paths: '<polyline points="15 18 9 12 15 6"/>' },
    { name: 'chevron-down', cat: 'arrows', paths: '<polyline points="6 9 12 15 18 9"/>' },
    { name: 'chevron-up', cat: 'arrows', paths: '<polyline points="18 15 12 9 6 15"/>' }
  ];

  // Active state
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSize = 24;
  let currentStroke = 2;
  let currentColor = 'currentColor';

  function renderIcons() {
    grid.innerHTML = '';
    const filtered = iconLibrary.filter(icon => {
      const matchCat = currentCategory === 'all' || icon.cat === currentCategory;
      const matchQuery = searchQuery === '' || 
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        icon.cat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });

    if (displayCount) displayCount.textContent = filtered.length;
    if (resultsInfo) {
      if (searchQuery) {
        resultsInfo.innerHTML = `Found <strong>${filtered.length}</strong> icons matching "${searchQuery}". Click any card to copy SVG code.`;
      } else {
        resultsInfo.innerHTML = `Showing <strong>${filtered.length}</strong> curated icons in <strong>${currentCategory.toUpperCase()}</strong>. Click any card to copy SVG code.`;
      }
    }

    if (filtered.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }

    filtered.forEach(icon => {
      const card = document.createElement('div');
      card.className = 'icon-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('title', `Click to copy <svg> for ${icon.name}`);

      const svgMarkup = `<svg width="${currentSize}" height="${currentSize}" viewBox="0 0 24 24" fill="none" stroke="${currentColor}" stroke-width="${currentStroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon.paths}</svg>`;

      card.innerHTML = `
        <span class="icon-card-copy-badge">Copy</span>
        <div class="icon-card-preview" style="color: ${currentColor};">
          ${svgMarkup}
        </div>
        <div class="icon-card-name">${icon.name}</div>
        <div class="icon-card-cat">${icon.cat}</div>
      `;

      card.addEventListener('click', () => {
        // Construct clean standard SVG snippet for copy
        const copySvg = `<svg width="${currentSize}" height="${currentSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${currentStroke}" stroke-linecap="round" stroke-linejoin="round">\n  ${icon.paths}\n</svg>`;
        navigator.clipboard.writeText(copySvg).then(() => {
          showToast(`Copied <svg> for "${icon.name}" to clipboard!`, 'success');
        }).catch(() => {
          showToast(`Selected "${icon.name}" (${currentSize}px)`, 'info');
        });
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });

      grid.appendChild(card);
    });
  }

  // Initial render
  renderIcons();

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (searchClear) {
        searchClear.style.display = searchQuery ? 'block' : 'none';
      }
      renderIcons();
    });
  }

  // Clear button
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      searchClear.style.display = 'none';
      renderIcons();
      searchInput.focus();
    });
  }

  // Category chip filtering
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.dataset.cat;
      renderIcons();
    });
  });

  // Size pills
  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      sizePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentSize = parseInt(pill.dataset.size, 10);
      renderIcons();
    });
  });

  // Stroke pills
  strokePills.forEach(pill => {
    pill.addEventListener('click', () => {
      strokePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentStroke = parseFloat(pill.dataset.stroke);
      renderIcons();
    });
  });

  // Color dots
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      currentColor = dot.dataset.color;
      renderIcons();
    });
  });

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentCategory = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (searchClear) searchClear.style.display = 'none';
      categoryChips.forEach(c => c.classList.remove('active'));
      const defaultChip = document.querySelector('.icon-cat-chip[data-cat="all"]');
      if (defaultChip) defaultChip.classList.add('active');
      renderIcons();
    });
  }
}

/* ==========================================================================
   15. BRAND IDENTITY (LOGOS & FAVICONS - FIGMA FRAME 72:3759)
   ========================================================================== */

function initBrandIdentity() {
  // Logo canvas background toggles (Light, Dark, Checkered)
  const logoCanvas = document.getElementById('logo-canvas-preview');
  const logoToggles = document.querySelectorAll('#logo-theme-toggles .icon-pill-btn');
  
  if (logoCanvas && logoToggles.length) {
    logoToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        logoToggles.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const bg = btn.dataset.bg;
        logoCanvas.className = `brand-canvas-preview ${bg}-bg`;
      });
    });
  }

  // Browser tab simulation theme toggle (Light Tab, Dark Tab)
  const tabSim = document.getElementById('browser-tab-simulation');
  const tabToggles = document.querySelectorAll('#tab-theme-toggles .icon-pill-btn');
  
  if (tabSim && tabToggles.length) {
    tabToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        tabToggles.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const theme = btn.dataset.tabTheme;
        tabSim.setAttribute('data-theme', theme);
      });
    });
  }

  // Copy Logo HTML <img> snippet
  const copyLogoBtn = document.querySelector('.copy-logo-html-btn');
  if (copyLogoBtn) {
    copyLogoBtn.addEventListener('click', () => {
      const snippet = '<img src="logo.png" alt="Connect Nigeria" width="180" height="52" loading="eager" />';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(snippet).then(() => {
          showToast('Copied Connect Nigeria <img> tag to clipboard!', 'success');
        }).catch(() => {
          showToast('Copied Connect Nigeria <img> tag to clipboard!', 'success');
        });
      } else {
        showToast('Copied Connect Nigeria <img> tag to clipboard!', 'success');
      }
    });
  }

  // Copy Favicon <link> tags snippet
  const copyFaviconBtn = document.querySelector('.copy-favicon-link-btn');
  if (copyFaviconBtn) {
    copyFaviconBtn.addEventListener('click', () => {
      const snippet = '<link rel="icon" type="image/png" href="favicon.png">\n<link rel="apple-touch-icon" href="favicon.png">';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(snippet).then(() => {
          showToast('Copied <link rel="icon"> tags to clipboard!', 'success');
        }).catch(() => {
          showToast('Copied <link rel="icon"> tags to clipboard!', 'success');
        });
      } else {
        showToast('Copied <link rel="icon"> tags to clipboard!', 'success');
      }
    });
  }
}
