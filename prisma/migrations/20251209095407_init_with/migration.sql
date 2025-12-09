-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNISEX');

-- CreateEnum
CREATE TYPE "TattooSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE', 'FULL_COVERAGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "profileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(20) NOT NULL,
    "caption" VARCHAR(280) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "igMediaId" TEXT,
    "igPermalink" TEXT,
    "gender" "Gender" NOT NULL,
    "size" "TattooSize" NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "styles" TEXT[],
    "themes" TEXT[],
    "specializations" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Design_gender_idx" ON "Design"("gender");

-- CreateIndex
CREATE INDEX "Design_size_idx" ON "Design"("size");

-- CreateIndex
CREATE INDEX "Design_bodyPart_idx" ON "Design"("bodyPart");

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
