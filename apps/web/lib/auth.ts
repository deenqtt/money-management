import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, verifyPassword, verifySessionToken } from "@money/shared";
import { repository } from "./repository";

const COOKIE_NAME = "money-session";
const SESSION_DAYS = 30;

function sessionSecret() {
  const secret = process.env.DASHBOARD_COOKIE_SECRET;
  if (!secret) {
    throw new Error("DASHBOARD_COOKIE_SECRET is required");
  }
  return secret;
}

export async function authenticateDashboardUser(email: string, password: string) {
  const user = await repository.findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }
  return user;
}

export function createSessionCookieValue(user: { id: string; email: string }) {
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  return {
    value: createSessionToken({ userId: user.id, email: user.email }, sessionSecret(), expiresAt),
    expiresAt
  };
}

export async function readDashboardSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token, sessionSecret());
}

export async function requireDashboardUser() {
  const session = await readDashboardSession();
  if (!session) {
    redirect("/login");
  }

  const user = await repository.findUserByEmail(session.email);
  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function setDashboardSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });
}

export async function clearDashboardSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
