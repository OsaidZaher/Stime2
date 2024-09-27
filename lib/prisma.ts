// /lib/prisma.ts

// imports the prisma client api
import { PrismaClient } from "@prisma/client";

// creation of prisma to be global in the workplace and set it as prisma type with prisma client value to avoid type errors
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export prisma if exists if not create new  prisma client
export const prisma = globalForPrisma.prisma || new PrismaClient();

// if in dev mode globalprisma = prisma
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
