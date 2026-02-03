export function verificationEmailTemplate(params: {
  contactName: string;
  candidateName: string;
  verificationType: string;
  verificationLink: string;
}) {
  return {
    subject: `Employment Verification Request - ${params.candidateName}`,
    html: `
      <p>Hi ${params.contactName},</p>

      <p>
        ${params.candidateName} has listed you as a contact for <strong>${params.verificationType}</strong>.
      </p>

      <p>Please complete the verification using the secure link below:</p>

      <p>
        <a href="${params.verificationLink}">
          Complete Verification
        </a>
      </p>

      <p>This link will expire in 7 days.</p>

      <p>Thank you,<br/>HR Team</p>
    `,
  };
}
