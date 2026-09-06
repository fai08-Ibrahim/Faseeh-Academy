/*
  Temporary profile content lives here so real teacher details can be replaced
  later without changing the page markup or carousel logic.
*/
const FASEEH_TEACHERS = [
  {
    name: 'Ustadh Omar Khalid',
    gender: 'male',
    role: 'Quran & Tajweed Teacher',
    languages: 'Arabic & English',
    experience: '3+ years',
    qualification: 'Ijazah in Hafs ‘an Asim',
    teachingMethod: 'Noor Al-Bayan & Al-Nouraniyyah',
    tags: ['Quran Recitation', 'Tajweed', 'Memorization'],
    color: '#d7cdbf',
    accent: '#7a654b'
  },
  {
    name: 'Ustadha Maryam Farid',
    gender: 'female',
    role: 'Quran & Tajweed Teacher',
    languages: 'Arabic & English',
    experience: '4+ years',
    qualification: 'Ijazah in Hafs ‘an Asim',
    teachingMethod: 'Noor Al-Bayan & Al-Nouraniyyah',
    tags: ['Quran Recitation', 'Tajweed', 'Memorization'],
    color: '#d9ded3',
    accent: '#486e61'
  },
  {
    name: 'Ustadh Ibrahim Hassan',
    gender: 'male',
    role: 'Quran & Tajweed Teacher',
    languages: 'Arabic & English',
    experience: '5+ years',
    qualification: 'Ijazah in Hafs ‘an Asim',
    teachingMethod: 'Noor Al-Bayan & Al-Nouraniyyah',
    tags: ['Quran Recitation', 'Tajweed', 'Memorization'],
    color: '#d6d8c8',
    accent: '#697352'
  },
  {
    name: 'Ustadha Amina Saeed',
    gender: 'female',
    role: 'Quran & Tajweed Teacher',
    languages: 'Arabic & English',
    experience: '6+ years',
    qualification: 'Ijazah in Hafs ‘an Asim',
    teachingMethod: 'Noor Al-Bayan & Al-Nouraniyyah',
    tags: ['Quran Recitation', 'Tajweed', 'Memorization'],
    color: '#cedbd6',
    accent: '#3e6a5d'
  },
  {
    name: 'Ustadh Yusuf Kareem',
    gender: 'male',
    role: 'Quran & Tajweed Teacher',
    languages: 'Arabic & English',
    experience: '8+ years',
    qualification: 'Ijazah in Hafs ‘an Asim',
    teachingMethod: 'Noor Al-Bayan & Al-Nouraniyyah',
    tags: ['Quran Recitation', 'Tajweed', 'Memorization'],
    color: '#d8d1bf',
    accent: '#6d5b43'
  },
  {
    name: 'Ustadha Sarah Ahmed',
    gender: 'female',
    role: 'Quran & Tajweed Teacher',
    languages: 'Arabic & English',
    experience: '10+ years',
    qualification: 'Ijazah in Hafs ‘an Asim',
    teachingMethod: 'Noor Al-Bayan & Al-Nouraniyyah',
    tags: ['Quran Recitation', 'Tajweed', 'Memorization'],
    color: '#d8ded0',
    accent: '#526f62'
  }
];

(() => {
  const sliders = document.querySelectorAll('[data-teacher-slider]');
  if (!sliders.length) return;

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

  const cardTemplate = (teacher) => `
    <article class="teacher-card">
      <div class="teacher-portrait is-${teacher.gender}" style="--portrait-bg: ${teacher.color}">
        <span class="teacher-specialty">${teacher.languages}</span>
        ${avatar(teacher)}
      </div>
      <div class="teacher-card-body">
        <h3>${teacher.name}</h3>
        <p class="teacher-role">${teacher.role}</p>
        <dl class="teacher-details">
          <div><dt>Experience</dt><dd>${teacher.experience}</dd></div>
          <div><dt>Qualification</dt><dd>${teacher.qualification}</dd></div>
          <div><dt>Teaching</dt><dd>${teacher.teachingMethod}</dd></div>
        </dl>
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
