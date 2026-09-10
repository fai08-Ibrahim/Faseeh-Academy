# Editing teacher profiles

All profile content lives in `js/data/teachers.js`. Card design and carousel behavior live separately in `css/teachers.css` and `js/teachers.js`; ordinary profile updates do not need changes to either file.

The initial six entries are placeholder profiles. Replace names, experience and qualifications with confirmed teacher information when available.

## Update, add or remove a teacher

- Edit the existing teacher's entry in the data file.
- Set `active: false` to temporarily hide an entry. Set it to `true` to show it again.
- Copy an entire entry to add a teacher and give it a unique `id`.
- Reorder entries to change the display order, or delete an entry to remove it.
- Keep both `en` and `ar` values up to date for the English and Arabic cards.

## Fields

| Field | What to edit |
| --- | --- |
| `id` | A unique, stable name such as `omar-khalid`. |
| `active` | `true` to display or `false` to hide. |
| `gender` | `male` or `female`, used for the fallback avatar. |
| `photo` | Image path such as `images/teachers/omar.jpg`. Leave `''` for the illustrated avatar. A photo that fails to load also falls back to the avatar. |
| `name`, `role`, `languages` | Text in each language. |
| `experienceYears` | A number such as `5`, displayed as `5+` with a translated experience label. |
| `qualifications` | Only this teacher's confirmed qualifications. Use `[]` to omit the row; copy a bilingual object inside the list for an additional qualification. There is no automatic Ijazah default. |
| `teachingMethods` | This teacher's experience with teaching methods. Empty strings omit the row. |
| `specialties` | Short specialty labels in each language. |
| `portraitColor`, `portraitAccent` | Hex colors for the illustrated avatar and background. Existing values match the site palette. |

Use a clear, consented portrait with the face near the upper center. The card crops photos automatically and lazy-loads them. The carousel adjusts automatically to the number of active teachers and supports swipe, keyboard navigation, Arabic RTL layout and reduced-motion preferences. On phones (up to 620px), a next-card preview, a brief hand gesture and progress dots invite swiping; arrow controls appear only on larger screens. The gesture stops on interaction and respects reduced-motion preferences.

Open `teachers.html` for English or `teachers.html?lang=ar` for Arabic. A visit without a language parameter always starts in English.
