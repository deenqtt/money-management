import { describe, expect, it } from "vitest";
import { summarizeMonthlyBudget } from "../src/budget";

describe("summarizeMonthlyBudget", () => {
  it("marks safe under 80 percent", () => {
    const summary = summarizeMonthlyBudget({
      budget: 100000,
      transactions: [{ id: "1", amount: 30000, category: "other", note: null, occurredAt: new Date(), source: "telegram" }]
    });
    expect(summary.status).toBe("safe");
    expect(summary.remaining).toBe(70000);
  });

  it("marks warning near limit", () => {
    const summary = summarizeMonthlyBudget({
      budget: 100000,
      transactions: [{ id: "1", amount: 85000, category: "other", note: null, occurredAt: new Date(), source: "telegram" }]
    });
    expect(summary.status).toBe("warning");
  });

  it("marks over when budget is exceeded", () => {
    const summary = summarizeMonthlyBudget({
      budget: 100000,
      transactions: [{ id: "1", amount: 120000, category: "other", note: null, occurredAt: new Date(), source: "telegram" }]
    });
    expect(summary.status).toBe("over");
  });
});
