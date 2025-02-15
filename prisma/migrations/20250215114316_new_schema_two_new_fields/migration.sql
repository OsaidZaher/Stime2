-- AlterTable
ALTER TABLE "SubjectGoal" ADD COLUMN     "completion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;
