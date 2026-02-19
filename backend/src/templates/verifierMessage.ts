export function verifierMsgTemplate(
  companyName: string,
  candidateName: string,
  verificationLink: string,
) {
  return `
  <p>Hello,</p>
  <p>${companyName} is conducting an employment verification for ${candidateName}.</p>
  <br />
  <p>Please complete the verification using the secure link below:
  ${verificationLink}</p>

  <p>Thank you.</p>
  <br />
  <p>Best regards,</p>
  <p>HR Team</p>
  <p>${companyName}</p>
  `;
}
