/*
  Warnings:

  - A unique constraint covering the columns `[verificationItemId,questionKey]` on the table `CandidateVerificationResponse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CandidateVerificationResponse_verificationItemId_questionKe_key" ON "CandidateVerificationResponse"("verificationItemId", "questionKey");
