-- CreateTable
CREATE TABLE "SubjectGoal" (
    "id" TEXT NOT NULL,
    "target" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "SubjectGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubjectGoal_subjectId_key" ON "SubjectGoal"("subjectId");

-- CreateIndex
CREATE INDEX "SubjectGoal_userId_idx" ON "SubjectGoal"("userId");

-- CreateIndex
CREATE INDEX "SubjectGoal_subjectId_idx" ON "SubjectGoal"("subjectId");

-- AddForeignKey
ALTER TABLE "SubjectGoal" ADD CONSTRAINT "SubjectGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGoal" ADD CONSTRAINT "SubjectGoal_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
