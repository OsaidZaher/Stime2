-- CreateTable
CREATE TABLE "UserGrade" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grades" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserGrade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserGrade" ADD CONSTRAINT "UserGrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
