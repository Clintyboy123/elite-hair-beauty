# Elite Hair & Beauty

The redesigned website for Elite Hair & Beauty, a hair and beauty salon at The1054, 254 Main Road, Walmer, Gqeberha: services, team, gallery, an online shop front for the existing WooCommerce store, Fresha booking links, and contact, wedding and newsletter forms saved in a database.

- **Domain:** elitehair.co.za
- **Compose project name:** `elitehair`
- **Host port (VPS Nginx forwards here):** `8105`

## How it fits together

```
Browser
   |
VPS Nginx  (HTTPS, domain; lives on the server, not in this project)
   |
frontend container  (Nginx: serves the built React site)
   |-- /api/*  -->  backend container  (Express API)
                        |
                    database container  (MySQL, data kept in a Docker volume)
```

Only the frontend is reachable from the server itself (on `127.0.0.1:8105`). The API and the database
can only be reached from inside this site's own Docker network. Every website on the VPS is its own stack like
this one, with its own database, so sites cannot affect each other.

## Technologies

| Part | Built with |
| --- | --- |
| Frontend | React (JavaScript), Vite, Tailwind CSS, Motion for React, React Router, Axios, Lucide React |
| Backend | Node.js, Express, Sequelize, express-validator, Helmet, express-rate-limit |
| Database | MySQL 8.4 |
| Hosting | Docker Compose, Nginx |

## Folders

```
frontend/   the website people see
  src/pages        one file per page
  src/components   reusable pieces (ui/ = buttons, fields, cards ...)
  src/layouts      shared page frames (header, footer)
  src/services     api.js: the one place that talks to the backend
  src/styles       index.css: colours, fonts and easing (the design tokens)
  nginx/           how the site and /api are served in production
backend/    the API and business logic
  src/routes -> controllers -> services -> models   one request, top to bottom
  src/migrations   every change to the database structure, in order
  src/seeders      starting data
docker-compose.yml       the production stack
docker-compose.dev.yml   extra settings for local development only
.env.example             list of settings; copy to .env
scripts/smoke-test.sh    builds the stack and checks it works
```

## Settings (.env)

```bash
cp .env.example .env
```

Open `.env` and set the name, port and passwords. Generate each password with:

```bash
openssl rand -base64 32
```

`.env` holds real passwords. It is ignored by git and must never be committed or sent to anyone.

- **SMTP_*, MAIL_FROM, MAIL_TO**: email for the forms. Leave `SMTP_HOST` empty and every submission is still saved
  (tables `enquiries`, `wedding_enquiries`, `subscribers`); nothing is emailed until it is filled in.
- **SHOP_URL**: where the salon's WooCommerce shop lives. Today that is `https://www.elitehair.co.za` (WordPress).
  When this site takes over the domain, WordPress must move to its own address (for example
  `https://shop.elitehair.co.za`) and this value must change with it, or product data and add-to-basket stop working.
- **SHOP_CACHE_MINUTES**: how long product data is cached before the shop is asked again (default 10).

## Run it

Build and start (also the command for the first launch on the VPS):

```bash
docker compose up -d --build
```

Check that all three containers are `healthy`:

```bash
docker compose ps
```

Stop the site (the database is kept):

```bash
docker compose down
```

> Never add `-v` to `down` unless you mean to delete the database. `docker compose down -v` erases all saved data.

Full check of the production build:

```bash
./scripts/smoke-test.sh
```

## Logs

```bash
docker compose logs -f backend
```

Swap `backend` for `frontend` or `database`, or leave the name off to see all three.

## Database migrations

Migrations run automatically every time the backend container starts. To run or inspect them by hand:

```bash
docker compose exec backend npm run migrate
```

```bash
docker compose exec backend npm run migrate:status
```

Undo the most recent migration:

```bash
docker compose exec backend npm run migrate:undo
```

Load starting data (only when the project has seeders):

```bash
docker compose exec backend npm run seed
```

## The API

The API is not public on its own port. It is reached through the site: `https://elitehair.co.za/api/...`

Health check, from the VPS:

```bash
curl http://127.0.0.1:8105/api/health
```

