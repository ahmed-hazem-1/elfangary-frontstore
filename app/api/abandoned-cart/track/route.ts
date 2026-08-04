import { NextResponse } from "next/server";
import type { AbandonedCartPayload } from "@/lib/abandonedCart/types";

export async function POST(req: Request) {
  try {
    let payload: AbandonedCartPayload;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      // Handles navigator.sendBeacon string/text payload
      const text = await req.text();
      payload = JSON.parse(text);
    }

    if (!payload?.cartId || !payload?.checkoutUrl) {
      return NextResponse.json({ success: false, error: "Missing cartId or checkoutUrl" }, { status: 400 });
    }

    // In a full DB architecture, this can record to Redis / Supabase / Prisma.
    // For now, log the tracking heartbeat.
    if (process.env.NODE_ENV === "development") {
      console.log(`[AbandonedCart Track] Cart ${payload.cartId} tracked for customer ${payload.customer?.phone || "anonymous"}`);
    }

    return NextResponse.json({
      success: true,
      trackedAt: Date.now(),
      cartId: payload.cartId,
    });
  } catch (err: any) {
    console.error("Error in /api/abandoned-cart/track:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
