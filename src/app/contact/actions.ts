"use server";

import { prisma } from "@/lib/prisma";

export async function submitGeneralReport(data: {
  name?: string;
  email: string;
  message: string;
  isConcern: boolean;
  isUrgent: boolean;
}) {
  // We can attach reporter if they are logged in, but the contact form is public.
  // For public contact, we'll just store the email in the reason block if it's an anonymous user.
  
  const content = `From: ${data.name || "Anonymous"} <${data.email}>
Type: ${data.isConcern ? "Report a Concern" : "General Inquiry"}
Message: ${data.message}`;

  await prisma.report.create({
    data: {
      targetType: "GENERAL",
      targetId: "CONTACT_FORM",
      reason: content,
      isEmergency: data.isUrgent,
      status: "OPEN"
    }
  });
}
