-- CreateTable
CREATE TABLE "toDo" (
    "id" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "toDo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "toDo_userId_idx" ON "toDo"("userId");

-- AddForeignKey
ALTER TABLE "toDo" ADD CONSTRAINT "toDo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
