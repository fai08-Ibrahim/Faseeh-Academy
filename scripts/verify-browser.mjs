/**
 * Dependency-free responsive browser audit (Node 22+, Chrome or Edge).
 * Run: node scripts/verify-browser.mjs [--baseline]
 * Focused retry: --pages=teachers.html --widths=320,390 --languages=en,ar
 * Booking integration: --pages=booking.html --booking-flow (mocked delivery only)
 * Serves the working tree locally; reports and screenshots stay in OS temp.
 * No packages, website changes, form submissions, or external writes required.
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { access, mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyBooking } from './verify-booking.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseline = process.argv.includes('--baseline');
const option = (name) => process.argv.find((argument) => argument.startsWith(`--${name}=`))?.split('=')[1]?.split(',');
const outputDir = await mkdtemp(path.join(tmpdir(), 'faseeh-browser-audit-'));
const profileDir = path.join(outputDir, 'browser-profile');
await mkdir(profileDir);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (request, response) => {
  const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const pathname = path.resolve(root, '.' + (requested === '/' ? '/index.html' : requested));
  const relative = path.relative(root, pathname);
  if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some((part) => part.startsWith('.'))) {
    response.writeHead(403).end();
    return;
  }
  try {
    const data = await readFile(pathname);
    response.writeHead(200, { 'Content-Type': mime[path.extname(pathname)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(data);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const portFinder = createServer();
await new Promise((resolve) => portFinder.listen(0, '127.0.0.1', resolve));
const debuggingPort = portFinder.address().port;
await new Promise((resolve) => portFinder.close(resolve));
let executable;
for (const candidate of [process.env.FASEEH_BROWSER, 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].filter(Boolean)) {
  try { await access(candidate); executable = candidate; break; } catch { /* Try the next installed browser. */ }
}
if (!executable) throw new Error('Set FASEEH_BROWSER to a Chromium browser executable.');
const browser = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-features=Translate', `--remote-debugging-port=${debuggingPort}`, `--user-data-dir=${profileDir}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let browserErrors = '';
browser.stderr.on('data', (data) => { browserErrors += data.toString(); });
browser.on('error', (error) => { browserErrors += error.message; });
let socket;
let sequence = 0;
const pending = new Map();
const pageErrors = [];
const missingAssets = [];
let currentPage = 'initial';
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
  pending.set(id, { resolve, reject, timer });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description);
  return result.result.value;
};
const reports = [];
try {
  let tabs;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      tabs = await (await fetch(`http://127.0.0.1:${debuggingPort}/json`)).json();
      if (tabs.some((tab) => tab.type === 'page')) break;
    } catch { /* The browser is still opening. */ }
    await wait(100);
  }
  const tab = tabs?.find((candidate) => candidate.type === 'page');
  if (!tab) throw new Error(`Browser did not expose a page. ${browserErrors.slice(-2500)}`);
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  socket.addEventListener('message', (message) => {
    const data = JSON.parse(message.data);
    if (data.id) {
      const item = pending.get(data.id);
      if (!item) return;
      pending.delete(data.id);
      clearTimeout(item.timer);
      if (data.error) item.reject(new Error(JSON.stringify(data.error))); else item.resolve(data.result);
    } else if (data.method === 'Runtime.exceptionThrown') {
      pageErrors.push({ page: currentPage, detail: data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text });
    } else if (data.method === 'Network.responseReceived' && data.params.response.url.startsWith(origin) && data.params.response.status >= 400) {
      missingAssets.push({ page: currentPage, status: data.params.response.status, url: data.params.response.url });
    }
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  // Audits never send real registrations, including accidental native submits.
  await send('Network.setBlockedURLs', { urls: ['*://formsubmit.co/*', '*://*.formsubmit.co/*'] });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const sizes = option('widths')?.map(Number) || (baseline ? [390, 1440] : [320, 390, 820, 1440]);
  const languages = option('languages') || (baseline ? ['en'] : ['en', 'ar']);
  const pages = option('pages') || (baseline ? ['index.html', 'teachers.html'] : ['index.html', 'teachers.html', 'about.html', 'leave-review.html', 'booking.html']);
  for (const width of sizes) {
    const height = width < 600 ? 844 : 1000;
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    await send('Emulation.setTouchEmulationEnabled', { enabled: width < 600, maxTouchPoints: 5 });
    for (const language of languages) {
      for (const page of pages) {
        currentPage = `${page}:${language}:${width}`;
        await send('Page.navigate', { url: `${origin}/${page}${language === 'ar' ? '?lang=ar' : ''}` });
        for (let attempt = 0; attempt < 100; attempt += 1) {
          if (await evaluate(`document.readyState === 'complete' && location.pathname === ${JSON.stringify('/' + page)}`)) break;
          await wait(80);
        }
        await wait(300);
        const report = await evaluate(`(() => {
          const visible = element => { const r = element.getBoundingClientRect(); const s = getComputedStyle(element); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
          const languageControl = [...document.querySelectorAll('[data-language-switch], [data-language-toggle], [data-lang-switch], .language-switch, .language-toggle, [hreflang]')].filter(visible).map(element => ({ text: element.textContent.trim(), href: element.getAttribute('href'), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }));
          const overflowing = [...document.body.querySelectorAll('*')].filter(element => {
            if (!visible(element) || element.closest('.teacher-track, .nav-menu:not(.open)')) return false;
            const r = element.getBoundingClientRect();
            return r.left < -2 || r.right > innerWidth + 2;
          }).slice(0, 15).map(element => ({ tag: element.tagName, class: element.className?.baseVal ?? element.className, text: element.textContent.trim().slice(0, 80), left: Math.round(element.getBoundingClientRect().left), right: Math.round(element.getBoundingClientRect().right) }));
          const englishSnippets = [];
          if (document.documentElement.lang === 'ar') {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
              const text = node.textContent.trim();
              if (!visible(node.parentElement) || node.parentElement.closest('script, style, svg') || !/[a-z]{2,}/i.test(text)) continue;
              if (/^(?:Faseeh(?: Academy)?|English|faseehacademy3@gmail\\.com)$/i.test(text)) continue;
              englishSnippets.push(text.slice(0, 160));
            }
          }
          return { lang: document.documentElement.lang, dir: document.documentElement.dir, title: document.title, heading: document.querySelector('h1')?.textContent.trim(), viewport: innerWidth, pageWidth: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > innerWidth + 2, overflowing, languageControl, englishSnippets: [...new Set(englishSnippets)], englishAccessibleLabels: document.documentElement.lang === 'ar' ? [...document.querySelectorAll('[aria-label], [placeholder]')].filter(visible).flatMap(el => [el.getAttribute('aria-label'), el.getAttribute('placeholder')]).filter(text => text && /[a-z]{2,}/i.test(text)) : [], teacherCount: document.querySelectorAll('.teacher-card').length, localLinks: [...document.querySelectorAll('a[href]')].filter(a => a.origin === location.origin && a.pathname.endsWith('.html') && !a.hasAttribute('data-language-switch')).map(a => ({ text: a.textContent.trim().slice(0, 40), href: a.getAttribute('href'), language: new URL(a.href).searchParams.get('lang') || 'en' })), buttons: [...document.querySelectorAll('.carousel-controls button, [data-teacher-prev], [data-teacher-next]')].filter(visible).map(button => ({ text: button.textContent.trim(), label: button.getAttribute('aria-label'), width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height, disabled: button.disabled })) };
        })()`);
        report.page = page;
        report.width = width;
        report.expectedLanguage = language;
        report.errors = [];
        if (report.overflow) report.errors.push('Page has horizontal overflow');
        if (report.lang !== language) report.errors.push(`Expected ${language}, got ${report.lang}`);
        if (language === 'ar' && report.dir !== 'rtl') report.errors.push('Arabic page is not RTL');
        if (!baseline && !report.languageControl.length) report.errors.push('No visible language control found');
        if (!baseline && report.localLinks.some(link => link.language !== language)) report.errors.push('Internal page links do not preserve language');
        if (width < 600 && page !== 'leave-review.html') {
          report.menu = await evaluate(`(() => { const b = document.querySelector('.nav-toggle'); if (!b) return null; b.click(); const open = b.getAttribute('aria-expanded'); const menu = document.querySelector('.nav-menu'); const bounds = menu.getBoundingClientRect(); const label = b.getAttribute('aria-label'); b.click(); return { open, closed: b.getAttribute('aria-expanded'), left: bounds.left, right: bounds.right, label }; })()`);
          if (report.menu?.open !== 'true' || report.menu?.closed !== 'false') report.errors.push('Mobile menu did not open and close');
        }
        if (page === 'teachers.html') {
          const teacherState = `(() => { const s = document.querySelector('[data-teacher-slider]'); const c = s?.querySelector('.teacher-card'); return { scroll: s?.scrollLeft, firstLeft: c?.getBoundingClientRect().left, transform: s?.querySelector('.teacher-track')?.style.transform, current: document.querySelector('[data-teacher-current]')?.textContent, prevDisabled: document.querySelector('[data-teacher-prev]')?.disabled, nextDisabled: document.querySelector('[data-teacher-next]')?.disabled }; })()`;
          const initial = await evaluate(teacherState);
          if (width > 620) {
            if (report.buttons.length !== 2) report.errors.push('Desktop teacher arrows must remain visible');
            await evaluate(`document.querySelector('[data-teacher-next]')?.click()`);
            await wait(400);
            const next = await evaluate(teacherState);
            await evaluate(`document.querySelector('[data-teacher-prev]')?.click()`);
            await wait(400);
            const previous = await evaluate(teacherState);
            report.teacherNavigation = { initial, next, previous };
            if (Math.abs(initial.firstLeft - next.firstLeft) < 10) report.errors.push('Teacher next button did not move carousel');
            if (Math.abs(initial.firstLeft - previous.firstLeft) > 3) report.errors.push('Teacher previous button did not restore first position');
          } else {
            if (report.buttons.length) report.errors.push('Mobile teacher slider still displays arrows');
            report.swipeAffordance = await evaluate(`(() => {
              const slider = document.querySelector('[data-teacher-slider]');
              const viewport = slider.getBoundingClientRect();
              const next = slider.querySelectorAll('.teacher-card')[1].getBoundingClientRect();
              const cue = document.querySelector('.teacher-swipe-cue');
              return { peekWidth: Math.max(0, Math.min(viewport.right, next.right) - Math.max(viewport.left, next.left)), cueVisible: cue.getBoundingClientRect().height > 0, count: cue.querySelector('.teacher-mobile-count').textContent, gestureAnimation: getComputedStyle(cue.querySelector('.teacher-gesture-hand')).animationName };
            })()`);
            if (report.swipeAffordance.peekWidth < 20 || !report.swipeAffordance.cueVisible) report.errors.push('Mobile swipe preview or cue is missing');
            if (report.swipeAffordance.gestureAnimation !== 'none') report.errors.push('Swipe cue does not respect reduced motion');
          }
          if (width < 600) {
            const bounds = await evaluate(`(() => { const s = document.querySelector('[data-teacher-slider]'); s.scrollIntoView({block: 'center'}); const r = s.getBoundingClientRect(); return {left: r.left, right: r.right, y: Math.max(130, Math.min(innerHeight - 130, r.top + 120))}; })()`);
            const startX = language === 'ar' ? bounds.left + 60 : bounds.right - 60;
            const endX = language === 'ar' ? bounds.right - 60 : bounds.left + 60;
            await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: startX, y: bounds.y }] });
            for (let step = 1; step <= 7; step += 1) {
              await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: startX + (endX - startX) * step / 7, y: bounds.y }] });
              await wait(25);
            }
            await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
            await wait(450);
            report.teacherSwipe = await evaluate(teacherState);
            if (Math.abs(initial.firstLeft - report.teacherSwipe.firstLeft) < 10) report.errors.push('Teacher touch swipe did not move carousel');
            await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: endX, y: bounds.y }] });
            for (let step = 1; step <= 7; step += 1) {
              await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: endX + (startX - endX) * step / 7, y: bounds.y }] });
              await wait(25);
            }
            await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
            await wait(450);
            report.teacherReverseSwipe = await evaluate(teacherState);
            if (Math.abs(initial.firstLeft - report.teacherReverseSwipe.firstLeft) > 3) report.errors.push('Teacher reverse touch swipe did not restore first position');
            await evaluate(`window.scrollTo({top: 0, behavior: 'instant'})`);
          }
          if (!baseline && [390, 1440].includes(width)) {
            await evaluate(`document.querySelector('[data-teacher-slider]').focus({preventScroll: true})`);
            await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
            await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
            await wait(250);
            report.teacherKeyboardEnd = await evaluate(`(() => { const s = document.querySelector('[data-teacher-slider]'); const last = [...s.querySelectorAll('.teacher-card')].at(-1); const v = s.getBoundingClientRect(); const r = last.getBoundingClientRect(); return {nextDisabled: document.querySelector('[data-teacher-next]').disabled, count: document.querySelector('.teacher-count')?.textContent, lastFullyVisible: r.left >= v.left - 2 && r.right <= v.right + 2}; })()`);
            if (!report.teacherKeyboardEnd.nextDisabled || !report.teacherKeyboardEnd.lastFullyVisible) report.errors.push('Keyboard End did not reach last teacher with next disabled');
            await evaluate(`window.__faseehAuditRoster = window.FASEEH_TEACHERS`);
            report.rosterFixtures = [];
            for (const count of [0, 1, 2, 6]) {
              await evaluate(`window.FASEEH_TEACHERS = window.__faseehAuditRoster.map((teacher, index) => ({...teacher, active: index < ${count}})); document.dispatchEvent(new CustomEvent('faseeh:languagechange'))`);
              await wait(200);
              const fixture = await evaluate(`(() => { const visible = el => el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0; return {count: document.querySelectorAll('.teacher-card').length, controlsVisible: visible(document.querySelector('[data-teacher-controls]')), navigationVisible: visible(document.querySelector('.teacher-navigation')), cueVisible: visible(document.querySelector('.teacher-swipe-cue')), emptyMessage: document.querySelector('.teacher-empty')?.textContent}; })()`);
              fixture.requestedCount = count;
              report.rosterFixtures.push(fixture);
              if (fixture.count !== count) report.errors.push('Roster count did not follow active flags: ' + count);
              if (count <= 1 && (fixture.controlsVisible || fixture.navigationVisible || fixture.cueVisible)) report.errors.push('Unusable controls visible for ' + count + ' teachers');
            }
            await evaluate(`window.FASEEH_TEACHERS = window.__faseehAuditRoster; delete window.__faseehAuditRoster; document.dispatchEvent(new CustomEvent('faseeh:languagechange'))`);
            await wait(200);
            await evaluate(`document.querySelector('[data-teacher-slider]').focus({preventScroll: true})`);
            await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
            await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
            await wait(200);
            await evaluate(`document.activeElement.blur(); window.scrollTo({top: 0, behavior: 'instant'})`);
          }
        }
        const fullPage = [390, 1440].includes(width) && ['index.html', 'teachers.html', 'booking.html'].includes(page);
        const size = await evaluate(`({ width: document.documentElement.clientWidth, height: document.documentElement.scrollHeight })`);
        const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: fullPage, ...(fullPage ? { clip: { x: 0, y: 0, width: size.width, height: size.height, scale: 1 } } : {}) });
        report.screenshot = path.join(outputDir, `${page.replace('.html', '')}-${language}-${width}${fullPage ? '-full' : ''}.png`);
        await writeFile(report.screenshot, Buffer.from(screenshot.data, 'base64'));
        if (fullPage) {
          report.sectionScreenshots = [];
          const sections = page === 'index.html' ? ['.hero', '#programs', '#plans', '.footer'] : page === 'booking.html' ? ['.booking-choices', '#bookingForm'] : ['.teachers-page-section'];
          for (const selector of sections) {
            const bounds = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return null; const r = el.getBoundingClientRect(); return {x: Math.max(0, r.left + scrollX), y: Math.max(0, r.top + scrollY), width: Math.min(innerWidth, r.width), height: r.height, scale: 1}; })()`);
            if (!bounds) continue;
            const sectionShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: bounds });
            const sectionPath = path.join(outputDir, `${page.replace('.html', '')}-${language}-${width}-${selector.replace(/[.#]/g, '')}.png`);
            await writeFile(sectionPath, Buffer.from(sectionShot.data, 'base64'));
            report.sectionScreenshots.push(sectionPath);
          }
        }
        if (!baseline && width === 390) {
          const otherLanguage = language === 'en' ? 'ar' : 'en';
          const clickLanguage = async (expectedLanguage) => {
            await evaluate(`document.querySelector('[data-language-switch]')?.click()`);
            for (let attempt = 0; attempt < 100; attempt += 1) {
              try { if (await evaluate(`document.readyState === 'complete' && document.documentElement.lang === ${JSON.stringify(expectedLanguage)}`)) break; } catch { /* Navigation replaced the execution context. */ }
              await wait(80);
            }
            return evaluate(`({lang: document.documentElement.lang, dir: document.documentElement.dir, search: location.search, label: document.querySelector('[data-language-switch]')?.textContent.trim()})`);
          };
          report.languageSwitch = { toOther: await clickLanguage(otherLanguage), back: await clickLanguage(language) };
          if (report.languageSwitch.toOther.lang !== otherLanguage || report.languageSwitch.back.lang !== language) report.errors.push('Language switch did not change language and return');
          if (page === 'index.html' && language === 'ar') {
            await evaluate(`document.querySelector('.nav-menu a[href*="teachers.html"]')?.click()`);
            for (let attempt = 0; attempt < 100; attempt += 1) {
              try { if (await evaluate(`document.readyState === 'complete' && location.pathname === '/teachers.html'`)) break; } catch { /* Navigation is in progress. */ }
              await wait(80);
            }
            report.internalNavigation = await evaluate(`({lang: document.documentElement.lang, pathname: location.pathname, search: location.search})`);
            if (report.internalNavigation.lang !== 'ar' || report.internalNavigation.pathname !== '/teachers.html') report.errors.push('Arabic internal navigation did not reach Arabic teacher page');
          }
        }
        reports.push(report);
        console.log(JSON.stringify({ page: currentPage, errors: report.errors, lang: report.lang, overflow: report.overflow, screenshot: report.screenshot }));
      }
    }
  }
  if (process.argv.includes('--booking-flow')) {
    currentPage = 'booking.html:mocked-flow';
    const bookingReports = await verifyBooking({ evaluate, send, wait, origin });
    reports.push(...bookingReports);
    for (const report of bookingReports) console.log(JSON.stringify(report));
  }
  // Revisit an unqualified URL after Arabic navigation to verify English default.
  await send('Page.navigate', { url: `${origin}/index.html` });
  await wait(500);
  const defaultLanguage = await evaluate('document.documentElement.lang');
  const output = { origin, outputDir, defaultLanguage, pageErrors, missingAssets, reports };
  await writeFile(path.join(outputDir, 'report.json'), JSON.stringify(output, null, 2));
  console.log(JSON.stringify({ outputDir, defaultLanguage, javascriptErrors: pageErrors, missingAssets, failures: reports.filter(report => report.errors.length).length }));
  process.exitCode = pageErrors.length || missingAssets.length || reports.some(report => report.errors.length) || defaultLanguage !== 'en' ? 1 : 0;
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    try { await send('Browser.close'); } catch { /* Browser may close before replying. */ }
    socket.close();
  }
  if (browser.exitCode === null) browser.kill();
  server.close();
  for (const item of pending.values()) clearTimeout(item.timer);
}
