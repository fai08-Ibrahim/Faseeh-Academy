/* Explicit language choice only: bare URLs always use English. No locale storage.
   data-i18n translates text-only elements; data-i18n-text translates direct text
   nodes, preserving child icons, line breaks and emphasis. Attributes use
   data-i18n-aria-label, data-i18n-placeholder, data-i18n-alt or data-i18n-content.
   Component API: FaseehI18n.language, t(key, fallback), translate(root).
   New components can listen for the bubbling document event faseeh:languagechange. */
(() => {
  const language = new URLSearchParams(window.location.search).get('lang') === 'ar' ? 'ar' : 'en';
  const dictionary = window.FaseehTranslations || {};
  const index = language === 'ar' ? 1 : 0;
  const t = (key, fallback = key) => dictionary[key]?.[index] ?? fallback;
  const translate = (root = document) => {
    root.querySelectorAll('[data-i18n]').forEach((node) => {
      node.textContent = t(node.dataset.i18n, node.textContent);
    });
    root.querySelectorAll('[data-i18n-text]').forEach((element) => {
      const keys = element.dataset.i18nText.split('|');
      const nodes = Array.from(element.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      nodes.forEach((node, i) => {
        if (!keys[i] || keys[i] === '_') return;
        const leading = node.textContent.match(/^\s*/)[0];
        const trailing = node.textContent.match(/\s*$/)[0];
        node.textContent = leading + t(keys[i], node.textContent.trim()) + trailing;
      });
    });
    ['aria-label', 'placeholder', 'alt', 'content', 'title'].forEach((attribute) => {
      root.querySelectorAll(`[data-i18n-${attribute}]`).forEach((node) => {
        node.setAttribute(attribute, t(node.getAttribute(`data-i18n-${attribute}`), node.getAttribute(attribute)));
      });
    });
  };

  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  window.FaseehI18n = Object.freeze({ language, t, translate });
  translate();

  // Same-site page links retain an explicit Arabic choice. Fragments stay local.
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || link.hasAttribute('data-language-switch')) return;
    const url = new URL(href, window.location.href);
    const sameSite = url.protocol === window.location.protocol && url.host === window.location.host;
    if (!sameSite || !/\.html$/i.test(url.pathname)) return;
    if (language === 'ar') url.searchParams.set('lang', 'ar');
    else url.searchParams.delete('lang');
    // Keep relative paths working for static hosting and local file previews.
    const originalPath = href.split(/[?#]/)[0];
    link.setAttribute('href', originalPath + url.search + url.hash);
  });

  document.querySelectorAll('[data-language-switch]').forEach((link) => {
    const next = language === 'en' ? 'ar' : 'en';
    const url = new URL(window.location.href);
    if (next === 'ar') url.searchParams.set('lang', 'ar');
    else url.searchParams.delete('lang');
    link.href = url.href;
    link.lang = next;
    link.hreflang = next;
    link.setAttribute('aria-label', t(next === 'ar' ? 'nav.languageArabic' : 'nav.languageEnglish'));
    link.querySelector('span').textContent = next === 'ar' ? 'العربية' : 'English';
  });
  document.dispatchEvent(new CustomEvent('faseeh:languagechange', { bubbles: true, detail: { language } }));
})();
