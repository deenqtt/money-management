import { monthKey } from "./date";
import type { MonthlySummary, TransactionRecord } from "./types";

export function summarizeMonthlyBudget(input: {
  budget: number;
  transactions: TransactionRecord[];
  month?: Date;
}): MonthlySummary {
  const month = input.month ?? new Date();
  const spent = input.transactions.reduce((total, transaction) => total + transaction.amount, 0);
  const remaining = input.budget - spent;
  const progress = input.budget <= 0 ? (spent > 0 ? 1 : 0) : spent / input.budget;

  let status: MonthlySummary["status"] = "safe";
  if (input.budget <= 0 && spent > 0) {
    status = "over";
  } else if (input.budget > 0 && spent >= input.budget) {
    status = "over";
  } else if (input.budget > 0 && progress >= 0.8) {
    status = "warning";
  }

  return {
    monthKey: monthKey(month),
    budget: input.budget,
    spent,
    remaining,
    status,
    progress,
    transactionCount: input.transactions.length
  };
}
