"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function confirmConsultationMatch(
  requestId: string,
  advisorId: string,
  confirmedSlot: Date
) {
  const session = await requireRole(["ADMIN"]);

  const request = await prisma.consultationRequest.findUnique({
    where: { id: requestId },
  });
  if (!request) throw new Error("Request not found");

  const advisor = await prisma.user.findUnique({
    where: { id: advisorId },
  });
  if (!advisor) throw new Error("Advisor not found");

  // Generate Jitsi Link
  const meetingLink = `https://meet.jit.si/tlc-${crypto.randomUUID()}`;

  await prisma.consultationRequest.update({
    where: { id: requestId },
    data: {
      status: "CONFIRMED",
      matchedAdvisorId: advisorId,
      confirmedSlot,
      meetingLink,
    },
  });

  // SIMULATE EMAILS
  console.log(`\n\n[RESEND EMAIL STUB] Seeker Confirmation`);
  console.log(`To: ${request.contactEmail}`);
  console.log(`Subject: Your Consultation is Confirmed`);
  console.log(`Body: Your request has been matched with ${advisor.fullName}.
Meeting Link: ${meetingLink}
Time: ${confirmedSlot.toLocaleString()}
Please join the link at the exact time.\n`);

  console.log(`\n[RESEND EMAIL STUB] Advisor Confirmation - STRICT PRIVACY ENFORCED`);
  console.log(`To: ${advisor.email}`);
  console.log(`Subject: New Consultation Match`);
  console.log(`Body: You have been assigned a new [${request.category}] consultation.
Meeting Link: ${meetingLink}
Time: ${confirmedSlot.toLocaleString()}
Seeker contact details are hidden to protect privacy until they explicitly share them.\n\n`);

  revalidatePath("/dashboard/admin/consultations");
  revalidatePath(`/dashboard/admin/consultations/${requestId}`);
}
