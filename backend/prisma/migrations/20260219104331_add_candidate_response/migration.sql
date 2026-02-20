-- CreateTable
CREATE TABLE "CandidateVerificationResponse" (
    "id" TEXT NOT NULL,
    "verificationItemId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "questionLabel" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "answer" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidateVerificationResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CandidateVerificationResponse_verificationItemId_idx" ON "CandidateVerificationResponse"("verificationItemId");

-- AddForeignKey
ALTER TABLE "CandidateVerificationResponse" ADD CONSTRAINT "CandidateVerificationResponse_verificationItemId_fkey" FOREIGN KEY ("verificationItemId") REFERENCES "VerificationItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
