// src/test-db.ts
import { prisma } from './prisma';

async function main() {
  const users = await prisma.user.findMany(); // ✅ works with named export
  console.log('✅ Users:', users);
}

main().catch(console.error);
