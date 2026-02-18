import "dotenv/config";
import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  const mailInfo = await mailer.sendMail({
    from: process.env.SMTP_FROM,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  console.log("Email Preview URL:", nodemailer.getTestMessageUrl(mailInfo));
}
