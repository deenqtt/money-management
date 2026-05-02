import { NextResponse } from "next/server";
import { readDashboardSession } from "../../../lib/auth";
import { setDashboardBudget } from "../../../lib/dashboard";
import { repository } from "../../../lib/repository";

export async function POST(request: Request) {
  const session = await readDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await repository.findUserByEmail(session.email);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { amount?: number };
  if (typeof body.amount !== "number" || Number.isNaN(body.amount) || body.amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  await setDashboardBudget(user.id, body.amount);
  return NextResponse.json({ ok: true });
}
