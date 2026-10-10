// PromptVault Visual Editor v2 - Live Save
// Admin-only edit mode with direct Supabase save
(function() {
  'use strict';
  
  if (window.pvEditor) {
    window.pvEditor.toggle();
    return;
  }

  const Editor = {
    active: false,
    mode: 'select',
    selected: null,
    customCSS: '',
    toolbar: null,

    init() {
      this.loadCustomCSS();
      this.createToolbar();
      window.pvEditor = this;
    },

    async loadCustomCSS() {
      try {
        const { data } = await window.supabaseClient
          .from('site_custom_styles')
          .select('css')
          .eq('id', 1)
          .single();
        if (data && data.css) {
          this.customCSS = data.css;
          this.applyCSS(data.css);
        }
      } catch(e) { console.log('No custom CSS yet'); }
    },

    applyCSS(css) {
      let el = document.getElementById('pv-custom-css');
      if (!el) {
        el = document.createElement('style');
        el.id = 'pv-custom-css';
        document.head.appendChild(el);
      }
      el.textContent = css;
    },

    createToolbar() {
      const t = document.createElement('div');
      t.id = 'pv-toolbar';
      t.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:999999;
        background:#1a1a2e;border:2px solid #4a4a8a;border-radius:16px;padding:12px 20px;
        display:none;gap:12px;align-items:center;box-shadow:0 8px 30px rgba(0,0,0,0.6);
        font-family:system-ui,sans-serif;`;
      
      t.innerHTML = `
        <span style="color:#fff;font-weight:800;font-size:15px;">🎨 Edit Mode</span>
        <button data-m="select" title="Click to select">👆</button>
        <button data-m="move" title="Drag to move">✥</button>
        <button data-m="spacing" title="Adjust spacing">📏</button>
        <button data-m="text" title="Edit text">✏️</button>
        <button data-m="delete" title="Delete element">🗑</button>
        <button data-m="save" title="Save live" style="background:#1a5c1a;border-color:#44ff44;">💾 Save</button>
        <button data-m="close" title="Exit">✕</button>
        <span id="pv-hint" style="color:#aaa;font-size:12px;max-width:200px;"></span>
      `;
      
      t.querySelectorAll('button').forEach(b => {
        b.style.cssText += 'padding:8px 14px;border-radius:10px;border:1px solid #4a4a6a;background:#2a2a4a;color:#fff;cursor:pointer;font-size:16px;';
        b.onclick = (e) => { e.stopPropagation(); this.setMode(b.dataset.m); };
      });
      
      document.body.appendChild(t);
      this.toolbar = t;
      
      // Add highlight style
      const s = document.createElement('style');
      s.textContent = `
        .pv-sel{outline:3px solid #00ff88!important;outline-offset:2px!important;cursor:pointer;}
        .pv-hover{outline:2px dashed #00aaff!important;outline-offset:2px!important;}
      `;
      document.head.appendChild(s);
      
      this.bindEvents();
    },

    setMode(m) {
      if (m === 'close') { this.toggle(); return; }
      if (m === 'save') { this.save(); return; }
      this.mode = m;
      const hints = {
        select: 'Click any element to select it',
        move: 'Drag any element to move it',
        spacing: 'Select element, then use sliders',
        text: 'Click any text to edit it',
        delete: 'Click element to delete it'
      };
      document.getElementById('pv-hint').textContent = hints[m] || '';
      this.toolbar.querySelectorAll('button').forEach(b => {
        if (['select','move','spacing','text','delete'].includes(b.dataset.m)) {
          b.style.background = b.dataset.m === m ? '#4a4a9a' : '#2a2a4a';
        }
      });
    },

    toggle() {
      this.active = !this.active;
      this.toolbar.style.display = this.active ? 'flex' : 'none';
      if (this.active) {
        this.setMode('select');
      } else {
        document.querySelectorAll('.pv-sel,.pv-hover').forEach(e => e.classList.remove('pv-sel','pv-hover'));
      }
    },

    bindEvents() {
      let dragEl = null, startX, startY, origX, origY;

      document.addEventListener('mouseover', (e) => {
        if (!this.active || e.target.closest('#pv-toolbar')) return;
        document.querySelectorAll('.pv-hover').forEach(x => x.classList.remove('pv-hover'));
        if (e.target !== document.body) e.target.classList.add('pv-hover');
      });

      document.addEventListener('click', (e) => {
        if (!this.active || e.target.closest('#pv-toolbar')) return;
        e.preventDefault(); e.stopPropagation();
        
        const el = e.target;
        
        if (this.mode === 'delete') {
          if (confirm('Delete this element?')) {
            const selector = this.getSelector(el);
            el.remove();
            this.customCSS += `\n${selector}{display:none!important}`;
            this.applyCSS(this.customCSS);
          }
          return;
        }
        
        if (this.mode === 'text') {
          const current = el.textContent;
          const newText = prompt('Edit text:', current);
          if (newText !== null) el.textContent = newText;
          return;
        }
        
        document.querySelectorAll('.pv-sel').forEach(x => x.classList.remove('pv-sel'));
        el.classList.add('pv-sel');
        this.selected = el;
        
        if (this.mode === 'spacing') this.showSpacingPanel(el);
      }, true);

      // Drag for move mode
      document.addEventListener('mousedown', (e) => {
        if (!this.active || this.mode !== 'move' || e.target.closest('#pv-toolbar')) return;
        const el = e.target;
        if (el === document.body) return;
        
        dragEl = el;
        const r = el.getBoundingClientRect();
        startX = e.clientX; startY = e.clientY;
        origX = parseInt(el.style.marginLeft || 0);
        origY = parseInt(el.style.marginTop || 0);
        el.style.position = 'relative';
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!dragEl) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        dragEl.style.marginLeft = (origX + dx) + 'px';
        dragEl.style.marginTop = (origY + dy) + 'px';
      });

      document.addEventListener('mouseup', (e) => {
        if (!dragEl) return;
        const el = dragEl;
        const selector = this.getSelector(el);
        this.customCSS += `\n${selector}{margin-left:${el.style.marginLeft}!important;margin-top:${el.style.marginTop}!important;position:relative!important}`;
        this.applyCSS(this.customCSS);
        dragEl = null;
      });
    },

    getSelector(el) {
      // Generate a unique CSS selector for the element
      if (el.id) return '#' + el.id;
      let path = [];
      while (el && el !== document.body) {
        let sel = el.tagName.toLowerCase();
        if (el.className && typeof el.className === 'string') {
          const cls = el.className.split(' ').filter(c => c && !c.startsWith('pv-'))[0];
          if (cls) sel += '.' + cls;
        }
        const siblings = Array.from(el.parentNode?.children || []).filter(c => c.tagName === el.tagName);
        if (siblings.length > 1) sel += `:nth-of-type(${siblings.indexOf(el)+1})`;
        path.unshift(sel);
        el = el.parentNode;
        if (path.length > 4) break;
      }
      return path.join(' > ');
    },

    showSpacingPanel(el) {
      // Remove existing panel
      document.getElementById('pv-spacing')?.remove();
      
      const computed = window.getComputedStyle(el);
      const panel = document.createElement('div');
      panel.id = 'pv-spacing';
      panel.style.cssText = `position:fixed;top:20px;right:20px;z-index:999999;background:#1a1a2e;
        border:2px solid #4a4a8a;border-radius:12px;padding:16px;color:#fff;
        font-family:system-ui,sans-serif;font-size:13px;min-width:220px;`;
      
      panel.innerHTML = `
        <div style="font-weight:bold;margin-bottom:10px;">📏 Spacing</div>
        <div style="margin:8px 0;"><label>Top: <span id="pv-mt-val">${parseInt(computed.marginTop)}</span>px</label><br>
        <input type="range" id="pv-mt" min="-50" max="100" value="${parseInt(computed.marginTop)}" style="width:100%"></div>
        <div style="margin:8px 0;"><label>Bottom: <span id="pv-mb-val">${parseInt(computed.marginBottom)}</span>px</label><br>
        <input type="range" id="pv-mb" min="-50" max="100" value="${parseInt(computed.marginBottom)}" style="width:100%"></div>
        <div style="margin:8px 0;"><label>Padding: <span id="pv-pd-val">${parseInt(computed.paddingTop)}</span>px</label><br>
        <input type="range" id="pv-pd" min="0" max="100" value="${parseInt(computed.paddingTop)}" style="width:100%"></div>
        <button id="pv-sp-close" style="margin-top:8px;padding:6px 12px;border-radius:8px;border:1px solid #4a4a6a;background:#2a2a4a;color:#fff;cursor:pointer;">Done</button>
      `;
      
      document.body.appendChild(panel);
      
      const update = () => {
        const mt = panel.querySelector('#pv-mt').value;
        const mb = panel.querySelector('#pv-mb').value;
        const pd = panel.querySelector('#pv-pd').value;
        panel.querySelector('#pv-mt-val').textContent = mt;
        panel.querySelector('#pv-mb-val').textContent = mb;
        panel.querySelector('#pv-pd-val').textContent = pd;
        el.style.marginTop = mt + 'px';
        el.style.marginBottom = mb + 'px';
        el.style.padding = pd + 'px';
      };
      
      panel.querySelectorAll('input').forEach(i => i.oninput = update);
      panel.querySelector('#pv-sp-close').onclick = () => {
        const selector = this.getSelector(el);
        this.customCSS += `\n${selector}{margin-top:${el.style.marginTop}!important;margin-bottom:${el.style.marginBottom}!important;padding:${el.style.padding}!important}`;
        this.applyCSS(this.customCSS);
        panel.remove();
      };
    },

    async save() {
      const hint = document.getElementById('pv-hint');
      hint.textContent = 'Saving...';
      try {
        const { error } = await window.supabaseClient
          .from('site_custom_styles')
          .update({ css: this.customCSS, updated_at: new Date().toISOString() })
          .eq('id', 1);
        if (error) throw error;
        hint.textContent = '✅ Saved live!';
        setTimeout(() => hint.textContent = '', 3000);
      } catch(e) {
        hint.textContent = '❌ Save failed: ' + e.message;
      }
    }
  };

  Editor.init();
  
  // Auto-add edit button for admins
  setTimeout(() => {
    if (window.PVviewer && !window.PVviewer.guest) {
      const btn = document.createElement('button');
      btn.textContent = '🎨 Edit';
      btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999998;padding:10px 18px;border-radius:12px;background:#1a1a2e;color:#fff;border:2px solid #4a4a8a;cursor:pointer;font-weight:bold;';
      btn.onclick = () => window.pvEditor.toggle();
      document.body.appendChild(btn);
    }
  }, 2000);
})();
