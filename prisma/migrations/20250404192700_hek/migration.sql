/*
  Warnings:

  - The values [Low,Medium,High] on the enum `Priority` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `toDo` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Priority_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
ALTER TABLE "toDo" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "ToDo" ALTER COLUMN "priority" TYPE "Priority_new" USING ("priority"::text::"Priority_new");
ALTER TYPE "Priority" RENAME TO "Priority_old";
ALTER TYPE "Priority_new" RENAME TO "Priority";
DROP TYPE "Priority_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "toDo" DROP CONSTRAINT "toDo_userId_fkey";

-- DropTable
DROP TABLE "toDo";

-- CreateTable
CREATE TABLE "ToDo" (
    "id" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ToDo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ToDo_userId_idx" ON "ToDo"("userId");

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
