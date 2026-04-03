import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";  // ✅ correct import

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!, // your Postgres URL
});

export const prisma = new PrismaClient({ adapter });