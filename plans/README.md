# Elfangary Frontstore - Feature Implementation Plans

This directory contains technical specifications and architectural plans for new e-commerce capabilities in the Elfangary store.

---

## 📑 Available Feature Plans

### 1. [Plan 01: Customer Wishlist (قائمة المفضلة)](./01-customer-wishlist-plan.md)
- **Goal**: Enable customers to favorite products, view saved items on a dedicated page (`/[locale]/wishlist`), track counts in the header, and move items into the cart with one click.
- **Key Files**:
  - `store/wishlistStore.ts`
  - `components/WishlistButton.tsx`
  - `components/WishlistPageClient.tsx`
  - `app/[locale]/wishlist/page.tsx`
  - `components/HeaderClient.tsx`

### 2. [Plan 02: Abandoned Cart WhatsApp & Notification Recovery System](./02-abandoned-cart-whatsapp-notification-plan.md)
- **Goal**: Track abandoned shopping carts and send automated WhatsApp recovery messages or forward event payloads to external APIs/webhooks configured via `.env`.
- **Key Files**:
  - `lib/abandonedCart/notifier.ts`
  - `lib/abandonedCart/messageBuilder.ts`
  - `components/AbandonedCartTracker.tsx`
  - `app/api/abandoned-cart/track/route.ts`
  - `app/api/abandoned-cart/notify/route.ts`
  - `.env.example`
