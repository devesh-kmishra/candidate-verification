import axios from "axios";

const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const token = process.env.WHATSAPP_ACCESS_TOKEN;

const baseUrl = `https://graph.facebook.com/v24.0/${phoneNumberId}/messages`;

async function sendTemplateMessage(payload: any) {
  try {
    if (!phoneNumberId || !token) {
      throw new Error("WhatsApp environment variables not configured properly");
    }

    return await axios.post(baseUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("WHATSAPP STATUS:", err.respose?.status);
    console.error("WHATSAPP ERROR:", err.respose?.data);
    throw err;
  }
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
  const token = link.split("/").pop();

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
        {
          type: "button",
          sub_type: "url",
          index: 0,
          parameters: [{ type: "text", text: token }],
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
  const token = link.split("/").pop();

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
        {
          type: "button",
          sub_type: "url",
          index: 0,
          parameters: [{ type: "text", text: token }],
        },
      ],
    },
  });
}
