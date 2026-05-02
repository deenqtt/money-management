import { Prisma, PrismaClient } from "@prisma/client";
import type { MoneyRepository, TransactionCategory, ExpenseSource } from "@money/shared";

function toNumber(value: Prisma.Decimal | number): number {
  return typeof value === "number" ? value : Number(value.toString());
}

function toTransactionCategory(value: string): TransactionCategory {
  return value as TransactionCategory;
}

export function createPrismaMoneyRepository(client: PrismaClient): MoneyRepository {
  return {
    async ensureUserByTelegramAccount(input) {
      const existing = await client.telegramAccount.findUnique({
        where: { telegramUserId: input.telegramUserId },
        include: { user: true }
      });

      const dashboardEmail = process.env.DASHBOARD_ADMIN_EMAIL?.trim();
      const dashboardUser = dashboardEmail
        ? await client.user.findUnique({
            where: { email: dashboardEmail }
          })
        : null;

      if (existing?.user) {
        if (dashboardUser && existing.user.id !== dashboardUser.id) {
          await client.$transaction(async (tx) => {
            await tx.telegramAccount.update({
              where: { telegramUserId: input.telegramUserId },
              data: {
                userId: dashboardUser.id,
                username: input.username,
                firstName: input.firstName,
                lastName: input.lastName
              }
            });

            await tx.transaction.updateMany({
              where: { userId: existing.user.id },
              data: { userId: dashboardUser.id }
            });

            await tx.budget.updateMany({
              where: { userId: existing.user.id },
              data: { userId: dashboardUser.id }
            });
          });

          return {
            id: dashboardUser.id,
            email: dashboardUser.email,
            name: dashboardUser.name
          };
        }

        return {
          id: existing.user.id,
          email: existing.user.email,
          name: existing.user.name
        };
      }

      if (dashboardUser) {
        await client.telegramAccount.create({
          data: {
            telegramUserId: input.telegramUserId,
            username: input.username,
            firstName: input.firstName,
            lastName: input.lastName,
            userId: dashboardUser.id
          }
        });

        return {
          id: dashboardUser.id,
          email: dashboardUser.email,
          name: dashboardUser.name
        };
      }

      const telegramUserId = input.telegramUserId;
      const email = `${telegramUserId}@telegram.local`;
      const created = await client.user.create({
        data: {
          email,
          name: input.firstName ?? input.username ?? `Telegram ${telegramUserId}`,
          passwordHash: "telegram-placeholder",
          telegramAccount: {
            create: {
              telegramUserId,
              username: input.username,
              firstName: input.firstName,
              lastName: input.lastName
            }
          }
        }
      });

      return {
        id: created.id,
        email: created.email,
        name: created.name
      };
    },

    async findUserByTelegramId(telegramUserId) {
      const account = await client.telegramAccount.findUnique({
        where: { telegramUserId },
        include: { user: true }
      });
      if (!account?.user) {
        return null;
      }
      return {
        id: account.user.id,
        email: account.user.email,
        name: account.user.name
      };
    },

    async findUserByEmail(email) {
      return client.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          passwordHash: true
        }
      });
    },

    async createTransaction(input) {
      const record = await client.transaction.create({
        data: {
          userId: input.userId,
          amount: new Prisma.Decimal(input.amount),
          category: input.category,
          note: input.note ?? null,
          source: input.source,
          occurredAt: input.occurredAt
        }
      });

      return {
        id: record.id,
        amount: toNumber(record.amount),
        category: toTransactionCategory(record.category),
        note: record.note,
        occurredAt: record.occurredAt,
        source: record.source as ExpenseSource
      };
    },

    async listTransactions(input) {
      const records = await client.transaction.findMany({
        where: {
          userId: input.userId,
          occurredAt: {
            gte: input.from,
            lte: input.to
          }
        },
        orderBy: {
          occurredAt: "desc"
        },
        take: input.limit ?? 50
      });

      return records.map((record) => ({
        id: record.id,
        amount: toNumber(record.amount),
        category: toTransactionCategory(record.category),
        note: record.note,
        occurredAt: record.occurredAt,
        source: record.source as ExpenseSource
      }));
    },

    async getMonthlyBudget(input) {
      const record = await client.budget.findUnique({
        where: {
          userId_monthKey: {
            userId: input.userId,
            monthKey: input.monthKey
          }
        }
      });

      return record
        ? {
            monthKey: record.monthKey,
            amount: toNumber(record.amount)
          }
        : null;
    },

    async upsertMonthlyBudget(input) {
      const record = await client.budget.upsert({
        where: {
          userId_monthKey: {
            userId: input.userId,
            monthKey: input.monthKey
          }
        },
        create: {
          userId: input.userId,
          monthKey: input.monthKey,
          amount: new Prisma.Decimal(input.amount)
        },
        update: {
          amount: new Prisma.Decimal(input.amount)
        }
      });

      return {
        monthKey: record.monthKey,
        amount: toNumber(record.amount)
      };
    }
  };
}
