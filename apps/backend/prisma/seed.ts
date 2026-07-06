import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@charity.com";
  const adminPassword = "password";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const charity = await prisma.charity.upsert({
    where: { slug: "default-charity" },
    update: {},
    create: {
      name: "Default Charity",
      slug: "default-charity",
      locale: "ar",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email_charityId: { email: adminEmail, charityId: charity.id } },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: "admin",
      charityId: charity.id,
    },
  });

  console.log(`Seeded: charity "${charity.name}" (${charity.id})`);
  console.log(`Seeded: admin user "${admin.email}" (${admin.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
