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
    { title: 'Semantic Status Colors', href: '#colors-semantic', cat: 'Foundations' },
    { title: 'Typography Scale (Archivo)', href: '#typography', cat: 'Foundations' },
    { title: 'Elevation & Shadows', href: '#elevation', cat: 'Foundations' },
    { title: 'Spacing & 4px Baseline', href: '#spacing', cat: 'Foundations' },
    { title: 'Responsive Grids (1440/1280/768/390)', href: '#grid', cat: 'Foundations' },
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
