import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { EmailEvent, EmailTemplatePayload, getEmailTemplate } from "./templates";

export async function sendTransactionalEmail<T extends EmailEvent>(
  userId: string,
  event: T,
  payload: EmailTemplatePayload[T]
) {
  const { subject, html } = getEmailTemplate(event, payload);
  const toEmail = payload.email;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Legal Aid Clinic" <noreply@tlc.org>',
        to: toEmail,
        subject,
        html,
      });
      console.log(`[EMAIL SENT] ${event} sent to ${toEmail}`);
    } catch (error) {
      console.error(`Failed to send email for ${event}:`, error);
    }
  } else {
    console.log(`\n\n[NO SMTP CONFIGURED] Event: ${event} to ${toEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML: ${html}\n\n`);
  }

  // Always log the notification, regardless of channel
  await prisma.notificationLog.create({
    data: {
      userId,
      type: event,
      channel: "EMAIL",
      payload: payload as any,
    },
  });
}
