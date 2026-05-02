import { z } from "zod";
import { transactionCategories, type ParsedTelegramExpense } from "./types";

const amountPattern = /^[+-]?(?:rp\s*)?[\d.,]+/i;

const telegramExpenseTextSchema = z.string().trim().min(1);

function normalizeAmount(raw: string): number {
  const cleaned = raw.replace(/^rp\s*/i, "").replace(/[^\d,.-]/g, "");
  const normalized = cleaned.replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Invalid amount");
  }
  return value;
}

function parseCategory(token: string | undefined): ParsedTelegramExpense["category"] {
  if (!token) {
    return "other";
  }

  const candidate = token.toLowerCase().trim();
  if ((transactionCategories as readonly string[]).includes(candidate)) {
    return candidate as ParsedTelegramExpense["category"];
  }

  return "other";
}

export function parseTelegramExpenseInput(input: string): ParsedTelegramExpense {
  const normalized = telegramExpenseTextSchema.parse(input).replace(/[|;]+/g, " ");
  const amountMatch = normalized.match(amountPattern);
  if (!amountMatch) {
    throw new Error("Expense text must start with an amount");
  }

  const amountText = amountMatch[0];
  const remainder = normalized.slice(amountText.length).trim();
  const parts = remainder.length > 0 ? remainder.split(/\s+/) : [];
  const category = parseCategory(parts[0]);
  const noteParts = category === "other" ? parts : parts.slice(1);
  const note = noteParts.length > 0 ? noteParts.join(" ").trim() : null;

  return {
    amount: normalizeAmount(amountText),
    category,
    note
  };
}
