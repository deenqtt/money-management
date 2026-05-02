export const transactionCategories = [
  "food",
  "transport",
  "shopping",
  "utilities",
  "health",
  "entertainment",
  "education",
  "other"
] as const;

export type TransactionCategory = (typeof transactionCategories)[number];
export type ExpenseSource = "telegram" | "web";
export type BudgetStatus = "safe" | "warning" | "over";

export interface TransactionInput {
  amount: number;
  category: TransactionCategory;
  note: string | null;
  occurredAt: Date;
  source: ExpenseSource;
}

export interface ParsedTelegramExpense {
  amount: number;
  category: TransactionCategory;
  note: string | null;
}

export interface TransactionRecord {
  id: string;
  amount: number;
  category: TransactionCategory;
  note: string | null;
  occurredAt: Date;
  source: ExpenseSource;
}

export interface MonthlyBudget {
  monthKey: string;
  amount: number;
}

export interface MonthlySummary {
  monthKey: string;
  budget: number;
  spent: number;
  remaining: number;
  status: BudgetStatus;
  progress: number;
  transactionCount: number;
}

export interface MoneyRepository {
  ensureUserByTelegramAccount(input: {
    telegramUserId: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  }): Promise<{ id: string; email: string; name: string | null }>;
  findUserByTelegramId(telegramUserId: string): Promise<{ id: string; email: string; name: string | null } | null>;
  findUserByEmail(email: string): Promise<{ id: string; email: string; name: string | null; passwordHash: string } | null>;
  createTransaction(input: {
    userId: string;
    amount: number;
    category: TransactionCategory;
    note?: string | null;
    occurredAt: Date;
    source: ExpenseSource;
  }): Promise<TransactionRecord>;
  listTransactions(input: {
    userId: string;
    from: Date;
    to: Date;
    limit?: number;
  }): Promise<TransactionRecord[]>;
  getMonthlyBudget(input: { userId: string; monthKey: string }): Promise<MonthlyBudget | null>;
  upsertMonthlyBudget(input: { userId: string; monthKey: string; amount: number }): Promise<MonthlyBudget>;
}