Expected: `{"success":true,"message":"API is operational","database":"connected"}`

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/api/health` | API and database status (used by Docker) |
| POST | `/api/enquiries` | Contact form: name, email, phone (optional), subject, message |
| POST | `/api/wedding-enquiries` | Wedding enquiry: name, email, phone, weddingDate, venue, partySize, services[], message |
| POST | `/api/subscribers` | Newsletter sign-up: email |
| GET | `/api/shop/products` | Every product from the WooCommerce shop, with brands and the basket URL (cached) |
| GET | `/api/shop/products/:id` | One product with its description and options (variations), each with a ready add-to-basket link |

Form routes are rate limited (10 per hour per visitor) and reject the hidden honeypot field.

## Back up the database

```bash
mkdir -p backups && docker compose exec -T database sh -c 'exec mysqldump --single-transaction --no-tablespaces -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' | gzip > "backups/$(date +%F-%H%M).sql.gz"
```

Restore a backup (replaces the current data):

```bash
gunzip -c backups/FILE.sql.gz | docker compose exec -T database sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"'
```

Take a backup before every update. Keep copies somewhere other than the VPS.

## Deploying with GitHub Actions

Push to `main` and `.github/workflows/ci-cd.yml` does the rest:

1. **verify:** builds both apps and runs `scripts/smoke-test.sh` against the real Docker stack.
2. **image:** pushes `ghcr.io/<owner>/<repo>-frontend` and `-backend`, tagged `sha-<commit>`.
3. **deploy:** over SSH it runs `deploy/deploy.sh`, which backs up the database and uploads, pulls the images,
   restarts, waits for all three containers to be healthy, and rolls back to the previous images by itself if
   they aren't.

Pull requests only run step 1.

One-time setup:

1. **Repository secrets:** `DEPLOY_HOST`, `DEPLOY_USER` (in the docker group), `DEPLOY_SSH_KEY`, `DEPLOY_PATH`
   (e.g. `/srv/elitehair`), and `DEPLOY_PORT` if it isn't 22. Optional variable: `SITE_URL`.
2. **On the VPS:** create `DEPLOY_PATH` containing a filled-in `.env` (new passwords, a free `FRONTEND_PORT`).
3. **Log the VPS in to GHCR once**, with a token that has only `read:packages`:

```bash
echo "<token>" | docker login ghcr.io -u <github-username> --password-stdin
```

4. **Switch deploying on:** add the repository variable `DEPLOY_ENABLED` = `true`. Until it's set, the deploy job is
   skipped, so pushes stay green while the server isn't ready.

Roll back by hand to an earlier commit's images:

```bash
./deploy/deploy.sh ghcr.io/<owner>/<repo>-frontend:sha-<old> ghcr.io/<owner>/<repo>-backend:sha-<old>
```

## Update and redeploy

Without GitHub, on a server that builds from the source:

1. Back up the database (above).
2. Get the new version of the project onto the VPS (replace the project files, keeping `.env`).
3. Rebuild and restart. New migrations are applied on start:

```bash
docker compose up -d --build
```

4. Confirm everything is healthy:

```bash
docker compose ps
```

5. Clear out old image layers:

```bash
docker image prune -f
```

## Local development

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build database backend
```

```bash
cd frontend && npm install && npm run dev
```

The site runs on the address Vite prints, with live reload. `/api` is forwarded to the backend container.

## VPS Nginx (the server's own reverse proxy)

This project does not touch the VPS-level Nginx. Add a server block like this on the VPS by hand, then reload Nginx.
The certificate paths assume Let's Encrypt; adjust them to how SSL is managed on the server.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name elitehair.co.za www.elitehair.co.za;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;   # Nginx older than 1.25.1: remove this line and use "listen 443 ssl http2;"
    server_name elitehair.co.za www.elitehair.co.za;

    ssl_certificate     /etc/letsencrypt/live/elitehair.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/elitehair.co.za/privkey.pem;

    # Keep in step with client_max_body_size in frontend/nginx/default.conf
    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:8105;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Only if this site uses WebSockets:
        # proxy_set_header Upgrade $http_upgrade;
        # proxy_set_header Connection "upgrade";
    }
}
```

## Technical decisions, in plain language

- **Welcome intro and music.** Every full load opens with "WELCOME" and a short welcome voice
  (`frontend/public/audio/welcome.m4a`), then hands over to the page; the background music
  (`frontend/public/music`, listed in `frontend/src/content/music.js`) follows straight after. Browsers only allow
  sound once a visitor has clicked or tapped, so where sound is blocked the intro runs silently and the voice plays
  at the visitor's first click. Bump the `?v=` in `Intro.jsx` / `MUSIC_VERSION` when replacing audio files.
- **Booking page** (`/book`): every bookable stylist and therapist with their own Fresha link, plus "first
  available". All general Book buttons on the site lead here.
- **Bookings stay on Fresha.** Every "Book" button goes to the exact Fresha page the old site used (salon page,
  hair menu, each stylist's own link, and Ilahm's and Megan's separate beauty diaries). There is no booking system
  in this site to maintain, and availability and prices are always live.
- **The shop stays on WooCommerce.** The website shows the products in its own design, reading them from the shop's
  public Store API. "Add to basket" hands over to the shop's own basket, checkout, payment and delivery, using
  WooCommerce's standard add-to-cart links (tested against the live shop on 2026-11-20). Nothing about payments changes.
- **Forms are saved first, emailed second**, so a mail problem never loses a wedding enquiry.
- **Photography**: the salon's own photos are used everywhere, and only those appear in the gallery. Where the salon
  has no photography yet (campaign hero, bridal, lashes, nails, facials, massage), licence-free Unsplash images are
  used and credited in `frontend/src/content/photos.json`. `tools/photos.py` exports every photo as WebP in up to
  three sizes and splits the before/after screenshots into matching halves for the drag-to-compare slider.
- **Fonts**: BeautyLuxury for H1 page titles, Cormorant Garamond for headings, DM Sans for text, all self-hosted.
  BeautyLuxury is licensed for personal use only; buy the commercial licence (nirmanavisual.com) before launch.
- **Motion**: one ease-out curve (0.16, 1, 0.3, 1) everywhere; major entrances run 4 to 6 seconds, interface
  feedback 0.6 to 1.2 seconds. Visitors who ask their device for less motion get simple fades.
- **SEO**: per-page titles, descriptions and canonical links, Open Graph image, HairSalon/BeautySalon structured
  data in `index.html`, `sitemap.xml` and `robots.txt`. The site is rendered in the browser, so search engines see
  the defaults in `index.html` first; Google renders the rest.
