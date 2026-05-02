import "../../../scripts/load-env";
import { Telegraf } from "telegraf";
import { formatCurrency } from "@money/shared";
import { prisma, createPrismaMoneyRepository } from "@money/database";
import { buildMonthlyOverview, recordTelegramExpense } from "@money/shared";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

const bot = new Telegraf(token);
const repository = createPrismaMoneyRepository(prisma);

bot.start(async (ctx) => {
  await ctx.reply([
    "Money management bot is ready.",
    "Use /link to connect your Telegram account to the dashboard user.",
    "Send: /expense 15000 food lunch",
    "Use /summary for this month overview",
    "Use /recent for latest expenses"
  ].join("\n"));
});

bot.command("link", async (ctx) => {
  try {
    const user = await repository.ensureUserByTelegramAccount({
      telegramUserId: String(ctx.from?.id ?? ""),
      username: ctx.from?.username ?? null,
      firstName: ctx.from?.first_name ?? null,
      lastName: ctx.from?.last_name ?? null
    });

    const dashboardEmail = process.env.DASHBOARD_ADMIN_EMAIL?.trim();
    const linkedToDashboard = dashboardEmail ? user.email === dashboardEmail : !user.email.endsWith("@telegram.local");

    await ctx.reply(
      linkedToDashboard
        ? `Telegram account linked to ${user.email}.`
        : `Telegram account is using standalone profile ${user.email}. Set DASHBOARD_ADMIN_EMAIL to link it to the dashboard user.`
    );
  } catch (error) {
    await ctx.reply(error instanceof Error ? error.message : "Failed to link Telegram account");
  }
});

bot.command("expense", async (ctx) => {
  const text = ctx.message.text.replace(/^\/expense(@\w+)?/i, "").trim();
  if (!text) {
    await ctx.reply("Format: /expense 15000 food lunch");
    return;
  }

  try {
    const result = await recordTelegramExpense(repository, {
      telegramUserId: String(ctx.from?.id ?? ""),
      username: ctx.from?.username ?? null,
      firstName: ctx.from?.first_name ?? null,
      lastName: ctx.from?.last_name ?? null,
      text
    });

    await ctx.reply(`Saved ${formatCurrency(result.transaction.amount)} as ${result.transaction.category}.`);
  } catch (error) {
    await ctx.reply(error instanceof Error ? error.message : "Failed to save expense");
  }
});

bot.command("summary", async (ctx) => {
  const user = await repository.ensureUserByTelegramAccount({
    telegramUserId: String(ctx.from?.id ?? ""),
    username: ctx.from?.username ?? null,
    firstName: ctx.from?.first_name ?? null,
    lastName: ctx.from?.last_name ?? null
  });

  const overview = await buildMonthlyOverview(repository, { userId: user.id });
  await ctx.reply([
    `Month: ${overview.monthKey}`,
    `Budget: ${formatCurrency(overview.budget)}`,
    `Spent: ${formatCurrency(overview.spent)}`,
    `Remaining: ${formatCurrency(overview.remaining)}`,
    `Status: ${overview.status}`
  ].join("\n"));
});

bot.command("recent", async (ctx) => {
  const user = await repository.ensureUserByTelegramAccount({
    telegramUserId: String(ctx.from?.id ?? ""),
    username: ctx.from?.username ?? null,
    firstName: ctx.from?.first_name ?? null,
    lastName: ctx.from?.last_name ?? null
  });

  const overview = await buildMonthlyOverview(repository, { userId: user.id });
  if (overview.transactions.length === 0) {
    await ctx.reply("No recent transactions yet.");
    return;
  }

  await ctx.reply(
    overview.transactions
      .map((transaction) => `${formatCurrency(transaction.amount)} - ${transaction.category}${transaction.note ? ` - ${transaction.note}` : ""}`)
      .join("\n")
  );
});

bot.on("text", async (ctx) => {
  if (ctx.message.text.startsWith("/")) {
    return;
  }

  try {
    const result = await recordTelegramExpense(repository, {
      telegramUserId: String(ctx.from?.id ?? ""),
      username: ctx.from?.username ?? null,
      firstName: ctx.from?.first_name ?? null,
      lastName: ctx.from?.last_name ?? null,
      text: ctx.message.text
    });
    await ctx.reply(`Saved ${formatCurrency(result.transaction.amount)}.`);
  } catch (error) {
    await ctx.reply(error instanceof Error ? error.message : "Could not parse the expense");
  }
});

async function main() {
  await prisma.$connect();
  await bot.launch();
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

void main();
