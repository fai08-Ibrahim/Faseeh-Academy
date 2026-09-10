/* Card presentation and native-swipe carousel. Edit profiles in data/teachers.js. */
(() => {
  const sliders = document.querySelectorAll('[data-teacher-slider]');
  if (!sliders.length) return;
  const copy = {
    en: {
      carousel: 'Teacher profiles', carouselType: 'carousel', slideType: 'slide',
      previous: 'Previous', next: 'Next', previousLabel: 'Show previous teacher', nextLabel: 'Show next teacher',
      qualification: 'Qualification', teaching: 'Teaching experience', specialties: 'Specialties',
      experience: 'years teaching', browse: 'Swipe to explore', browseDesktop: 'Explore the team',
      position: 'Teacher carousel position', show: 'Show teacher', of: 'of',
      empty: 'Teacher profiles are being updated. Contact us to find your teacher.'
    },
    ar: {
      carousel: 'بطاقات المعلّمين', carouselType: 'عارض شرائح', slideType: 'بطاقة',
      previous: 'السابق', next: 'التالي', previousLabel: 'عرض المعلّم السابق', nextLabel: 'عرض المعلّم التالي',
      qualification: 'المؤهل', teaching: 'خبرة في تدريس', specialties: 'التخصصات',
      experience: 'سنوات خبرة', browse: 'اسحب للتعرّف على معلمينا', browseDesktop: 'تعرّف على معلمينا',
      position: 'التنقل بين المعلّمين', show: 'عرض المعلّم', of: 'من',
      empty: 'نحدّث بيانات معلمينا حاليًا. تواصل معنا لنساعدك على اختيار معلمك.'
    }
  };
  const language = () => window.FaseehI18n?.language === 'ar' ? 'ar' : 'en';
  const localized = (value) => typeof value === 'object' && value !== null
    ? value[language()] ?? value.en ?? '' : value ?? '';
  const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const color = (value, fallback) => /^#[\da-f]{3,8}$/i.test(value || '') ? value : fallback;
  const avatar = (teacher) => teacher.gender === 'female'
    ? `<svg class="teacher-avatar" viewBox="0 0 240 260" aria-hidden="true">
        <path d="M38 252c5-65 35-99 82-99s77 34 82 99" fill="${teacher.accent}"/>
        <path d="M68 162c-7-23-6-58 4-82 10-25 27-39 48-39s38 14 48 39c10 24 11 59 4 82-15-12-32-18-52-18s-37 6-52 18Z" fill="#f4f0e7"/>
        <ellipse cx="120" cy="104" rx="34" ry="42" fill="#c99e7d"/>
        <path d="M84 105c3-43 20-64 36-64s34 21 37 64c-8-24-20-36-37-36s-29 12-36 36Z" fill="${teacher.accent}"/>
        <path d="M102 106h1M137 106h1M109 125c7 5 15 5 22 0" fill="none" stroke="#6d4c3d" stroke-width="3" stroke-linecap="round"/>
        <path d="M72 154c13 18 29 27 48 27s35-9 48-27" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
      </svg>`
    : `<svg class="teacher-avatar" viewBox="0 0 240 260" aria-hidden="true">
        <path d="M37 252c6-61 35-94 83-94s77 33 83 94" fill="${teacher.accent}"/>
        <path d="M101 143h38v35h-38z" fill="#b98566"/>
        <ellipse cx="120" cy="101" rx="38" ry="48" fill="#c99e7d"/>
        <path d="M80 88c4-34 19-51 40-51s36 17 40 51c-10-9-24-14-40-14s-30 5-40 14Z" fill="${teacher.accent}"/>
        <path d="M84 63h72l-8-22H92l-8 22Z" fill="#f4f0e7" stroke="${teacher.accent}" stroke-width="3"/>
        <path d="M101 102h1M138 102h1M105 127c10 10 20 10 30 0" fill="none" stroke="#6d4c3d" stroke-width="3" stroke-linecap="round"/>
        <path d="M94 121c4 22 13 33 26 33s22-11 26-33c-7 8-16 12-26 12s-19-4-26-12Z" fill="#684c3c" opacity=".88"/>
      </svg>`;


  const arrow = (direction) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${direction === 'previous' ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function cardTemplate(teacher, index, total) {
    const labels = copy[language()];
    const name = escape(localized(teacher.name));
    const qualifications = (teacher.qualifications || []).map(localized).filter(Boolean);
    const methods = localized(teacher.teachingMethods);
    const tags = localized(teacher.specialties);
    const experience = Number(teacher.experienceYears);
    return `<article class="teacher-card" data-teacher-id="${escape(teacher.id)}" role="group" aria-roledescription="${labels.slideType}" aria-label="${index + 1} ${labels.of} ${total}: ${name}">
      <div class="teacher-portrait" style="--portrait-bg: ${color(teacher.portraitColor, '#dce4db')}">
        <span class="teacher-language">${escape(localized(teacher.languages))}</span>
        ${avatar({ ...teacher, accent: color(teacher.portraitAccent, '#486e61') })}
        ${teacher.photo ? `<img class="teacher-photo" src="${escape(teacher.photo)}" alt="${name}" loading="lazy" decoding="async" width="400" height="320">` : ''}
        ${Number.isFinite(experience) && experience > 0 ? `<span class="teacher-experience"><strong dir="ltr">${experience}+</strong><span>${labels.experience}</span></span>` : ''}
      </div>
      <div class="teacher-card-body">
        <p class="teacher-role">${escape(localized(teacher.role))}</p>
        <h3>${name}</h3>
        <dl class="teacher-details">
          ${qualifications.length ? `<div><dt>${labels.qualification}</dt><dd>${qualifications.map(escape).join('<br>')}</dd></div>` : ''}
          ${methods ? `<div><dt>${labels.teaching}</dt><dd>${escape(methods)}</dd></div>` : ''}
        </dl>
        ${Array.isArray(tags) && tags.length ? `<div class="teacher-tags" role="list" aria-label="${labels.specialties}">${tags.map((tag) => `<span role="listitem">${escape(tag)}</span>`).join('')}</div>` : ''}
      </div>
    </article>`;
  }

  sliders.forEach((slider, sliderIndex) => {
    const controls = slider.closest('section')?.querySelector('[data-teacher-controls]');
    const swipeCue = document.createElement('div');
    swipeCue.className = 'teacher-swipe-cue';
    slider.before(swipeCue);
    const navigation = document.createElement('div');
    navigation.className = 'teacher-navigation';
    slider.after(navigation);
    slider.id ||= `teacher-carousel-${sliderIndex + 1}`;
    slider.tabIndex = 0;
    slider.setAttribute('role', 'region');
    let teachers = [];
    let cards = [];
    let currentIndex = 0;
    let dotCount = 0;
    let animationFrame = 0;
    let hasInteracted = false;
    const isRtl = () => getComputedStyle(slider).direction === 'rtl';
    const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const visibleCount = () => cards.length
      ? Math.max(1, Math.floor((slider.clientWidth + 1) / cards[0].getBoundingClientRect().width)) : 0;
    const lastIndex = () => Math.max(0, cards.length - visibleCount());

    function moveTo(index, behavior = reducedMotion() ? 'auto' : 'smooth') {
      const target = cards[Math.max(0, Math.min(index, lastIndex()))];
      if (!target) return;
      const viewport = slider.getBoundingClientRect();
      const card = target.getBoundingClientRect();
      slider.scrollBy({ left: isRtl() ? card.right - viewport.right : card.left - viewport.left, behavior });
    }

    function updatePosition() {
      if (!cards.length) return;
      const labels = copy[language()];
      const viewport = slider.getBoundingClientRect();
      const distances = cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return Math.abs(isRtl() ? viewport.right - rect.right : rect.left - viewport.left);
      });
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      const atStart = Math.abs(slider.scrollLeft) < 2;
      const atEnd = maxScroll - Math.abs(slider.scrollLeft) < 2;
      currentIndex = atEnd ? lastIndex() : Math.min(lastIndex(), distances.indexOf(Math.min(...distances)));
      const previous = controls?.querySelector('[data-teacher-prev]');
      const next = controls?.querySelector('[data-teacher-next]');
      if (previous) previous.disabled = atStart;
      if (next) next.disabled = atEnd;
      const totalPositions = lastIndex() + 1;
      const dots = navigation.querySelector('.teacher-dots');
      if (dotCount !== totalPositions && dots) {
        dotCount = totalPositions;
        dots.innerHTML = Array.from({ length: totalPositions }, (_, index) => `<button type="button" data-teacher-position="${index}" aria-controls="${slider.id}" aria-label="${labels.show}: ${escape(localized(teachers[index].name))}"></button>`).join('');
      }
      dots?.querySelectorAll('button').forEach((button, index) => {
        if (index === currentIndex) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
      const position = navigation.querySelector('.teacher-count');
      const rangeEnd = Math.min(teachers.length, currentIndex + visibleCount());
      const range = `${currentIndex + 1}${rangeEnd > currentIndex + 1 ? `–${rangeEnd}` : ''} / ${teachers.length}`;
      if (position) position.textContent = range;
      const mobilePosition = swipeCue.querySelector('.teacher-mobile-count');
      if (mobilePosition) mobilePosition.textContent = range;
      cards.forEach((card, index) => card.classList.toggle('is-current', index >= currentIndex && index < rangeEnd));
      navigation.hidden = maxScroll < 2;
      swipeCue.hidden = maxScroll < 2;
      if (controls) controls.hidden = maxScroll < 2;
    }

    function schedulePositionUpdate() {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(() => {
        updatePosition();
        animationFrame = 0;
      });
    }

    function render() {
      const labels = copy[language()];
      const preservedIndex = currentIndex;
      teachers = (window.FASEEH_TEACHERS || []).filter((teacher) => teacher.active !== false);
      slider.setAttribute('aria-label', labels.carousel);
      slider.setAttribute('aria-roledescription', labels.carouselType);
      slider.innerHTML = teachers.length
        ? `<div class="teacher-track">${teachers.map((teacher, index) => cardTemplate(teacher, index, teachers.length)).join('')}</div>`
        : `<p class="teacher-empty">${labels.empty}</p>`;
      cards = Array.from(slider.querySelectorAll('.teacher-card'));
      slider.querySelectorAll('.teacher-photo').forEach((photo) => {
        const fallback = () => photo.remove();
        photo.addEventListener('error', fallback, { once: true });
        if (photo.complete && !photo.naturalWidth) fallback();
      });
      if (controls) {
        controls.innerHTML = `<button type="button" data-teacher-prev aria-label="${labels.previousLabel}" aria-controls="${slider.id}">${arrow('previous')}<span>${labels.previous}</span></button><button type="button" data-teacher-next aria-label="${labels.nextLabel}" aria-controls="${slider.id}"><span>${labels.next}</span>${arrow('next')}</button>`;
        controls.hidden = !teachers.length;
      }
      navigation.innerHTML = `<p class="teacher-swipe-hint"><span class="teacher-hint-mobile">${labels.browse}</span><span class="teacher-hint-desktop">${labels.browseDesktop}</span></p><div class="teacher-dots" role="group" aria-label="${labels.position}"></div><p class="teacher-count" dir="ltr" aria-live="polite" aria-atomic="true"></p>`;
      navigation.hidden = !teachers.length;
      swipeCue.innerHTML = `<p><span class="teacher-gesture" aria-hidden="true"><svg viewBox="0 0 52 38" fill="none"><path class="teacher-gesture-trail" d="M8 8h34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="1 5"/><g class="teacher-gesture-hand"><path d="M24 23V10a2.5 2.5 0 0 1 5 0v9l2-1a2 2 0 0 1 3 1l2-1a2 2 0 0 1 3 2v7c0 5-3 8-8 8h-1c-3 0-5-1-7-4l-5-6a2.4 2.4 0 0 1 3-3l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></g></svg></span><span>${labels.browse}</span></p><span class="teacher-mobile-count" dir="ltr" aria-live="polite" aria-atomic="true"></span>`;
      swipeCue.hidden = !teachers.length;
      dotCount = 0;
      requestAnimationFrame(() => {
        moveTo(preservedIndex, 'instant');
        updatePosition();
      });
    }

    controls?.addEventListener('click', (event) => {
      if (event.target.closest('[data-teacher-prev]')) moveTo(currentIndex - 1);
      if (event.target.closest('[data-teacher-next]')) moveTo(currentIndex + 1);
    });
    navigation.addEventListener('click', (event) => {
      const button = event.target.closest('[data-teacher-position]');
      if (button) {
        dismissSwipeAnimation();
        moveTo(Number(button.dataset.teacherPosition));
      }
    });
    // Demonstrate the gesture, never move the cards or interrupt native scrolling.
    function dismissSwipeAnimation() {
      hasInteracted = true;
      swipeCue.classList.remove('is-discovering');
    }
    slider.addEventListener('pointerdown', dismissSwipeAnimation, { passive: true });
    if ('IntersectionObserver' in window) {
      const discovery = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        if (!hasInteracted && !reducedMotion() && window.matchMedia('(max-width: 620px)').matches) {
          swipeCue.classList.add('is-discovering');
        }
        discovery.disconnect();
      }, { threshold: .25 });
      discovery.observe(slider);
    }
    slider.addEventListener('scroll', schedulePositionUpdate, { passive: true });
    slider.addEventListener('keydown', (event) => {
      if (event.target !== slider) return;
      const nextKey = isRtl() ? 'ArrowLeft' : 'ArrowRight';
      const previousKey = isRtl() ? 'ArrowRight' : 'ArrowLeft';
      if (![nextKey, previousKey, 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      dismissSwipeAnimation();
      moveTo(event.key === 'Home' ? 0 : event.key === 'End' ? lastIndex() : currentIndex + (event.key === nextKey ? 1 : -1));
    });
    if ('ResizeObserver' in window) new ResizeObserver(schedulePositionUpdate).observe(slider);
    else window.addEventListener('resize', schedulePositionUpdate);
    document.addEventListener('faseeh:languagechange', render);
    render();
  });
})();
