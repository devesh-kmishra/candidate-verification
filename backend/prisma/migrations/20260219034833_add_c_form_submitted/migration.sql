/*
  Warnings:

  - A unique constraint covering the columns `[verificationItemId,email]` on the table `VerificationContact` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "VerificationCase" ADD COLUMN     "candidateFormSubmitted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationContact_verificationItemId_email_key" ON "VerificationContact"("verificationItemId", "email");
