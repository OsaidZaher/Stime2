/*
  Warnings:

  - Added the required column `grade` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "grade" TEXT NOT NULL;
