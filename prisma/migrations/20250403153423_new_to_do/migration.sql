/*
  Warnings:

  - You are about to drop the column `isDisplayed` on the `toDo` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('Low', 'Medium', 'High');

-- AlterTable
ALTER TABLE "toDo" DROP COLUMN "isDisplayed",
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'Medium';
