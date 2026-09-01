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
    include: { advisorProfile: true }
  });
  if (!advisor) throw new Error("Advisor not found");
  if (advisor.advisorProfile?.verificationStatus !== "VERIFIED") {
    throw new Error("Cannot match with an unverified advisor");
  }

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

  const { sendTransactionalEmail } = await import("@/lib/email/sender");

  await sendTransactionalEmail(request.requesterId, "CONSULTATION_CONFIRMATION", {
    email: request.contactEmail,
    name: request.preferredName,
    meetingLink,
    category: request.category,
    time: confirmedSlot.toLocaleString(),
  });

  await sendTransactionalEmail(advisorId, "CONSULTATION_CONFIRMATION", {
    email: advisor.email,
    name: advisor.fullName, // this is the advisor's name
    meetingLink,
    category: request.category,
    time: confirmedSlot.toLocaleString(),
  });

  revalidatePath("/dashboard/admin/consultations");
  revalidatePath(`/dashboard/admin/consultations/${requestId}`);
}
