/** Static content/link checks; no browser, network, packages, or email sends. */
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = vm.createContext({ window: {} });
for (const file of ['js/translations.js', 'js/booking-copy.js']) {
  vm.runInContext(await readFile(path.join(root, file), 'utf8'), context, { filename: file });
}
const dictionary = context.window.FaseehTranslations;
const errors = [];
for (const [key, value] of Object.entries(dictionary)) {
  if (!Array.isArray(value) || value.length !== 2 || value.some((text) => typeof text !== 'string' || !text.trim())) {
    errors.push(`Missing English or Arabic copy: ${key}`);
  }
}

// Marketing is localized for each audience; bilingual teacher credentials are
// still valid and intentionally outside this narrow regression guard.
for (const key of ['home.description', 'hero.eyebrow', 'hero.lead', 'hero.proof', 'why.english', 'teachers.intro', 'teachers.english', 'teachers.heroIntro', 'faq.a2', 'footer.tagline', 'footer.taglineHome', 'about.description', 'about.intro']) {
  if (/بالإنجليزية|باللغة الإنجليزية|غير الناطقين بالعربية|معرفة سابقة بالعربية/.test(dictionary[key]?.[1] || '')) {
    errors.push(`Arabic audience mismatch: ${key}`);
  }
}

let bookingLinks = 0;
for (const file of (await readdir(root)).filter((name) => name.endsWith('.html'))) {
  const html = await readFile(path.join(root, file), 'utf8');
  for (const [, keys] of html.matchAll(/data-i18n(?:-text|-aria-label|-placeholder|-alt|-content|-title)?="([^"]+)"/g)) {
    for (const key of keys.split('|').filter((value) => value !== '_')) {
      if (!dictionary[key]) errors.push(`${file}: unknown translation key ${key}`);
    }
  }
  for (const [, attr] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|data:|#|\?)/i.test(attr)) continue;
    const local = attr.split(/[?#]/)[0];
    if (!local) continue;
    try { await access(path.join(root, local)); }
    catch { errors.push(`${file}: missing local target ${local}`); }
  }
  for (const [tag] of html.matchAll(/<a\b[^>]+>/g)) {
    if (/href="booking\.html/.test(tag)) {
      bookingLinks += 1;
      if (/target="_blank"/.test(tag)) errors.push(`${file}: booking link opens a new tab`);
    }
    if (/data-i18n(?:-text)?="(?:cta\.assessment|pricing\.choose\w+|programs\.ask|teachers\.match)"/.test(tag)
        && !/href="(?:booking\.html|#assessment-form)/.test(tag)) {
      errors.push(`${file}: enrollment CTA bypasses booking page`);
    }
  }
}
if (bookingLinks < 21) errors.push('Missing expected site enrollment links');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${Object.keys(dictionary).length} bilingual entries, local assets, and ${bookingLinks} enrollment links checked.`);
}
