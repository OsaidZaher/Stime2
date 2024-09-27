/*
  Warnings:

  - You are about to drop the `Subjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Subjects";

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");
