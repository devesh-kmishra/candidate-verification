export function candidateVerificationMsgTemplate(verificationLink: string) {
  return `
  <p>Hello,</p>
  <p>Your employment verification is required to proceed with your hiring.</p>
  <br />
  <p>Please complete the verification using the secure link below:
  ${verificationLink}</p>
  <br />
  <p>This link is time-bound.</p>
  <p>If you have any questions, please contact HR.</p>
  `;
}
