import crypto from "node:crypto";

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")): string {
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, expected] = storedHash.split(":");
  if (!salt || !expected) {
    return false;
  }
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  if (derived.length !== expected.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(expected, "hex"));
}

export function createSessionToken(payload: { userId: string; email: string }, secret: string, expiresAt: Date): string {
  const body = Buffer.from(JSON.stringify({ ...payload, expiresAt: expiresAt.toISOString() }), "utf8").toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifySessionToken(token: string, secret: string): { userId: string; email: string } | null {
  try {
    const [body, signature] = token.split(".");
    if (!body || !signature) {
      return null;
    }

    const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
    if (signature.length !== expected.length) {
      return null;
    }
    if (!crypto.timingSafeEqual(Buffer.from(signature, "utf8"), Buffer.from(expected, "utf8"))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      userId: string;
      email: string;
      expiresAt: string;
    };

    if (Date.parse(payload.expiresAt) < Date.now()) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email
    };
  } catch {
    return null;
  }
}
