/*
  Warnings:

  - You are about to drop the column `employmentVerificationId` on the `CallingLog` table. All the data in the column will be lost.
  - Added the required column `verificationContactId` to the `CallingLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CallingLog" DROP CONSTRAINT "CallingLog_employmentVerificationId_fkey";

-- AlterTable
ALTER TABLE "CallingLog" DROP COLUMN "employmentVerificationId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "verificationContactId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "CallingLog_verificationContactId_idx" ON "CallingLog"("verificationContactId");

-- AddForeignKey
ALTER TABLE "CallingLog" ADD CONSTRAINT "CallingLog_verificationContactId_fkey" FOREIGN KEY ("verificationContactId") REFERENCES "VerificationContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
