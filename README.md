# Faseeh Academy website

A static website with shared styles and small JavaScript components. No build step or production dependencies are required. Publish the HTML files and the `css`, `js`, and `images` directories together.

## Content and styling

- `index.html`, `teachers.html`, `about.html`, `booking.html`, `leave-review.html`: English page content and translation keys.
- `css/styles.css`: original brand tokens and base components.
- `css/refinements.css`: shared visual and mobile refinements.
- `css/teachers.css`: teacher cards and carousel only.
- `css/booking.css`: booking choices and embedded assessment form.
- `css/i18n.css`: Arabic typography, language switch, and right-to-left adjustments.
- `js/data/teachers.js`: editable bilingual teacher records. The rendering and navigation code stays in `js/teachers.js`.
- `js/translations.js` and `js/i18n.js`: site translations and language selection.
- `js/booking-copy.js` and `js/booking-form.js`: bilingual booking content and serverless email submission.

Keep profile content in the data file rather than copying cards in HTML. See [the teacher editing guide](docs/teacher-profiles.md) for adding, hiding, or replacing teachers and photos.

## Assessment form setup

Enrollment buttons open a booking page with a short form and a Messenger alternative. FormSubmit delivers form requests to `faseehacademy3@gmail.com` with an informative subject, a table of details, and the visitor's Reply-To address. **The academy must activate the address using FormSubmit's confirmation email before relying on delivery.** See [setup, testing, and editing instructions](docs/booking-form.md). No private email credentials or academy server are needed.

## Languages

English opens by default, regardless of browser language or previous visits. The language switch adds `?lang=ar` for Arabic. Internal page links retain that explicit choice; switching to English removes the parameter. No language preference is saved in cookies or browser storage.

When changing copy, update its translation entry as well. Keep markup for decorative icons separate from translated text. Arabic uses its own font and a right-to-left layout; numbers, prices, and email addresses remain readable.

Localize for the audience, not word for word: English pages address English-speaking learners; Arabic pages address Arabic-speaking learners and parents. Do not carry English-support selling points or assumptions of no Arabic literacy into Arabic marketing copy. Teacher language skills remain factual in both languages, and beginner literacy courses remain available to those who need them.

Use `data-i18n="key"` on a text-only element. For mixed content such as `Book now <span>↗</span>`, use `data-i18n-text="key"` on the parent to preserve the arrow. Multiple direct text segments use keys separated by `|`; `_` leaves a segment unchanged. Translation values are `[English, Arabic]` pairs in `js/translations.js`.

## Preview and verification

Open `index.html` directly or serve the folder with a static web server. To run the browser checks on Windows with Node 22+ and Chrome or Edge installed:

```sh
node scripts/verify-content.mjs
node scripts/verify-browser.mjs
```

The script starts a temporary local server and an isolated headless browser. It checks all five pages in both languages at phone, tablet, and desktop widths, including teacher navigation and touch swiping. Screenshots and its report are saved to the system temporary directory. It does not publish the site or send messages. Add `--booking-flow` to exercise the form with a mocked email provider; live email delivery is a separate setup check.

The initial teacher names, avatars, and credentials are sample content. Replace them with confirmed details before presenting the profiles as your actual team. Student reviews require real feedback and permission; the review form opens an email draft for the student to send, and does not claim to submit to a nonexistent backend.
