# Elfangary Frontstore - AI Coder Context

This file contains all the essential context, architectural decisions, constraints, and concepts for the Elfangary Headless Shopify project. Any AI assisting with this codebase must read and adhere to these guidelines.

## 1. Project Architecture
- **Type:** Headless E-commerce.
- **Frontend:** Next.js (App Router), React, TypeScript.
- **Backend / CMS:** Shopify (via Storefront API).
- **Hosting:** Vercel (for Next.js frontend) and Shopify (for Checkout and Admin).

## 2. Tech Stack & Libraries
- **Styling:** Tailwind CSS (Custom themes configured in `tailwind.config.ts`).
- **State Management:** Zustand (used for Cart management).
- **Internationalization (i18n):** `next-intl` (Supports `ar` for Arabic and `en` for English).
- **API Communication:** GraphQL (Custom fetch calls to Shopify Storefront API).

## 3. Key Concepts & Workflows
- **Routing:** The app uses localized routing. All pages are inside `app/[locale]/`.
- **Cart Management:** 
  - Cart state is managed on the client side using Zustand (`lib/cartStore.ts`).
  - Interactions with Shopify API (create cart, add lines, update lines) are securely handled via Next.js **Server Actions** located in `app/actions/cart.ts`.
- **Checkout Process:** We do NOT handle payments on the Next.js side. The Storefront API returns a `checkoutUrl`. When a user clicks "Checkout", they are redirected to this URL to complete the purchase on Shopify's secure checkout domain.
- **Collections vs Bundles:**
  - **Collections:** Used to display categories (e.g., "عسلنا"). Treated as navigation/grouping in UI.
  - **Bundles:** Actual products in Shopify (Product Type: Bundle) that contain multiple items sold together. Handled just like regular products in the frontend.

## 4. Constraints & Rules
- **No Static Export:** This project heavily relies on Next.js Server Actions and Middleware (for `next-intl`). Do NOT configure `output: "export"` in `next.config.mjs`. It must run on a Node.js server (Vercel).
- **No GitHub Actions for Deploy:** Deployment is handled automatically by Vercel upon pushing to the `main` branch. DO NOT create GitHub Action deploy workflows (`deploy.yml`) as they will fail and conflict.
- **Environment Variables:** The project requires Shopify API credentials (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_API_VERSION`) to build successfully. Ensure these are mocked or provided during local development and build phases.
- **Styling Guidelines:** Rely on Tailwind utility classes. Prioritize modern, clean UI with micro-animations. Avoid adding external UI libraries (like Material UI or Ant Design) unless absolutely necessary, to keep the bundle size small.
- **Language Support:** Arabic is the primary focus. Ensure RTL (Right-to-Left) layout support is strictly maintained across all new components.

## 5. Folder Structure
- `/app/[locale]/` - All page routes (Home, Products, Collections, Cart, etc.).
- `/app/actions/` - Server Actions (Backend logic securely interacting with Shopify).
- `/components/` - Client and Server React components.
- `/lib/` - Utilities, Zustand stores, and Shopify GraphQL client.
- `/messages/` - Translation files for `next-intl` (`ar.json`, `en.json`).
