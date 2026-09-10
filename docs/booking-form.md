# Assessment requests

`booking.html` offers two choices: an embedded enquiry form (primary) and direct Messenger contact. There is no academy-owned server, API key, or email password in the website. [FormSubmit](https://formsubmit.co/documentation) receives the form and forwards it to `faseehacademy3@gmail.com`.

## Before accepting real enquiries

1. Publish the website, including `booking.html`, `css/booking.css`, `js/booking-copy.js`, and `js/booking-form.js`.
2. Submit a clearly labelled test request from the published booking page using an email address you control. Do not enter a real student's information for this test.
3. Open the FormSubmit activation message sent to `faseehacademy3@gmail.com` and confirm the academy address. Check spam if needed. FormSubmit requires this one-time activation; it cannot be completed from the website code.
4. Submit a second test from both English and Arabic. Confirm that the academy receives a readable table, an informative subject, and the correct Reply-To address. Reply to the test email to verify the response reaches the requester.
5. Only then consider live email delivery verified. Local browser tests mock the provider; they do not send email or activate the inbox.

Until activation is complete, the provider may hold submissions instead of delivering them. Never rely on a website success message as proof of inbox delivery. See the provider's [activation help](https://formsubmit.co/help).

## What the academy receives

The email subject identifies Faseeh, a free assessment request, the contact's name, selected program and tier, and interface language. Arabic requests use a natural Arabic subject. For example:

> Faseeh Academy | Free assessment | Amina | Quran Memorization | Halaqah — $7/hour | EN

> فصيح | طلب تحديد مستوى مجاني | آمنة | حفظ القرآن الكريم | الحلقة — 7 دولارات للساعة | AR

The table contains a request reference, contact name and email, student age group, program, preferred tier, current level, country, preferred times, optional notes, reply language, consent, source, and submission time in UTC. The Reply-To header is the requester's email, so the academy can reply directly. These are requests to arrange an assessment, not confirmed appointments or subscriptions.

## Editing and routing

- `booking.html`: fields, native form action, shared header/footer.
- `css/booking.css`: scoped booking layout, form fields, mobile and RTL details.
- `js/booking-copy.js`: English and natural Modern Standard Arabic copy; loaded after shared translations and before `js/i18n.js`.
- `js/booking-form.js`: allowed selections, email payload, validation, and submission states. If changing the destination, update both the HTML form action and AJAX endpoint in this file.
- Existing enrollment buttons link to `booking.html`, in the same tab. Explicit Messenger contact links remain direct.

Supported context examples:

```text
booking.html?source=hero
booking.html?program=memorization&source=program
booking.html?plan=private&source=pricing
booking.html?program=beginner&plan=excellence&lang=ar
```

Only known program, plan, and source values are accepted. The language switch retains these selections. Bare URLs always open in English. Never put names, email addresses, notes, or other personal data in URL parameters.

## Delivery, privacy, and failure handling

- Required fields are contact name, email, student age group, country, and a program choice (including “Help me choose”), plus permission to contact the requester. A parent/guardian should fill in requests for under-18 learners. No exact birth dates, passwords, or payment data are requested.
- The form explains email follow-up and processing through FormSubmit, with a link to its privacy terms. Request information is not saved to cookies, local storage, session storage, analytics, or application logs by this implementation. Changing pages or refreshing discards unsent details.
- AJAX submits a JSON payload over HTTPS. The provider must explicitly accept it before the success panel appears. Provider activation notices, invalid responses, network failures, and timeouts do not show success. User-entered details remain available after failure, with Messenger as an alternative.
- Duplicate clicks are blocked during submission. After success, the form is hidden and further submissions from that instance are blocked. A reference is retained across retries to help the academy recognize duplicates. A timeout can still represent an accepted request, so there is no automatic retry.
- A honeypot and the provider's filtering reduce spam. CAPTCHA is disabled for the inline flow; this is a usability trade-off, not a guarantee against abuse. If spam becomes a problem, use a provider-supported CAPTCHA flow (which may require leaving the page), or migrate to a service with an embedded challenge. Do not put private service credentials in JavaScript.
- With JavaScript disabled, the native POST uses FormSubmit's hosted flow and a fixed assessment subject. It does not use the visitor's email app. The normal JavaScript flow keeps validation and confirmation in the selected language within the Faseeh page.
- Opening the page as `file://` is not supported for submission; use a local HTTP server for mocked testing or the deployed HTTPS site for delivery verification.

## Checks without sending email

```sh
node scripts/verify-browser.mjs --pages=booking.html --widths=320,390,820,1440 --languages=en,ar --booking-flow
```

The booking-flow checks mock the email provider and block real FormSubmit requests. They exercise validation, preselected choices, email formatting, pending/success/failure states, and bilingual mobile layouts. Live delivery still needs the inbox checks above.
