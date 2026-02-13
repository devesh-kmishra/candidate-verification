export function verifierMsgTemplate(
  companyName: string,
  candidateName: string,
  verificationLink: string,
) {
  return `
  Hello,
  ${companyName} is conducting an employment verification for ${candidateName}.

  Please complete the verification using the secure link below:
  ${verificationLink}

  Thank you.
  `;
}
