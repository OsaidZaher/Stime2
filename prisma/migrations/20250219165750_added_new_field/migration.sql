/*
  Warnings:

  - Added the required column `task` to the `toDo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "toDo" ADD COLUMN     "task" TEXT NOT NULL;
