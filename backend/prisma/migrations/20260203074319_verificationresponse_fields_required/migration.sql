/*
  Warnings:

  - Made the column `answer` on table `VerificationResponse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `questionKey` on table `VerificationResponse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `questionLabel` on table `VerificationResponse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `questionType` on table `VerificationResponse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `verificationContactId` on table `VerificationResponse` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "VerificationResponse" ALTER COLUMN "answer" SET NOT NULL,
ALTER COLUMN "questionKey" SET NOT NULL,
ALTER COLUMN "questionLabel" SET NOT NULL,
ALTER COLUMN "questionType" SET NOT NULL,
ALTER COLUMN "verificationContactId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "VerificationResponse" ADD CONSTRAINT "VerificationResponse_verificationContactId_fkey" FOREIGN KEY ("verificationContactId") REFERENCES "VerificationContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
