import { prisma } from "@money/database";
import { createPrismaMoneyRepository } from "@money/database";

export const repository = createPrismaMoneyRepository(prisma);
