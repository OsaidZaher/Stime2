/*
  Warnings:

  - You are about to drop the `toDo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "toDo" DROP CONSTRAINT "toDo_userId_fkey";

-- DropTable
DROP TABLE "toDo";

-- DropEnum
DROP TYPE "Priority";
