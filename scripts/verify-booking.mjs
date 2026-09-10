/**
 * Booking-flow regression checks used by verify-browser.mjs --booking-flow.
 * Every delivery is mocked before page scripts execute. The parent harness also
 * blocks FormSubmit at the browser network layer: no actual emails are sent.
 */
export async function verifyBooking({ evaluate, send, wait, origin }) {
  const reports = [];
  const mock = await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `(() => {
      if (!location.pathname.endsWith('/booking.html')) return;
      const nativeFetch = window.fetch.bind(window);
      const nativeTimeout = window.setTimeout.bind(window);
      const state = window.__bookingMock = { mode: 'hold', requests: [], timeoutDelays: [], pending: [] };
      const response = (value, status = 200) => new Response(JSON.stringify(value), {status, headers: {'Content-Type': 'application/json'}});
      window.setTimeout = (callback, delay, ...args) => {
        if (state.mode === 'timeout' && delay >= 1000) {
          state.timeoutDelays.push(delay);
          return nativeTimeout(callback, 20, ...args);
        }
        return nativeTimeout(callback, delay, ...args);
      };
      window.fetch = (input, init = {}) => {
        const url = typeof input === 'string' ? input : input.url;
        if (!url.includes('formsubmit.co')) {
          if (new URL(url, location.href).origin === location.origin) return nativeFetch(input, init);
          return Promise.reject(new Error('External fetch blocked by booking audit'));
        }
        let data;
        try { data = JSON.parse(init.body); } catch { data = {unparsed: String(init.body)}; }
        state.requests.push({url, method: init.method, headers: Object.fromEntries(new Headers(init.headers)), data});
        if (state.mode === 'success') return Promise.resolve(response({success: true}));
        if (state.mode === 'string-success') return Promise.resolve(response({success: 'true'}));
        if (state.mode === 'false') return Promise.resolve(response({success: false, message: 'Unavailable'}));
        if (state.mode === 'string-false') return Promise.resolve(response({success: 'false'}));
        if (state.mode === 'ambiguous') return Promise.resolve(response({message: 'Request received'}));
        if (state.mode === 'null') return Promise.resolve(response(null));
        if (state.mode === 'activation') return Promise.resolve(response({success: true, message: 'Please activate your form by confirming your email.'}));
        if (state.mode === 'http-error') return Promise.resolve(response({success: true}, 503));
        if (state.mode === 'bad-json') return Promise.resolve(new Response('not JSON', {status: 200}));
        if (state.mode === 'network') return Promise.reject(new TypeError('Failed to fetch'));
        return new Promise((resolve, reject) => {
          if (init.signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
          init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), {once: true});
          state.pending.push({resolve: (value = {success: true}) => resolve(response(value)), reject});
        });
      };
    })();`
  });

  const load = async (language, query = 'program=beginner&plan=private&source=hero') => {
    await evaluate('window.__bookingAuditLeaving = true');
    await send('Page.navigate', { url: `${origin}/booking.html?${query}${language === 'ar' ? '&lang=ar' : ''}` });
    for (let attempt = 0; attempt < 100; attempt += 1) {
      try {
        if (await evaluate(`!window.__bookingAuditLeaving && document.readyState === 'complete' && document.documentElement.lang === ${JSON.stringify(language)} && !!document.querySelector('#bookingForm') && !!window.__bookingMock`)) return;
      } catch { /* Navigation replaced the execution context. */ }
      await wait(60);
    }
    throw new Error('Booking page or mock did not become ready');
  };
  const fill = async () => evaluate(`(() => {
    const form = document.querySelector('#bookingForm');
    const values = {name: 'Mariam Audit', email: 'parent@example.test', age: '7-12', program: 'beginner', country: 'United Arab Emirates', schedule: 'Weekends after 4pm, Dubai time', level: 'some', plan: 'private', message: 'Please help with correct pronunciation.'};
    for (const [name, value] of Object.entries(values)) {
      const field = form.elements.namedItem(name);
      if (!field) throw new Error('Missing booking field: ' + name);
      field.value = value;
      field.dispatchEvent(new Event('input', {bubbles: true}));
      field.dispatchEvent(new Event('change', {bubbles: true}));
    }
    form.elements.namedItem('consent').checked = true;
    form.elements.namedItem('consent').dispatchEvent(new Event('change', {bubbles: true}));
    return {valid: form.checkValidity(), choices: Object.fromEntries(['age', 'program', 'level', 'plan'].map(name => [name, form.elements.namedItem(name).selectedOptions[0].textContent.trim()]))};
  })()`);
  const submit = async (mode) => {
    await evaluate(`window.__bookingMock.mode = ${JSON.stringify(mode)}; document.querySelector('#bookingForm').requestSubmit()`);
    await wait(120);
  };
  const state = async () => evaluate(`(() => {
    const form = document.querySelector('#bookingForm');
    const visible = el => !!el && !el.hidden && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().height > 0;
    const error = document.querySelector('#bookingError');
    return {success: visible(document.querySelector('#bookingSuccess')), error: visible(error), errorText: error?.textContent.trim(), disabled: document.querySelector('#bookingSubmit').disabled, busy: form.getAttribute('aria-busy'), frozen: [...form.querySelectorAll('input:not([type="hidden"]), select, textarea')].every(field => field.disabled), name: form.elements.namedItem('name').value, email: form.elements.namedItem('email').value, requests: window.__bookingMock.requests, timeoutDelays: window.__bookingMock.timeoutDelays};
  })()`);
  try {
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    for (const language of ['en', 'ar']) {
      const report = {page: 'booking.html', kind: 'mocked-booking-flow', language, errors: [], scenarios: []};
      const check = (condition, message) => { if (!condition) report.errors.push(message); };
      await load(language);
      const initial = await evaluate(`(() => {
        const form = document.querySelector('#bookingForm');
        const switchURL = new URL(document.querySelector('[data-language-switch]').href);
        const messenger = [...document.querySelectorAll('a[href]')].filter(a => a.href.includes('m.me/61577487350894'));
        return {action: form.action, program: form.elements.namedItem('program').value, plan: form.elements.namedItem('plan').value, switchProgram: switchURL.searchParams.get('program'), switchPlan: switchURL.searchParams.get('plan'), switchLang: switchURL.searchParams.get('lang') || 'en', messengerCount: messenger.length, overflow: document.documentElement.scrollWidth > innerWidth + 2, dir: document.documentElement.dir};
      })()`);
      check(initial.action === 'https://formsubmit.co/faseehacademy3@gmail.com', 'Native form action must use academy email');
      check(initial.program === 'beginner' && initial.plan === 'private', 'Valid query choices were not prefilled');
      check(initial.switchProgram === 'beginner' && initial.switchPlan === 'private' && initial.switchLang !== language, 'Language switch loses booking preferences');
      check(initial.messengerCount > 0, 'Direct Messenger option is missing');
      check(!initial.overflow && initial.dir === (language === 'ar' ? 'rtl' : 'ltr'), 'Booking mobile layout or text direction is incorrect');
      report.scenarios.push({name: 'preferences, language link and mobile layout', ...initial});

      await submit('hold');
      check((await state()).requests.length === 0, 'Empty form attempted to submit');
      const filled = await fill();
      check(filled.valid, 'Valid fixture does not pass browser form validation');
      await evaluate(`document.querySelector('#bookingForm').elements.namedItem('email').value = 'not-an-email'`);
      await submit('hold');
      check((await state()).requests.length === 0, 'Invalid email attempted to submit');
      await fill();
      await evaluate(`document.querySelector('#bookingForm').elements.namedItem('consent').checked = false`);
      await submit('hold');
      check((await state()).requests.length === 0, 'Missing consent attempted to submit');
      report.scenarios.push({name: 'required fields, email and consent validation'});

      await fill();
      await evaluate(`document.querySelector('#bookingForm').elements.namedItem('name').value = '   '`);
      await submit('hold');
      check((await state()).requests.length === 0, 'Whitespace-only requester name attempted to submit');
      await fill();
      await evaluate(`document.querySelector('#bookingForm').elements.namedItem('_honey').value = 'automated spam'`);
      await submit('hold');
      check((await state()).requests.length === 0 && (await state()).error, 'Honeypot was not rejected safely');
      await evaluate(`document.querySelector('#bookingForm').elements.namedItem('_honey').value = ''`);
      report.scenarios.push({name: 'whitespace and honeypot rejection'});

      await fill();
      await submit('hold');
      await evaluate(`document.querySelector('#bookingForm').requestSubmit()`);
      const pending = await state();
      check(pending.requests.length === 1 && pending.disabled && !pending.success, 'Duplicate submission guard or pending state is incorrect');
      check(pending.busy === 'true' && pending.frozen, 'Pending request does not lock its input snapshot accessibly');
      const request = pending.requests[0] || {data: {}, headers: {}};
      const payload = request.data;
      check(request.url === 'https://formsubmit.co/ajax/faseehacademy3@gmail.com' && request.method?.toUpperCase() === 'POST', 'Wrong submission endpoint or method');
      check(request.headers['content-type']?.includes('application/json') && request.headers.accept?.includes('application/json'), 'Missing JSON request headers');
      check(payload.name === 'Mariam Audit' && payload.email === 'parent@example.test' && payload._replyto === 'parent@example.test', 'Requester name, email or reply-to missing');
      check(payload._template === 'table', 'Email must use the organized table template');
      check(typeof payload._subject === 'string' && ['Mariam Audit', filled.choices.program, filled.choices.plan, language.toUpperCase()].every(value => payload._subject.includes(value)), 'Email subject does not include requester, program, tier and language');
      const allValues = Object.values(payload).join(' | ');
      check(['United Arab Emirates', 'Weekends after 4pm, Dubai time', 'Please help with correct pronunciation.', filled.choices.age, filled.choices.level].every(value => allValues.includes(value)), 'Submitted email omits requested student details');
      check(!Object.keys(payload).some(key => /(?:secret|password|api[_-]?key)/i.test(key)), 'Payload unexpectedly includes secret credentials');
      report.scenarios.push({name: 'duplicate guard and organized email payload', request});
      await evaluate(`window.__bookingMock.pending[0].resolve({success: true})`);
      await wait(120);
      check((await state()).success, 'Confirmed boolean success did not show confirmation');
      await evaluate(`document.querySelector('#bookingForm').requestSubmit()`);
      check((await state()).requests.length === 1, 'Completed request can be submitted again');

      await load(language);
      await fill();
      await submit('string-success');
      check((await state()).success, 'Confirmed string success did not show confirmation');
      report.scenarios.push({name: 'explicit boolean and string success'});

      for (const mode of ['false', 'string-false', 'ambiguous', 'null', 'activation', 'http-error', 'bad-json', 'network', 'timeout']) {
        await load(language);
        await fill();
        await submit(mode);
        const result = await state();
        check(result.requests.length === 1 && !result.success && result.error && !result.disabled && !result.frozen && result.busy !== 'true' && result.name === 'Mariam Audit' && result.email === 'parent@example.test', `Failure handling is unsafe or loses entered information: ${mode}`);
        if (mode === 'timeout') check(result.timeoutDelays.some(delay => delay >= 1000), 'Timeout handler did not schedule an abort');
        if (language === 'ar') check(/[\u0600-\u06ff]/.test(result.errorText || ''), `Error message is not Arabic: ${mode}`);
        report.scenarios.push({name: mode, errorText: result.errorText, retainedInput: result.name, disabled: result.disabled, success: result.success, timeoutDelays: result.timeoutDelays});
      }

      // Last failure was a timed-out request. A visitor may explicitly retry,
      // but the reference must stay the same so the academy can spot duplicates.
      const timedOut = await state();
      await submit('success');
      const retried = await state();
      const reference = data => Object.entries(data).find(([key]) => key.startsWith('Reference /'))?.[1];
      check(retried.success && retried.requests.length === 2 && reference(timedOut.requests[0].data) === reference(retried.requests[1].data), 'Explicit retry did not preserve request reference');
      report.scenarios.push({name: 'explicit retry preserves reference'});

      await load(language, '');
      const minimal = await evaluate(`(() => {
        const form = document.querySelector('#bookingForm');
        for (const [name, value] of Object.entries({name: 'Mariam Audit', email: 'parent@example.test', age: 'adult', country: 'Egypt'})) {
          form.elements.namedItem(name).value = value;
        }
        form.elements.namedItem('consent').checked = true;
        return {program: form.elements.namedItem('program').value, plan: form.elements.namedItem('plan').value, level: form.elements.namedItem('level').value, valid: form.checkValidity()};
      })()`);
      check(minimal.valid && ['program', 'plan', 'level'].every(name => minimal[name] === 'unsure'), 'Short form defaults make optional preferences mandatory');
      await submit('success');
      check((await state()).success, 'Minimal required fields cannot submit without optional details');
      report.scenarios.push({name: 'minimal short form without optional details'});

      const attack = '<img src=x onerror="window.__unsafeBooking=true">';
      await load(language, `program=${encodeURIComponent(attack)}&plan=${encodeURIComponent(attack)}&source=${encodeURIComponent(attack)}&_subject=attacker&_next=https://example.test`);
      const tampered = await evaluate(`(() => {
        const form = document.querySelector('#bookingForm');
        return {program: form.elements.namedItem('program').value, plan: form.elements.namedItem('plan').value, unsafe: !!window.__unsafeBooking, html: form.innerHTML, next: form.elements.namedItem('_next')?.value};
      })()`);
      check(tampered.program === 'unsure' && tampered.plan === 'unsure', 'Untrusted query options were not rejected');
      check(!tampered.unsafe && !tampered.html.includes('onerror=') && tampered.next !== 'https://example.test', 'Query values injected unsafe content or redirect');
      await fill();
      await submit('hold');
      const safeRequest = (await state()).requests[0];
      check(safeRequest && !JSON.stringify(safeRequest.data).includes(attack) && safeRequest.data._subject !== 'attacker', 'Untrusted query values reached submission metadata');
      report.scenarios.push({name: 'query allowlist and injection rejection'});
      reports.push(report);
    }
  } finally {
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: mock.identifier });
  }
  return reports;
}
