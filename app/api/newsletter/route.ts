import { NextRequest, NextResponse } from "next/server";

// POST /api/newsletter — stub. Swap to Storefront customerCreate or Resend later.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    console.log("[newsletter] subscription", body.email);
    // TODO: integrate Storefront customerCreate({ email, acceptsMarketing: true }) or Resend list.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/newsletter]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
