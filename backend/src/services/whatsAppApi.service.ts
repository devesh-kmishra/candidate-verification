import axios from "axios";

const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const token = process.env.WHATSAPP_ACCESS_TOKEN;

const baseUrl = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;

async function sendTemplateMessage(payload: any) {
  return axios.post(baseUrl, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function sendCandidateVerificationWhatsApp({
  to,
  candidateName,
  link,
  expiryDays,
}: {
  to: string;
  candidateName: string;
  link: string;
  expiryDays: number;
}) {
  return sendTemplateMessage({
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: "candidate_verification_required",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: candidateName },
            { type: "text", text: link },
            { type: "text", text: expiryDays.toString() },
          ],
        },
      ],
    },
  });
}

export async function sendVerifierWhatsApp({
  to,
  organizationName,
  candidateName,
  link,
}: {
  to: string;
  organizationName: string;
  candidateName: string;
  link: string;
}) {
  return sendTemplateMessage({
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: "employment_verification_request",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: organizationName },
            { type: "text", text: candidateName },
            { type: "text", text: link },
          ],
        },
      ],
    },
  });
}
