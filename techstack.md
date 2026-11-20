# Elite Hair & Beauty: the tech stack, explained

A plain-language walkthrough of how elitehair.co.za is built, for whoever looks after it next.
The commands are in `README.md`.

## 1. The idea in one paragraph

The brief's own line is the design: **Beauty, elevated.** Everything comes into focus. The hero photograph sharpens
from a soft blur while the headline rises word by word; photographs across the site blur into focus as they scroll
in; before-and-after photos are a drag-to-compare slider, so a visitor *sees* the transformation. The look is a
fashion editorial in Burgundy & Dusty Rose: BeautyLuxury capitals for page titles, Cormorant for headings, DM Sans
for text, numbered sections, generous whitespace, light ivory pages broken by deep cherry and burgundy bands.

## 2. How a visit works

```
Visitor's browser
   |  https://elitehair.co.za
VPS Nginx (HTTPS certificate, the domain)            <- on the server, not in this project
   |  127.0.0.1:8105
frontend container: Nginx serving the built React site
   |  /api/* only
backend container: Express API (validates and saves forms, emails them, reads the shop)
   |                                   \
database container: MySQL 8.4          WooCommerce shop (SHOP_URL): products, basket, checkout, payment
```

Bookings never touch this server: every "Book" button opens the salon's Fresha pages.

## 3. What lives where

| Folder | What it is |
| --- | --- |
| `frontend/src/pages` | One file per page: Home, About, Hair, Beauty, Weddings, Team, Gallery, Shop, Contact, Privacy, 404 |
| `frontend/src/components/sections` | The big building blocks (home hero, page heroes, services triptych, experience, gallery showcase, reviews, final call to action) |
| `frontend/src/content` | All the words and facts: business details and booking links (`site.js`), team (`team.js`), services, reviews, story, photo list |
| `frontend/src/styles/index.css` | The design system: colours, type scale, spacing, buttons, the one easing curve |
| `frontend/src/utils/motion.js` | Animation timings (4 to 6 s for entrances, 0.6 to 1.2 s for interface feedback) |
| `backend/src` | The API: routes, validation, the three form tables, the shop reader |
| `tools/photos.py` | Turns the original photos into web-ready WebP files and the before/after pairs |

## 4. Changing things

- **Phone, hours, address, booking links**: `frontend/src/content/site.js`.
- **Team members**: `frontend/src/content/team.js` (add a `bio` line and it appears on the Team page). New portraits
  go through `tools/photos.py`.
- **A new photo**: put it in the asset folder, add a line to `tools/photos.py`, run `python3 tools/photos.py`.
- **Review count**: `reviewSummary` in `site.js` (currently 482, as shown on the old site's widget).
- **Music**: put the new file in `frontend/public/music`, list it in `frontend/src/content/music.js` and bump
  `MUSIC_VERSION`. Make sure each track's licence covers the website.
- **Welcome voice**: replace `frontend/public/audio/welcome.m4a` and bump the `?v=` in
  `frontend/src/components/layout/Intro.jsx`. Trim any silence after the voice so the music follows on.
- **Who appears on the booking page**: anyone in `team.js` with a `booking` link.
- **Shop products and prices**: change them in WooCommerce as before; the website picks them up within 10 minutes.

## 5. Forms and email

Contact messages, wedding enquiries and newsletter sign-ups are saved in MySQL first. If SMTP settings are in `.env`,
messages and wedding enquiries are also emailed to `MAIL_TO`, and brides get an acknowledgement. Newsletter
addresses collect in the `subscribers` table, ready to export to the mailing tool.

## 6. Deploying

GitHub Actions builds and tests every change, then (once switched on) deploys over SSH with `deploy/deploy.sh`,
which backs up the database first and rolls back automatically if the new version fails its health check.
See README "Deploy pipeline".
