/* Static-site assessment enquiries. Delivery is handled by FormSubmit, not a
   visitor's email app. Activate the academy inbox before launch; see docs/booking-form.md. */
(() => {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const submit = document.getElementById('bookingSubmit');
  const submitLabel = submit.querySelector('[data-booking-submit-label]');
  const error = document.getElementById('bookingError');
  const success = document.getElementById('bookingSuccess');
  const t = (key) => window.FaseehI18n.t(key);
  const language = window.FaseehI18n.language;
  const field = (name) => form.elements.namedItem(name);
  const read = (name) => String(field(name)?.value || '').trim();
  const bilingual = (pair) => pair.join(' / ');
  const localized = (pair) => pair[language === 'ar' ? 1 : 0];
  const choices = {
    program: {
      unsure: ['Help me choose', 'أحتاج إلى المساعدة في الاختيار'],
      memorization: ['Quran Memorization', 'حفظ القرآن الكريم'],
      beginner: ['Tajweed for Beginners', 'التجويد للمبتدئين'],
      intermediate: ['Tajweed for Intermediate', 'التجويد للمستوى المتوسط'],
      makharij: ['Makharij Course', 'دورة مخارج الحروف'],
      qiraiyya: ["Qira’iyya Course", 'دورة القرائية'],
      arabic: ['Arabic Reading & Writing', 'القراءة والكتابة بالعربية']
    },
    plan: {
      unsure: ['Not decided yet', 'لم أحدد بعد'],
      halaqah: ['Halaqah — $7/hour', 'الحلقة — 7 دولارات للساعة'],
      private: ['Private — $10/hour', 'الفردية — 10 دولارات للساعة'],
      excellence: ['Excellence — $15/hour', 'التميّز — 15 دولارًا للساعة']
    },
    age: {
      under7: ['Under 7', 'أقل من 7 سنوات'],
      '7-12': ['7–12 years', 'من 7 إلى 12 سنة'],
      '13-17': ['13–17 years', 'من 13 إلى 17 سنة'],
      adult: ['18 or older', '18 سنة فأكثر']
    },
    level: {
      unsure: ['Not sure', 'لست متأكدًا من مستواي'],
      new: ['Complete beginner', 'مبتدئ من الصفر'],
      some: ['Some reading experience', 'لدي معرفة بأساسيات القراءة'],
      confident: ['Reading confidently; developing recitation', 'أقرأ جيدًا وأرغب في تحسين تلاوتي']
    }
  };
  const sources = {
    announcement: ['Announcement bar', 'الشريط العلوي'],
    header: ['Header', 'القائمة الرئيسية'],
    hero: ['Homepage introduction', 'مقدمة الصفحة الرئيسية'],
    assessment: ['Free assessment', 'تحديد المستوى المجاني'],
    final: ['Closing invitation', 'دعوة التسجيل في نهاية الصفحة'],
    program: ['Program enquiry', 'الاستفسار عن برنامج'],
    pricing: ['Pricing plans', 'باقات الدراسة'],
    teachers: ['Teacher enquiry', 'الاستفسار عن المعلمين'],
    about: ['About the academy', 'عن الأكاديمية']
  };
  const owns = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const query = new URLSearchParams(window.location.search);
  // Only known choices may enter the form; never render arbitrary URL content.
  ['program', 'plan'].forEach((name) => {
    const value = query.get(name);
    if (owns(choices[name], value)) field(name).value = value;
  });
  if (read('plan') !== 'unsure') field('plan').closest('details')?.setAttribute('open', '');

  let pending = false;
  let completed = false;
  let requestReference;
  const focusMessage = (element) => {
    element.focus({ preventScroll: true });
    element.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const showError = (key) => {
    error.textContent = t(key);
    error.hidden = false;
    focusMessage(error);
  };
  const controls = Array.from(form.querySelectorAll('input:not([type="hidden"]), select, textarea'));
  controls.forEach((control) => {
    const clear = () => {
      control.setCustomValidity('');
      control.removeAttribute('aria-invalid');
      error.hidden = true;
    };
    control.addEventListener('input', clear);
    control.addEventListener('change', clear);
  });

  function validate() {
    controls.forEach((control) => {
      control.setCustomValidity('');
      let message = '';
      if (control.required && (control.type === 'checkbox' ? !control.checked : !control.value.trim())) {
        message = t(control.type === 'checkbox' ? 'booking.consentRequired' : 'booking.required');
      } else if (control.type === 'email' && control.validity.typeMismatch) {
        message = t('booking.emailInvalid');
      } else if (choices[control.name] && !owns(choices[control.name], control.value)) {
        message = t('booking.required');
      }
      control.setCustomValidity(message);
      if (!control.validity.valid) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
    });
    const invalid = controls.find((control) => !control.validity.valid);
    if (!invalid) return true;
    invalid.closest('details')?.setAttribute('open', '');
    invalid.focus();
    invalid.reportValidity();
    return false;
  }

  function payload() {
    const name = read('name');
    const email = read('email');
    const program = choices.program[read('program')];
    const plan = choices.plan[read('plan')];
    const source = owns(sources, query.get('source')) ? sources[query.get('source')] : ['Website', 'الموقع'];
    const subject = [
      language === 'ar' ? 'فصيح | طلب تحديد مستوى مجاني' : 'Faseeh Academy | Free assessment',
      name, localized(program), localized(plan), language.toUpperCase()
    ].join(' | ').replace(/[\r\n\u0000-\u001f\u007f]/g, ' ').slice(0, 220);
    // Keep a reference across retries, so the academy can identify duplicates.
    requestReference ||= `FA-${window.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`}`;
    return {
      _subject: subject,
      _template: 'table',
      _replyto: email,
      _captcha: 'false',
      _honey: '',
      _url: window.location.origin + window.location.pathname,
      'Request / الطلب': 'Free assessment & trial session / تحديد مستوى وحصة تجريبية مجانًا',
      'Reference / رقم الطلب': requestReference,
      name,
      email,
      'Student age / عمر الطالب': bilingual(choices.age[read('age')]),
      'Program / البرنامج': bilingual(program),
      'Preferred tier / الباقة المطلوبة': bilingual(plan),
      'Current level / المستوى الحالي': bilingual(choices.level[read('level')]),
      'Country / البلد': read('country'),
      'Preferred lesson times / المواعيد المناسبة': read('schedule') || 'To be arranged / تُحدد بالتواصل مع الطالب',
      'Notes / ملاحظات': read('message') || 'None / لا توجد',
      'Reply language / لغة التواصل': language === 'ar' ? 'Arabic / العربية' : 'English / الإنجليزية',
      'Contact permission / الموافقة على التواصل': 'Agreed to email contact about this enquiry / وافق على التواصل بالبريد بشأن هذا الطلب',
      'Source / مصدر الطلب': bilingual(source),
      'Submitted at (UTC) / وقت الإرسال': new Date().toISOString()
    };
  }

  // With JavaScript unavailable, the native form still uses the provider. With
  // JavaScript, validate in the selected language and keep feedback on this page.
  form.noValidate = true;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending || completed) return;
    error.hidden = true;
    if (!validate()) return;
    if (read('_honey')) {
      showError('booking.error');
      return;
    }
    if (!/^https?:$/.test(window.location.protocol)) {
      showError('booking.localPreview');
      return;
    }

    const data = payload();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    pending = true;
    submit.disabled = true;
    submitLabel.textContent = t('booking.sending');
    form.setAttribute('aria-busy', 'true');
    // Freeze fields while this request is in flight to keep the visible form and
    // sent details consistent. Values are retained if the request fails.
    const previouslyDisabled = controls.map((control) => control.disabled);
    controls.forEach((control) => { control.disabled = true; });
    try {
      const response = await fetch('https://formsubmit.co/ajax/faseehacademy3@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit',
        body: JSON.stringify(data),
        signal: controller.signal
      });
      const result = await response.json();
      const activationRequired = /activat|confirm your (?:email|form)/i.test(String(result?.message || ''));
      if (!response.ok || ![true, 'true'].includes(result?.success) || activationRequired) {
        showError('booking.unconfirmed');
        return;
      }
      completed = true;
      const reference = document.getElementById('bookingReference');
      if (reference) reference.textContent = requestReference;
      form.hidden = true;
      success.hidden = false;
      focusMessage(success);
    } catch (failure) {
      // A timeout may still have reached the provider. Never retry automatically
      // or show a confirmation before the provider explicitly accepts it.
      showError(failure.name === 'AbortError' ? 'booking.timeout' : 'booking.error');
    } finally {
      window.clearTimeout(timeout);
      pending = false;
      submit.disabled = completed;
      submitLabel.textContent = t('booking.submit');
      form.removeAttribute('aria-busy');
      controls.forEach((control, index) => { control.disabled = previouslyDisabled[index]; });
    }
  });
})();
