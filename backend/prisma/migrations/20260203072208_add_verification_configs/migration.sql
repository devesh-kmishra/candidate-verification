/*
  Warnings:

  - You are about to drop the column `responseId` on the `VerificationDocument` table. All the data in the column will be lost.
  - You are about to drop the column `answers` on the `VerificationResponse` table. All the data in the column will be lost.
  - You are about to drop the column `employmentVerificationId` on the `VerificationResponse` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `VerificationResponse` table. All the data in the column will be lost.
  - Added the required column `verificationContactId` to the `VerificationDocument` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('PREVIOUS_EMPLOYMENT', 'REFERENCE', 'BACKGROUND', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ExecutionMode" AS ENUM ('PARALLEL', 'SEQUENTIAL');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'YES_NO', 'MCQ', 'DATE', 'DATE_RANGE', 'FILE');

-- CreateEnum
CREATE TYPE "VerificationContactStatus" AS ENUM ('PENDING', 'CONTACTED', 'RESPONDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "VerificationContactSource" AS ENUM ('HR', 'REFERENCE', 'BACKGROUND', 'VENDOR');

-- CreateEnum
CREATE TYPE "DiscrepancyStatus" AS ENUM ('OPEN', 'ACCEPTED', 'REJECTED', 'OVERRIDDEN');

-- DropForeignKey
ALTER TABLE "VerificationDocument" DROP CONSTRAINT "VerificationDocument_responseId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationResponse" DROP CONSTRAINT "VerificationResponse_employmentVerificationId_fkey";

-- DropIndex
DROP INDEX "VerificationResponse_employmentVerificationId_key";

-- AlterTable
ALTER TABLE "VerificationDocument" DROP COLUMN "responseId",
ADD COLUMN     "verificationContactId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VerificationResponse" DROP COLUMN "answers",
DROP COLUMN "employmentVerificationId",
DROP COLUMN "submittedAt",
ADD COLUMN     "answer" JSONB,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "questionKey" TEXT,
ADD COLUMN     "questionLabel" TEXT,
ADD COLUMN     "questionType" "QuestionType",
ADD COLUMN     "verificationContactId" TEXT;

-- CreateTable
CREATE TABLE "EmpVerificationResponse" (
    "id" TEXT NOT NULL,
    "employmentVerificationId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmpVerificationResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationConfig" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationTypeConfig" (
    "id" TEXT NOT NULL,
    "verificationConfigId" TEXT NOT NULL,
    "type" "VerificationType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "mandatory" BOOLEAN NOT NULL DEFAULT true,
    "minContacts" INTEGER NOT NULL,
    "maxContacts" INTEGER,
    "executionMode" "ExecutionMode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationTypeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationQuestionTemplate" (
    "id" TEXT NOT NULL,
    "verificationTypeConfigId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "options" JSONB,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationQuestionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCase" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "verificationConfigId" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationItem" (
    "id" TEXT NOT NULL,
    "verificationCaseId" TEXT NOT NULL,
    "verificationTypeConfigId" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL,
    "mandatory" BOOLEAN NOT NULL,
    "executionMode" "ExecutionMode" NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationContact" (
    "id" TEXT NOT NULL,
    "verificationItemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "source" "VerificationContactSource" NOT NULL,
    "token" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "status" "VerificationContactStatus" NOT NULL,
    "contactedAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationDiscrepancy" (
    "id" TEXT NOT NULL,
    "verificationItemId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "claimedValue" JSONB NOT NULL,
    "verifiedValue" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "DiscrepancyStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedBy" TEXT,
    "resolutionNote" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationDiscrepancy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmpVerificationResponse_employmentVerificationId_key" ON "EmpVerificationResponse"("employmentVerificationId");

-- CreateIndex
CREATE INDEX "VerificationCase_candidateId_idx" ON "VerificationCase"("candidateId");

-- CreateIndex
CREATE INDEX "VerificationCase_status_idx" ON "VerificationCase"("status");

-- CreateIndex
CREATE INDEX "VerificationItem_verificationCaseId_idx" ON "VerificationItem"("verificationCaseId");

-- CreateIndex
CREATE INDEX "VerificationItem_status_idx" ON "VerificationItem"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationContact_token_key" ON "VerificationContact"("token");

-- CreateIndex
CREATE INDEX "VerificationContact_verificationItemId_idx" ON "VerificationContact"("verificationItemId");

-- CreateIndex
CREATE INDEX "VerificationContact_token_idx" ON "VerificationContact"("token");

-- CreateIndex
CREATE INDEX "VerificationContact_status_idx" ON "VerificationContact"("status");

-- CreateIndex
CREATE INDEX "VerificationDiscrepancy_verificationItemId_idx" ON "VerificationDiscrepancy"("verificationItemId");

-- CreateIndex
CREATE INDEX "VerificationDiscrepancy_status_idx" ON "VerificationDiscrepancy"("status");

-- CreateIndex
CREATE INDEX "VerificationResponse_verificationContactId_idx" ON "VerificationResponse"("verificationContactId");

-- AddForeignKey
ALTER TABLE "EmpVerificationResponse" ADD CONSTRAINT "EmpVerificationResponse_employmentVerificationId_fkey" FOREIGN KEY ("employmentVerificationId") REFERENCES "EmploymentVerification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_verificationContactId_fkey" FOREIGN KEY ("verificationContactId") REFERENCES "VerificationContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationTypeConfig" ADD CONSTRAINT "VerificationTypeConfig_verificationConfigId_fkey" FOREIGN KEY ("verificationConfigId") REFERENCES "VerificationConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationQuestionTemplate" ADD CONSTRAINT "VerificationQuestionTemplate_verificationTypeConfigId_fkey" FOREIGN KEY ("verificationTypeConfigId") REFERENCES "VerificationTypeConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCase" ADD CONSTRAINT "VerificationCase_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCase" ADD CONSTRAINT "VerificationCase_verificationConfigId_fkey" FOREIGN KEY ("verificationConfigId") REFERENCES "VerificationConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationItem" ADD CONSTRAINT "VerificationItem_verificationCaseId_fkey" FOREIGN KEY ("verificationCaseId") REFERENCES "VerificationCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationItem" ADD CONSTRAINT "VerificationItem_verificationTypeConfigId_fkey" FOREIGN KEY ("verificationTypeConfigId") REFERENCES "VerificationTypeConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationContact" ADD CONSTRAINT "VerificationContact_verificationItemId_fkey" FOREIGN KEY ("verificationItemId") REFERENCES "VerificationItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationDiscrepancy" ADD CONSTRAINT "VerificationDiscrepancy_verificationItemId_fkey" FOREIGN KEY ("verificationItemId") REFERENCES "VerificationItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
