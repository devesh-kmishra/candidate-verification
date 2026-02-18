import "dotenv/config";
import nodemailer from "nodemailer";
import { Resend } from "resend";

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (process.env.NODE_ENV === "production") {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      return console.error({ error });
    }

    console.log(data);
  } else {
    try {
      const mailer = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailInfo = await mailer.sendMail({
        from: process.env.SMTP_FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      console.log("Email Preview URL:", nodemailer.getTestMessageUrl(mailInfo));
    } catch (err) {
      console.error(err);
    }
  }
}
