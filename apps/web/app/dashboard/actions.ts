"use server";

import { redirect } from "next/navigation";
import { clearDashboardSessionCookie, requireDashboardUser } from "../../lib/auth";
import { setDashboardBudget } from "../../lib/dashboard";

export async function logoutAction() {
  await clearDashboardSessionCookie();
  redirect("/login");
}

export async function updateBudgetAction(formData: FormData) {
  const user = await requireDashboardUser();
  const amount = Number(formData.get("amount"));
  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }

  await setDashboardBudget(user.id, amount);
  redirect("/dashboard/overview");
}
