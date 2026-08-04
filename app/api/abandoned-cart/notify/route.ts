import { NextResponse } from "next/server";
import { sendAbandonedCartNotification } from "@/lib/abandonedCart/notifier";
import type { AbandonedCartPayload } from "@/lib/abandonedCart/types";

export async function POST(req: Request) {
  try {
    const payload: AbandonedCartPayload = await req.json();

    if (!payload?.cartId || !payload?.checkoutUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required cart parameters (cartId, checkoutUrl)" },
        { status: 400 }
      );
    }

    if (!payload.items || payload.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty, nothing to notify" },
        { status: 400 }
      );
    }

    const result = await sendAbandonedCartNotification(payload);

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (err: any) {
    console.error("Error in /api/abandoned-cart/notify:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
