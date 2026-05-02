import { NextResponse } from "next/server";
import { authenticateDashboardUser, createSessionCookieValue } from "../../../../lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const user = await authenticateDashboardUser(body.email, body.password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { value, expiresAt } = createSessionCookieValue(user);
  const response = NextResponse.json({ ok: true });
  response.cookies.set("money-session", value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });
  return response;
}
