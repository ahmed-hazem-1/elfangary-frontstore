# الفنجري — Elfangary Headless Shopify Storefront

A premium, bilingual (Arabic RTL default + English LTR) headless storefront for a natural-honey brand, built with **Next.js 14 (App Router, TypeScript)** on the **Shopify Storefront API (GraphQL, 2024-10)**. Zero hardcoded catalog — all product/collection/page/menu data is fetched live from Shopify and degrades gracefully when credentials are absent.

> Visual direction follows `Docs/design.md` (premium, warm, rounded, smooth). Palette tokens are applied **literally by label name** as decided during planning (e.g. "Cream" = `#F08000`).

## Tech stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · next-intl · Zustand · framer-motion · lucide-react · sonner · next/font (Alexandria + Plus Jakarta Sans)

## Quick start

```bash
cp .env.example .env.local   # fill in Shopify values when ready
npm install
npm run dev                  # http://localhost:3000  →  /ar (default)
```

The app renders fully with **no env vars set** — every page shows skeletons / empty / "not configured" states instead of crashing. Add credentials to enable live Shopify content.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run typecheck` | `tsc --noEmit` |

## Environment variables

See `.env.example`. All are optional at build time.

| Variable | Required for | Description |
| --- | --- | --- |
| `SHOPIFY_STORE_DOMAIN` | Catalog | `your-store.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Catalog | Storefront API access token |
| `SHOPIFY_API_VERSION` | Catalog | Defaults to `2024-10` |
| `SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID` | Customer login/OAuth | Customer Account API extension client id |
| `SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_SECRET` | Customer login/OAuth | Customer Account API extension client secret |
| `SHOPIFY_CUSTOMER_ACCOUNT_API_URL` | Customer login/OAuth | Customer Account API endpoint (optional) |
| `SHOPIFY_APP_URL` | OAuth redirect | Public app URL |
| `NEXT_PUBLIC_SITE_URL` | SEO / canonical | Public site URL |

## Shopify setup (do this once you have a store)

1. **Storefront API token**
   - Shopify Admin → Settings → Apps → **Develop apps** → Create a custom app → enable **Storefront API** with `read_products`, `read_product_listings`, `read_customers` (for `customerCreate`), `read_menus`, `read_content`. Copy the **Storefront API access token**.

2. **Navigation menus** (fetched dynamically — no hardcoded nav)
   - Admin → Online Store → Navigation.
   - Create a menu with handle **`main-menu`**. Recommended items (set URL to your locale paths, e.g. `/shop`, `/collections`):
     - Home · Shop · Our Honey · Benefits · Reviews · FAQ · Contact
   - Create a menu with handle **`footer`** for footer links.
   - If absent, the app falls back to translated default nav items.

3. **Pages**
   - Create pages with handles `about-us` and `shipping-policy` (used on Home brand story and Product accordion).

4. **Collections**
   - Create a `best-sellers` collection (tagged products or manual). Best sellers also surface from the `BEST_SELLING` sort key.

5. **Product metafields** (`custom` namespace) — show on the product page:
   - `nutrition`, `origin`, `season`, `certifications`.

6. **Shop metafields** (`custom` namespace) — drive the hero and contact/footer:
   - `hero_image` (image reference URL), `hero_title_ar`, `hero_title_en`, `hero_subtext`, `hero_cta_primary`, `hero_cta_secondary`, `featured_product_handle` (a product handle for the floating hero card).
   - Social: `social_facebook`, `social_instagram`, `social_twitter`, `social_whatsapp`.
   - Store: `store_phone`, `store_email`, `store_address`, `store_maps` (Google Maps embed URL).

7. **Metaobject definitions** (Admin → Settings → Custom Data → Metaobjects):
   - `benefits` — fields: `title`, `description`, `icon` (one of: `heart`, `shield`, `truck`, `award`, `sparkles`).
   - `testimonials` — fields: `name`/`author`, `quote`/`content`/`review`, `rating` (number), optional `avatar`/`image`.
   - `product_faqs` — fields: `question`/`title`, `answer`/`content`.
   - `trust_badges` — optional; otherwise default translated badges render.
   - Sections hide automatically when no entries exist.

8. **Customer accounts (New Customer Accounts + Customer Account API)**
   - Admin → Settings → Customer accounts → enable **New customer accounts**.
   - Create a Customer Account API app extension; set the **callback/redirect URL** to:
     `https://<your-domain>/<locale>/account/callback` (e.g. `https://example.com/en/account/callback`).
   - Copy the **Client ID** and **Client secret** into `.env.local`.
   - Registration still works via the Storefront `customerCreate` mutation (no Customer Account API needed).

## Routing & i18n

- `next-intl` with a `/[locale]` segment. Locales: `ar` (default, RTL), `en` (LTR).
- `/` redirects to `/ar`. Arabic is prefix-less (`as-needed`); English is `/en/...`.
- All UI strings live in `i18n/messages/{ar,en}.json`.

## Cart

- Cart id is persisted via a Zustand store + `cart_id` httpOnly cookie.
- Mutations run through server actions (`app/actions/cart.ts`) and the `/api/cart` proxy route.
- Checkout uses Shopify-hosted `cart.checkoutUrl` ("Buy It Now" creates a fresh cart and redirects).

## Customer auth

- Login redirects to the Shopify Customer Account API OAuth authorize URL (`lib/auth.ts`).
- `/[locale]/account/callback` exchanges the code for access/refresh tokens stored in httpOnly cookies, then redirects to the dashboard.
- Middleware protects `/[locale]/account/*` (except login/register/callback) when no token cookie is present.
- If the Customer Account API isn't configured, login and dashboard show a friendly "not configured" state.

## Notes / known limitations

- **Palette:** `Docs/design.md` color values are applied by label name literally (a deliberate decision). E.g. "Cream" = `#F08000` renders orange on cream-tagged surfaces; "Deep Honey Gold" = `#F0F0F0` is near-white. Revisit `tailwind.config.ts` tokens if visuals need adjusting.
- **Newsletter / Contact** are stub API routes returning `{ ok: true }` and logging the payload. Swap points are documented in `app/api/newsletter/route.ts` and `app/api/contact/route.ts` (Resend for contact, Storefront `customerCreate` for newsletter).
- **No Admin API key** is assumed, so no server-side content seeding is performed.

## License

Private project — Elfangary / الفنجري.
