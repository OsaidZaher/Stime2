/*
  Warnings:

  - You are about to drop the column `subject` on the `UserGrade` table. All the data in the column will be lost.
  - Added the required column `grade` to the `UserGrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `UserGrade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGrade" DROP COLUMN "subject",
ADD COLUMN     "grade" TEXT NOT NULL,
ADD COLUMN     "subjectId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserGrade" ADD CONSTRAINT "UserGrade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
