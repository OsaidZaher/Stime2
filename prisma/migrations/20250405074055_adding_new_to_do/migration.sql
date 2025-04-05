-- CreateTable
CREATE TABLE "ToDo" (
    "id" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "dueDate" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ToDo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ToDo_userId_idx" ON "ToDo"("userId");

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
