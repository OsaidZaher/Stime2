-- CreateTable
CREATE TABLE "Goals" (
    "id" TEXT NOT NULL,
    "target" INTEGER NOT NULL,
    "completion" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Goals_userId_idx" ON "Goals"("userId");

-- CreateIndex
CREATE INDEX "Goals_subjectId_idx" ON "Goals"("subjectId");

-- AddForeignKey
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
