/*
  Teacher specialties live in one place so the homepage and teachers page stay in sync.
  Replace a profile object here when the academy is ready to publish a named teacher.
*/
const FASEEH_TEACHERS = [
  {
    monogram: 'ت',
    name: 'Women’s Tajweed Mentor',
    role: 'Recitation & pronunciation',
    specialty: 'Women',
    description: 'Patient, detail-focused support for women beginning their recitation or refining long-standing Tajweed habits.',
    tags: ['English guidance', 'Tajweed', 'Adults'],
    color: '#d7ddd2'
  },
  {
    monogram: 'ض',
    name: 'Children’s Quran Mentor',
    role: 'Young learners',
    specialty: 'Children',
    description: 'Warm, structured lessons that help children stay engaged while building strong reading and memorization habits.',
    tags: ['Children', 'Reading', 'Hifz'],
    color: '#ded2c0'
  },
  {
    monogram: 'ق',
    name: 'Men’s Quran Teacher',
    role: 'Tajweed & Hifz',
    specialty: 'Men & boys',
    description: 'Clear one-to-one guidance for men and young boys working toward accurate recitation and consistent revision.',
    tags: ['English guidance', 'Men', 'Hifz'],
    color: '#c9d7d0'
  },
  {
    monogram: 'ع',
    name: 'Arabic Foundations Tutor',
    role: 'Reading foundations',
    specialty: 'Beginners',
    description: 'Step-by-step teaching for learners who need to recognise letters, connect sounds and begin reading with confidence.',
    tags: ['Arabic', 'Beginners', 'Children'],
    color: '#d9d2c7'
  },
  {
    monogram: 'ح',
    name: 'Memorization Coach',
    role: 'Hifz & revision',
    specialty: 'All levels',
    description: 'A steady, realistic approach to memorization that balances new portions with the revision needed to retain them.',
    tags: ['Hifz', 'Revision', 'Accountability'],
    color: '#c8d3c4'
  }
];

(() => {
  const sliders = document.querySelectorAll('[data-teacher-slider]');
  if (!sliders.length) return;

  const cardTemplate = (teacher) => `
    <article class="teacher-card">
      <div class="teacher-portrait" style="--portrait-bg: ${teacher.color}">
        <span class="teacher-specialty">${teacher.specialty}</span>
        <span class="teacher-monogram" aria-hidden="true">${teacher.monogram}</span>
      </div>
      <div class="teacher-card-body">
        <h3>${teacher.name}</h3>
        <p class="teacher-role">${teacher.role}</p>
        <p>${teacher.description}</p>
        <div class="teacher-tags">${teacher.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      </div>
    </article>`;

  sliders.forEach((slider) => {
    const track = document.createElement('div');
    track.className = 'teacher-track';
    track.innerHTML = FASEEH_TEACHERS.map(cardTemplate).join('');
    slider.appendChild(track);

    let index = 0;
    let touchStart = 0;
    const visibleCards = () => window.innerWidth <= 540 ? 1 : window.innerWidth <= 1020 ? 2 : 3;
    const maxIndex = () => Math.max(0, FASEEH_TEACHERS.length - visibleCards());
    const update = () => {
      index = Math.min(index, maxIndex());
      const firstCard = track.querySelector('.teacher-card');
      if (!firstCard) return;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      track.style.transform = `translateX(-${index * (firstCard.getBoundingClientRect().width + gap)}px)`;
    };

    const controls = slider.closest('section')?.querySelector('[data-teacher-controls]');
    controls?.querySelector('[data-teacher-prev]')?.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      update();
    });
    controls?.querySelector('[data-teacher-next]')?.addEventListener('click', () => {
      index = Math.min(maxIndex(), index + 1);
      update();
    });
    slider.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (event) => {
      const distance = touchStart - event.changedTouches[0].clientX;
      if (Math.abs(distance) < 40) return;
      index = Math.min(maxIndex(), Math.max(0, index + (distance > 0 ? 1 : -1)));
      update();
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
