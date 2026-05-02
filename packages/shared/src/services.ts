import { endOfMonth, startOfMonth } from "date-fns";
import type {
  MoneyRepository,
  MonthlySummary,
  ParsedTelegramExpense,
  TransactionInput
} from "./types";
import { parseTelegramExpenseInput } from "./parser";
import { summarizeMonthlyBudget } from "./budget";
import { monthKey, monthRange } from "./date";

export async function recordTelegramExpense(
  repository: MoneyRepository,
  input: {
    telegramUserId: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    text: string;
    occurredAt?: Date;
  }
): Promise<{ userId: string; transaction: TransactionInput; parsed: ParsedTelegramExpense }> {
  const user = await repository.ensureUserByTelegramAccount({
    telegramUserId: input.telegramUserId,
    username: input.username ?? null,
    firstName: input.firstName ?? null,
    lastName: input.lastName ?? null
  });
  const parsed = parseTelegramExpenseInput(input.text);
  const transaction: TransactionInput = {
    amount: parsed.amount,
    category: parsed.category,
    note: parsed.note,
    occurredAt: input.occurredAt ?? new Date(),
    source: "telegram"
  };
  await repository.createTransaction({
    userId: user.id,
    amount: transaction.amount,
    category: transaction.category,
    note: transaction.note,
    occurredAt: transaction.occurredAt,
    source: transaction.source
  });

  return { userId: user.id, transaction, parsed };
}

export async function buildMonthlyOverview(repository: MoneyRepository, input: {
  userId: string;
  month?: Date;
}): Promise<MonthlySummary & { budget: number; transactions: Awaited<ReturnType<MoneyRepository["listTransactions"]>> }> {
  const month = input.month ?? new Date();
  const { from, to } = monthRange(month);
  const [budgetRecord, transactions] = await Promise.all([
    repository.getMonthlyBudget({ userId: input.userId, monthKey: monthKey(month) }),
    repository.listTransactions({ userId: input.userId, from, to, limit: 20 })
  ]);

  const summary = summarizeMonthlyBudget({
    budget: budgetRecord?.amount ?? 0,
    transactions,
    month
  });

  return {
    ...summary,
    budget: summary.budget,
    transactions
  };
}

export async function saveMonthlyBudget(
  repository: MoneyRepository,
  input: { userId: string; month?: Date; amount: number }
): Promise<void> {
  const month = input.month ?? new Date();
  await repository.upsertMonthlyBudget({
    userId: input.userId,
    monthKey: monthKey(month),
    amount: input.amount
  });
}

export async function listMonthTransactions(
  repository: MoneyRepository,
  input: { userId: string; month?: Date; limit?: number }
) {
  const month = input.month ?? new Date();
  const { from, to } = monthRange(month);
  return repository.listTransactions({
    userId: input.userId,
    from: startOfMonth(from),
    to: endOfMonth(to),
    limit: input.limit ?? 50
  });
}
