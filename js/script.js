(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLabel = (open) => window.FaseehI18n?.t(open ? 'nav.close' : 'nav.open') || (open ? 'Close navigation' : 'Open navigation');

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  if (navToggle && navMenu) {
    const mobile = window.matchMedia('(max-width: 780px)');
    const closeMenu = (restoreFocus = false) => {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', navLabel(false));
      navMenu.classList.remove('open');
      body.classList.remove('menu-open');
      navMenu.inert = mobile.matches;
      if (restoreFocus) navToggle.focus();
    };

    navToggle.addEventListener('click', () => {
      const opening = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(opening));
      navToggle.setAttribute('aria-label', navLabel(opening));
      navMenu.classList.toggle('open', opening);
      body.classList.toggle('menu-open', opening);
      navMenu.inert = !opening && mobile.matches;
    });

    navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
    mobile.addEventListener('change', () => closeMenu());
    document.addEventListener('faseeh:languagechange', () => closeMenu());
    document.addEventListener('keydown', (event) => {
      if (!navMenu.classList.contains('open')) return;
      if (event.key === 'Escape') closeMenu(true);
      if (event.key === 'Tab') {
        const focusable = Array.from(header.querySelectorAll('a[href], button:not([disabled])'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    closeMenu();
  }

  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 34);
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach((element) => element.classList.add('is-pending'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -35px' });
    reveals.forEach((element, index) => {
      element.style.setProperty('--delay', `${Math.min((index % 3) * 70, 140)}ms`);
      observer.observe(element);
    });
    window.setTimeout(() => reveals.forEach((element) => element.classList.add('is-visible')), 1600);
  } else {
    reveals.forEach((element) => element.classList.add('is-visible'));
  }

  const stories = Array.from(document.querySelectorAll('.story'));
  const storyCurrent = document.querySelector('[data-story-current]');
  let storyIndex = 0;
  const showStory = (index) => {
    if (!stories.length) return;
    storyIndex = (index + stories.length) % stories.length;
    stories.forEach((story, itemIndex) => story.classList.toggle('active', itemIndex === storyIndex));
    if (storyCurrent) storyCurrent.textContent = String(storyIndex + 1).padStart(2, '0');
  };
  document.querySelector('[data-story-prev]')?.addEventListener('click', () => showStory(storyIndex - 1));
  document.querySelector('[data-story-next]')?.addEventListener('click', () => showStory(storyIndex + 1));

  document.querySelectorAll('.faq-item button').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((faqItem) => {
        faqItem.classList.remove('open');
        const faqButton = faqItem.querySelector('button');
        faqButton.setAttribute('aria-expanded', 'false');
        faqButton.querySelector('i').textContent = '+';
      });
      if (!wasOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        button.querySelector('i').textContent = '−';
      }
    });
  });
})();
