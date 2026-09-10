(() => {
  const form = document.getElementById('reviewForm');
  const confirmation = document.getElementById('reviewSuccess');
  if (!form || !confirmation) return;
  const t = (key) => window.FaseehI18n.t(key);
  const fields = Array.from(form.querySelectorAll('[required]'));
  fields.forEach((field) => field.addEventListener('input', () => field.setCustomValidity('')));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    fields.forEach((field) => field.setCustomValidity(field.value.trim() ? '' : t('review.required')));
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [
      `${t('review.name')}: ${data.get('name').trim()}`,
      `${t('review.country')}: ${data.get('country').trim()}`,
      `${t('review.role')}: ${t(`review.${data.get('role')}`)}`,
      '', data.get('message').trim()
    ];
    window.location.href = `mailto:faseehacademy3@gmail.com?subject=${encodeURIComponent(t('review.emailSubject'))}&body=${encodeURIComponent(lines.join('\n'))}`;
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  });
  document.getElementById('submitAnother')?.addEventListener('click', () => {
    confirmation.hidden = true;
    document.getElementById('reviewText').focus();
  });
})();
