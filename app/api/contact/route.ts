import { NextRequest, NextResponse } from "next/server";

// POST /api/contact — stub. Swap to Resend / email provider later.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    console.log("[contact] message", { name: body.name, email: body.email, message: body.message });
    // TODO: integrate Resend (or preferred email provider) to forward the message.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
