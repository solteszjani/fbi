import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";
const prisma = new PrismaClient();

async function main() {
  const username = "stuartg";
  const salt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync("jani12", salt, 64).toString("hex");
  await prisma.user.upsert({ where: { username }, update: {}, create: { username, displayName: "FBI System Administrator", passwordSalt: salt, passwordHash, role: "SUPERADMIN", permissions: ["*"] } });
  const agent = await prisma.agent.upsert({
    where: { badgeNumber: "FBI-001" },
    update: {},
    create: { badgeNumber: "FBI-001", name: "Alex Morgan", rank: "Special Agent in Charge", division: "Directorate", email: "sac@example.local" }
  });
  await prisma.case.upsert({
    where: { caseNumber: "FBI-2026-001" },
    update: {},
    create: {
      caseNumber: "FBI-2026-001", title: "Operation Black Harbor",
      summary: "Sample RP investigation. Replace or remove this seeded record.",
      status: "ACTIVE", priority: "HIGH", division: "Criminal Investigation Division",
      leadAgentId: agent.id
    }
  });
  console.log("Seed completed");
}
main().finally(() => prisma.$disconnect());
