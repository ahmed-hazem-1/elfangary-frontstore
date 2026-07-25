import { NextRequest, NextResponse } from "next/server";
import {
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  applyDiscountCodes,
} from "@/lib/queries/cart";
import { CART_COOKIE, COOKIE_OPTS, getCartIdFromRequest } from "@/lib/utils/cartCookie";

// POST /api/cart  body: { action: "add"|"update"|"remove"|"discount", ... }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cartId = getCartIdFromRequest(req);
    let cart = null;

    switch (body.action) {
      case "add": {
        if (!cartId) {
          cart = await createCart(body.lines || [{ merchandiseId: body.merchandiseId, quantity: body.quantity || 1 }]);
        } else {
          cart = await addCartLines(cartId, body.lines || [{ merchandiseId: body.merchandiseId, quantity: body.quantity || 1 }]);
        }
        break;
      }
      case "update":
        cart = await updateCartLines(cartId!, body.lines);
        break;
      case "remove":
        cart = await removeCartLines(cartId!, body.lineIds);
        break;
      case "discount":
        cart = await applyDiscountCodes(cartId!, body.discountCodes || []);
        break;
      default:
        return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
    }

    if (!cart) {
      return NextResponse.json({ ok: false, error: "cart operation failed" }, { status: 500 });
    }

    const res = NextResponse.json({ ok: true, cart });
    if (!cartId && cart.id) res.cookies.set(CART_COOKIE, cart.id, COOKIE_OPTS);
    return res;
  } catch (err) {
    console.error("[api/cart]", err);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
