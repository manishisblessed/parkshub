# AGRO PARKS SOLUTION PRIVATE LIMITED

Corporate website and operating system for AGRO PARKS SOLUTION PRIVATE LIMITED (`https://www.agroparks.in`).

The public site explains the company's authorised agricultural business and accepts enquiries. The admin tools record content, partners, procurement notes, farms, and inventory. Payments, logistics, SMS, WhatsApp, and other external systems stay disconnected until real credentials and a business decision exist.

## Technology

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM with SQLite for local development
- PostgreSQL / Neon as the production database target
- Zod validation
- Session cookies signed with JOSE
- bcrypt password hashing
- Nodemailer, used only when SMTP is configured

SQLite is the default so the project runs without a hosted database. The schema uses types that PostgreSQL also supports. Switch the datasource provider when you move to Neon, then create a fresh migration. Do not copy the SQLite file into production.

## Corporate facts used on the site

These come from the certificate of incorporation and the GST certificate in `docs/`. Personal identity documents in that folder are not published.

- Incorporated on 23 September 2026
- CIN `U01619DL2026PTC470870`
- GSTIN `07ABGCA8036N1Z9`
- Registered office: Plot No. 8, Sector-14, Dwarka City Centre, Amberhai, South West Delhi, New Delhi – 110075
- GST principal place of business: 3rd Floor, TF-9, Eros Metro Mall, Sector 14 Dwarka, New Delhi – 110078
- Directors named on the GST record: Vinay Bajpayee and Manish Kumar Shah

The site does not invent operating history, clients, capacities, prices, stock, or certifications. Catalogue rows are indicative enquiry listings. Legal pages are drafts until an editor marks them published.

Photographs in `public/images` are illustrative stock images. They are not company farms, facilities, or people.

## Requirements

- Node.js 22 or 24
- npm

## Installation

```bash
npm install
copy .env.example .env
```

Set `AUTH_SECRET` to at least 32 random characters and set `ADMIN_PASSWORD` before seeding. The checked-in example password is not a production credential.

```bash
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

The first seed creates a super administrator from `ADMIN_EMAIL` and `ADMIN_PASSWORD`, and marks that email verified. Later seeds do not reset the password. The seed refuses the documented development password when `NODE_ENV=production`.

Development sign-in, after using the password in your local `.env`:

- Email: the value of `ADMIN_EMAIL` (default `admin@agroparks.in`)
- Password: the value of `ADMIN_PASSWORD`

Change that password before any shared or public deployment.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create a development migration |
| `npm run db:seed` | Seed roles, pages, catalogue, and the first admin |
| `npm run db:setup` | Apply migrations and seed |

## Environment

See `.env.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | SQLite file locally, or a PostgreSQL URL in production |
| `AUTH_SECRET` | Yes | Signs the session cookie. At least 32 characters |
| `ADMIN_EMAIL` | For seed | First super administrator |
| `ADMIN_PASSWORD` | For seed | First super administrator password |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL, no trailing slash |
| `SMTP_HOST` | No | When empty, email is skipped and an in-app notice is stored |
| `SMTP_PORT` | No | Usually `587` |
| `SMTP_SECURE` | No | `true` for implicit TLS |
| `SMTP_USER` / `SMTP_PASSWORD` | No | Mailbox credentials |
| `SMTP_FROM` | No | From address |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | No | Enables the contact-page map embed |

Never prefix `DATABASE_URL`, `AUTH_SECRET`, or SMTP secrets with `NEXT_PUBLIC_`.

## Database

Local SQLite file: `prisma/dev.db` (gitignored).

```bash
npx prisma migrate dev
npm run db:seed
```

Production:

```bash
npx prisma migrate deploy
npm run db:seed
```

Run the seed once to create roles and the administrator. Re-running it does not overwrite edited pages, products, or the admin password. It does refresh the role-permission matrix so new permissions stay attached to the right roles.

### PostgreSQL / Neon

1. Create a Neon database and copy its connection string.
2. In `prisma/schema.prisma`, set `provider = "postgresql"`.
3. Set `DATABASE_URL` to the Neon URL. Prefer the pooled connection for the app and a direct URL if Prisma asks for migrations.
4. Delete the SQLite migrations folder and run `npx prisma migrate dev --name init` against the empty Postgres database, or generate the migration in a staging database.
5. Seed once.

Do not point production at the SQLite file.

## What is implemented

**Public site.** Home, about, twelve business verticals, ten services, product catalogue with search and categories, product pages, farmers, buyers, sustainability, contact, insights, FAQs, draft legal pages, HTML sitemap, XML sitemap, robots.txt, and a 404 page.

**Accounts.** Farmer, buyer, and vendor registration; email verification; sign-in; forgot and reset password; partner dashboards for produce notes and procurement requests. Public registration cannot assign a staff role.

**Admin.** Dashboard counts, content, verticals, services, FAQs, legal text, insights, media uploads, categories, products, enquiries and replies, partner review, procurement notes, order enquiries, farms, inventory batches, compliance records, users and roles, notifications, reports, audit log, integration status, and settings.

**API.** `GET/POST /api/v1/...` for health, catalogue, categories, verticals, services, insights, enquiries, and a few authenticated admin reads. Mutating requests check the browser origin. Admin reads require a signed-in staff session.

## Roles

Super Admin, Admin, Operations Manager, Procurement Manager, Farm Manager, Inventory Manager, Sales Manager, Website Content Manager, Farmer, Buyer, and Vendor.

Staff permissions are seeded from `src/lib/constants.ts`. Only a Super Admin can assign the Super Admin role.

## Email

If `SMTP_HOST` is empty, the enquiry is still stored. The sender sees a confirmation on the page. A notification row explains that email was skipped. In development, registration and password reset can show a one-time link on the screen so the flow can be tested. That link is not shown when `NODE_ENV=production`.

## Security notes

- Passwords are hashed with bcrypt.
- The session cookie is httpOnly, SameSite=Lax, and Secure in production.
- Admin pages and `/account` require a valid session. Layouts check the role again in the database.
- Uploads are limited by size and checked by file signature, not only by the browser's MIME type.
- Public image paths must start with `/images/` or `/uploads/`.
- Rate limits on sign-in, registration, and enquiries are in-memory. Use a shared store before running more than one server instance.
- Destructive admin actions ask for confirmation in the browser.

## Deployment

1. Provision PostgreSQL and set the environment variables on the host.
2. Set `NEXT_PUBLIC_SITE_URL` to `https://www.agroparks.in`.
3. Set a new `AUTH_SECRET` and a non-default admin password.
4. `npm ci`
5. `npx prisma migrate deploy`
6. `npm run db:seed` once
7. `npm run build`
8. `npm run start`, or the host's Next.js build pipeline.

Put `public/uploads` and `storage/private` on persistent disk. They are not in git.

Review the draft legal pages in Admin → Legal and mark them published only after counsel has approved the text.

## Scope that is intentionally not live

Payment collection, commission settlement, carrier tracking, SMS, WhatsApp, accounting export, IoT, weather, and ERP are listed under Admin → Integrations as not configured. The contact map stays a link until an embed URL is set. Catalogue pages do not read warehouse quantities and do not show prices.
#   p a r k s h u b  
 