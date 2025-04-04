/*
  Warnings:

  - Made the column `dueDate` on table `toDo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "toDo" ALTER COLUMN "dueDate" SET NOT NULL;
