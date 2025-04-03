/*
  Warnings:

  - You are about to drop the column `createdAt` on the `toDo` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `toDo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "toDo" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "dueDate" TIMESTAMP(3);
