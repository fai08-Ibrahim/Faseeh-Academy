(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  if (navToggle && navMenu) {
    const closeMenu = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
      navMenu.classList.remove('open');
      body.classList.remove('menu-open');
    };

    navToggle.addEventListener('click', () => {
      const opening = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(opening));
      navToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
      navMenu.classList.toggle('open', opening);
      body.classList.toggle('menu-open', opening);
    });

    navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 780) closeMenu();
    });
  }

  if (header) {
    const anchor = header.offsetTop + 100;
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-stuck', window.scrollY > anchor);
      body.style.paddingTop = header.classList.contains('is-stuck') ? `${header.offsetHeight}px` : '0px';
    }, { passive: true });
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
