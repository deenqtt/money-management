import { describe, expect, it } from "vitest";
import { parseTelegramExpenseInput } from "../src/parser";

describe("parseTelegramExpenseInput", () => {
  it("parses amount, category, and note", () => {
    expect(parseTelegramExpenseInput("15000 food lunch at warung")).toEqual({
      amount: 15000,
      category: "food",
      note: "lunch at warung"
    });
  });

  it("defaults category to other when not provided", () => {
    expect(parseTelegramExpenseInput("Rp 12.500 kopi sore")).toEqual({
      amount: 12500,
      category: "other",
      note: "kopi sore"
    });
  });
});
