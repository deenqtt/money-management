import { NextResponse } from "next/server";
import { readDashboardSession } from "../../../lib/auth";
import { loadDashboardTransactions } from "../../../lib/dashboard";
import { repository } from "../../../lib/repository";

export async function GET() {
  const session = await readDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await repository.findUserByEmail(session.email);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await loadDashboardTransactions(user.id);
  return NextResponse.json({ transactions });
}
