import { buildMonthlyOverview, listMonthTransactions, saveMonthlyBudget } from "@money/shared";
import { repository } from "./repository";

export async function loadDashboardOverview(userId: string) {
  return buildMonthlyOverview(repository, { userId });
}

export async function loadDashboardTransactions(userId: string, limit = 50) {
  return listMonthTransactions(repository, { userId, limit });
}

export async function setDashboardBudget(userId: string, amount: number) {
  return saveMonthlyBudget(repository, { userId, amount });
}
