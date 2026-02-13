/*
  Warnings:

  - A unique constraint covering the columns `[candidateToken]` on the table `VerificationCase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `candidateToken` to the `VerificationCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidateTokenExp` to the `VerificationCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "VerificationContactStatus" ADD VALUE 'BLOCKED';

-- AlterTable
ALTER TABLE "VerificationCase" ADD COLUMN     "candidateToken" TEXT NOT NULL,
ADD COLUMN     "candidateTokenExp" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCase_candidateToken_key" ON "VerificationCase"("candidateToken");
