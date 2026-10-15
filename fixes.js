/* 1NUR GROUP - düzeltmeler. index.html'de ana <script>'ten SONRA yüklenmeli. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. SEKTÖR MODALI ---------- */
  var modal = document.getElementById('sectorModal');
  var lastFocus = null;

  function setModalOpen(open) {
    if (!modal) return;
    modal.classList.toggle('hidden', !open);
    modal.classList.toggle('flex', open);
    modal.classList.toggle('opacity-100', open);
    document.body.classList.toggle('modal-open', open);
  }

  window.openSectorModal = function (key) {
    var data = (typeof sectorDetails !== 'undefined') ? sectorDetails[key] : null;
    if (!data || !modal) return;
    lastFocus = document.activeElement;
    document.getElementById('modalContent').innerHTML =
      '<h3 class="text-2xl font-display font-bold text-white mb-2">' + data.title + '</h3>' +
      '<p class="text-sm text-slate-300 mb-4">' + data.desc + '</p>' +
      '<h4 class="text-xs uppercase font-bold text-brand-gold tracking-wider mb-2 font-mono">Yetkinlikler:</h4>' +
      '<ul class="space-y-2 mb-6">' +
      data.items.map(function (i) {
        return '<li class="text-xs text-slate-300 flex items-center gap-2"><i class="fa-solid fa-check text-brand-gold"></i> ' + i + '</li>';
      }).join('') +
      '</ul>' +
      '<div class="grid sm:grid-cols-2 gap-3">' +
      '<a href="' + data.url + '" class="text-center py-3 rounded-xl gold-gradient-bg text-brand-navyDark font-bold text-xs uppercase hover:scale-[1.02] transition-transform">Sektör sayfası</a>' +
      '<button type="button" onclick="closeSectorModal()" class="py-3 rounded-xl border border-white/10 text-slate-200 font-bold text-xs uppercase hover:border-brand-gold transition-colors">Kapat</button>' +
      '</div>';
    setModalOpen(true);
    var closeBtn = modal.querySelector('button');
    if (closeBtn) closeBtn.focus();
  };

  window.closeSectorModal = function () {
    setModalOpen(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  if (modal) {
    modal.classList.remove('flex');           // başlangıçta sadece hidden
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', function (e) { if (e.target === modal) window.closeSectorModal(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) window.closeSectorModal();
  });

  /* ---------- 2. SAYAÇ DÜZELTMESİ (4 -> 5 sektör) ---------- */
  var sectorCounter = document.querySelector('#stats-container .counter[data-target="4"]');
  if (sectorCounter) sectorCounter.setAttribute('data-target', '5');

  /* ---------- 3. DOĞRULANMAMIŞ METRİKLER: "hedef" olarak etiketle ---------- */
  var statsTitle = document.querySelector('#stats-container h3');
  if (statsTitle) statsTitle.textContent = 'Kalite Hedeflerimiz';
  var statsSub = document.querySelector('#stats-container h3 + p');
  if (statsSub) statsSub.textContent = 'Hedef değerler';
  var labelMap = {
    'Yazılım ve Proje Tamamlama Oranı': 'Proje tamamlama hedefi',
    'Teknik Altyapı ve Güvenilirlik': 'Altyapı güvenilirliği hedefi',
    'Paydaş ve Müşteri Memnuniyeti': 'Müşteri memnuniyeti hedefi'
  };
  document.querySelectorAll('#stats-container span.text-slate-300').forEach(function (s) {
    var t = s.textContent.trim();
    if (labelMap[t]) s.textContent = labelMap[t];
  });
  // "24/7 Yaklaşım" ile "7/24" tutarlı olsun
  document.querySelectorAll('.metric-strip .text-brand-gold').forEach(function (el) {
    if (el.textContent.trim() === '24/7') el.textContent = '7/24';
  });

 /* ---------- 4. EKİP KARTLARI: "yakında" ifadesini nötrle ---------- */
document.querySelectorAll('#ekip article p.text-brand-gold').forEach(function (p) {
  if (/yakında eklenecek/i.test(p.textContent)) p.textContent = 'Uzmanlık alanı';
});
var ekipIntro = document.querySelector('#ekip .max-w-md');
if (ekipIntro) ekipIntro.textContent = 'Stratejik yönetim ve operasyon yapımız.';
  /* ---------- 5. DİL: gerçek dil seçimini koru ---------- */
  try {
    if (localStorage.getItem('1nur-language') === 'en') {
      localStorage.setItem('1nur-language', 'tr');
      if (typeof setLanguage === 'function') setLanguage('tr');
    }
  } catch (e) {}

  /* ---------- 6. TEMA ---------- */
  window.toggleTheme = function () {
    var light = document.body.classList.toggle('light-theme');
    try { localStorage.setItem('1nur-theme', light ? 'light' : 'dark'); } catch (e) {}
    var icon = document.getElementById('theme-icon');
    if (icon) { icon.classList.toggle('fa-sun', !light); icon.classList.toggle('fa-moon', light); }
  };
  try {
    if (localStorage.getItem('1nur-theme') === 'light') window.toggleTheme();
  } catch (e) {}

  /* ---------- 7. TEKLİF SİHİRBAZI ---------- */
  var wizard = document.getElementById('quoteWizard');
  if (wizard) {
    var panels = wizard.querySelectorAll('.wizard-panel');
    var steps = wizard.querySelectorAll('.wizard-step');
    var current = 0;
    var next = document.getElementById('wizard-next');
    var prev = document.getElementById('wizard-prev');
    var submit = document.getElementById('wizard-submit');
    function renderWizard() {
      panels.forEach(function (panel, index) { panel.classList.toggle('hidden', index !== current); });
      steps.forEach(function (step, index) { step.classList.toggle('active', index === current); });
      prev.classList.toggle('hidden', current === 0);
      next.classList.toggle('hidden', current === panels.length - 1);
      submit.classList.toggle('hidden', current !== panels.length - 1);
    }
    next.addEventListener('click', function () {
      var required = panels[current].querySelectorAll('[required]');
      for (var i = 0; i < required.length; i++) if (!required[i].checkValidity()) { required[i].reportValidity(); return; }
      current = Math.min(current + 1, panels.length - 1); renderWizard();
    });
    prev.addEventListener('click', function () { current = Math.max(current - 1, 0); renderWizard(); });
    renderWizard();
  }

  /* ---------- 8. HERO SLIDER: duraklat, erişilebilirlik, reduced-motion ---------- */
  var hero = document.getElementById('anasayfa');
  var heroText = document.getElementById('hero-text-container');
  if (heroText) heroText.setAttribute('aria-live', 'polite');

  function updateTabsAria(index) {
    for (var i = 0; i < 5; i++) {
      var tab = document.getElementById('tab-' + i);
      if (tab) tab.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    }
  }
  if (typeof setHeroSlide === 'function') {
    var origSetHeroSlide = setHeroSlide;
    window.setHeroSlide = function (i) { origSetHeroSlide(i); updateTabsAria(i); };
    updateTabsAria(typeof currentSlide !== 'undefined' ? currentSlide : 0);
  }

  function stopAuto() { if (typeof slideInterval !== 'undefined') clearInterval(slideInterval); }
  function resumeAuto() { stopAuto(); if (!reduceMotion && typeof startAutoSlide === 'function') startAutoSlide(); }

  if (reduceMotion) {
    stopAuto();
    window.startAutoSlide = function () {};
  } else if (hero) {
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', resumeAuto);
    hero.addEventListener('focusin', stopAuto);
    hero.addEventListener('focusout', resumeAuto);
    document.addEventListener('visibilitychange', function () { document.hidden ? stopAuto() : resumeAuto(); });
  }

  /* ---------- 7. MOBİL MENÜ: aria-expanded + ikon ---------- */
  var menuBtn = document.querySelector('button[onclick="toggleMobileMenu()"]');
  window.toggleMobileMenu = function () {
    var menu = document.getElementById('mobile-menu');
    var open = menu.classList.toggle('hidden') === false;
    var icon = document.getElementById('menu-icon');
    if (icon) { icon.classList.toggle('fa-bars', !open); icon.classList.toggle('fa-xmark', open); }
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Menüyü Kapat' : 'Menüyü Aç');
    }
  };
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');

  /* ---------- 8. YUKARI ÇIK: yumuşak kaydırma + aria ---------- */
  var topBtn = document.getElementById('scrollTopBtn');
  if (topBtn) {
    topBtn.removeAttribute('onclick');
    topBtn.setAttribute('aria-label', 'Sayfa başına dön');
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 9. SCROLL-SPY ---------- */
  var navLinks = document.querySelectorAll('header nav a[href^="#"]');
  var map = {};
  navLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      navLinks.forEach(function (a) { a.classList.remove('nav-active'); });
      var link = map[en.target.id];
      if (link && en.target.id !== 'iletisim') link.classList.add('nav-active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  Object.keys(map).forEach(function (id) {
    var sec = document.getElementById(id);
    if (sec) spy.observe(sec);
  });

  /* ---------- 10. FORM: çift gönderimi engelle ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function () {
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Gönderiliyor...'; }
    });
  }
})();
