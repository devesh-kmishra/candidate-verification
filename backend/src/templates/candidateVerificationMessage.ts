export function candidateVerificationMsgTemplate(verificationLink: string) {
  return `
  Hello,
  Your employment verification is required to proceed with your hiring.

  Please complete the verification using the secure link below:
  ${verificationLink}

  This link is time-bound.
  If you have any questions, please contact HR.
  `;
}
