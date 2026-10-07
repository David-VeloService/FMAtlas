/* FM Atlas — verbeteringen voor de begrippen- en flashcardpagina's.
   Laadt na het pagina-script en vervangt of omhult de bestaande functies
   (zelfde namen op alle 18 pagina's). */
(function () {
  const fn = name => typeof window[name] === 'function';
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /* ─── Begrippenpagina's ─────────── */
  if (fn('matches') && fn('highlight') && fn('render')) {
    // Zoeken zonder accenten, ook in formule en wetsartikel
    window.matches = function (item, q) {
      if (!q) return true;
      const n = norm(q);
      return [item.term, item.def, item.formula, item.art].some(v => v && norm(v).includes(n));
    };
    // Eerst escapen, dan markeren op dezelfde (accentloze) posities
    window.highlight = function (text, q) {
      const t = String(text ?? '');
      if (!q) return faEsc(t);
      const nq = norm(q);
      if (!nq) return faEsc(t);
      let flat = '', map = [];
      for (let i = 0; i < t.length; i++) {
        const n = norm(t[i]);
        for (let k = 0; k < n.length; k++) { flat += n[k]; map.push(i); }
      }
      let out = '', last = 0, from = 0, hit;
      while ((hit = flat.indexOf(nq, from)) !== -1) {
        const a = map[hit], b = map[hit + nq.length - 1] + 1;
        if (a < last) { from = hit + 1; continue; }
        out += faEsc(t.slice(last, a)) + '<mark>' + faEsc(t.slice(a, b)) + '</mark>';
        last = b; from = hit + nq.length;
      }
      return out + faEsc(t.slice(last));
    };
    // Alfabetisch binnen elke categorie
    try { if (typeof begrippen !== 'undefined') begrippen.sort((a, b) => a.term.localeCompare(b.term, 'nl')); } catch (_) {}
    // Focus op het filter behouden na opnieuw tekenen, met aria-pressed
    const origRender = window.render;
    window.render = function () {
      const act = document.activeElement;
      const box = document.getElementById('blCatFilters');
      const idx = box && act && box.contains(act) ? [...box.children].indexOf(act) : -1;
      const r = origRender.apply(this, arguments);
      if (box) {
        [...box.children].forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('active'))));
        if (idx >= 0 && box.children[idx]) box.children[idx].focus();
      }
      return r;
    };
    const search = document.getElementById('blSearch');
    if (search) {
      search.setAttribute('type', 'search');
      search.setAttribute('aria-label', 'Zoek in de begrippen');
      search.addEventListener('keydown', e => {
        if (e.key === 'Escape' && search.value) { search.value = ''; search.dispatchEvent(new Event('input')); }
      });
    }
    document.getElementById('blCounter')?.setAttribute('aria-live', 'polite');
    window.render();
  }

  /* ─── Flashcardpagina's ─────────── */
  if (fn('markCard') && fn('_mark') && fn('showCard') && fn('nextCard')) {
    // Geen dubbele telling bij snel twee keer tikken of toetsherhaling
    let busy = false;
    const origMarkCard = window.markCard, origNext = window.nextCard, origShow = window.showCard, orig_mark = window._mark;
    window.markCard = function () { if (busy) return; busy = true; return origMarkCard.apply(this, arguments); };
    window.nextCard = function () { if (busy) return; busy = true; return origNext.apply(this, arguments); };
    window.showCard = function () { const r = origShow.apply(this, arguments); busy = false; syncA11y(); return r; };

    // Voortgang = aandeel van alle kaarten dat je ooit als gekend hebt gemarkeerd
    const vakKey = (typeof DATA !== 'undefined' && DATA.key) || 'vak';
    const allTerms = (typeof DATA !== 'undefined' && DATA.flashcards || []).map(c => c.term);
    const KKEY = 'fa_known_' + vakKey;
    const knownSet = () => { try { return new Set(JSON.parse(localStorage.getItem(KKEY) || '[]')); } catch (_) { return new Set(); } };
    window._mark = function (isKnown) {
      const term = document.getElementById('frontTerm')?.textContent;
      const r = orig_mark.apply(this, arguments);
      if (term && allTerms.length) {
        const s = knownSet();
        if (isKnown) s.add(term); else s.delete(term);
        try { localStorage.setItem(KKEY, JSON.stringify([...s])); } catch (_) {}
        const pct = allTerms.filter(t => s.has(t)).length / allTerms.length * 100;
        faSetProgress(vakKey, pct);
      }
      return r;
    };

    // Enter of spatie op een knop of link moet die knop activeren, niet de kaart omdraaien
    window.addEventListener('keydown', e => {
      const tag = e.target && e.target.tagName;
      if ((e.key === 'Enter' || e.key === ' ') && /^(BUTTON|A|TEXTAREA)$/.test(tag)) e.stopPropagation();
      if (document.querySelector('#fa-search-overlay.open, .fa-account-menu:not([hidden])')) e.stopPropagation();
    }, true);

    // Kaart toegankelijk maken; alleen de zichtbare kant voorlezen
    const wrap = document.getElementById('flipWrap');
    function syncA11y() {
      if (!wrap) return;
      const flipped = wrap.classList.contains('flipped');
      wrap.querySelector('.fc-face-front')?.setAttribute('aria-hidden', String(flipped));
      wrap.querySelector('.fc-face-back')?.setAttribute('aria-hidden', String(!flipped));
      wrap.setAttribute('aria-pressed', String(flipped));
    }
    if (wrap) {
      wrap.setAttribute('role', 'button');
      wrap.setAttribute('tabindex', '0');
      wrap.setAttribute('aria-label', 'Kaart omdraaien');
      if (fn('flipCard')) {
        const origFlip = window.flipCard;
        window.flipCard = function () { const r = origFlip.apply(this, arguments); syncA11y(); return r; };
      }
      // Vegen op telefoon: naar rechts = gekend, naar links = nog niet
      let x0 = null, y0 = null;
      wrap.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
      wrap.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
        x0 = null;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          e.preventDefault();
          window.markCard(dx > 0);
        }
      });
      syncA11y();
    }
    // Op touchapparaten de toetsenbordtip vervangen
    if (matchMedia('(hover: none)').matches) {
      document.querySelectorAll('.fc-face-hint').forEach(h => { if (/spatie/i.test(h.textContent)) h.textContent = 'Tik om te draaien · veeg naar rechts als je hem kent'; });
    }
  }
})();
