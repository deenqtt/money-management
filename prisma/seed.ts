import "../scripts/load-env";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../packages/shared/src/auth";

const prisma = new PrismaClient();

function nonEmpty(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

async function main() {
  const email = nonEmpty(process.env.DASHBOARD_ADMIN_EMAIL) ?? "admin@example.com";
  const password = nonEmpty(process.env.DASHBOARD_ADMIN_PASSWORD) ?? "change-me-now";
  const passwordHash = nonEmpty(process.env.DASHBOARD_ADMIN_PASSWORD_HASH) ?? hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash
    },
    create: {
      email,
      name: "Admin",
      passwordHash
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
