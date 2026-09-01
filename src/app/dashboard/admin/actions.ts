"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { revalidatePath } from "next/cache";

export async function approveAdvisor(advisorId: string) {
  const session = await requireRole(["ADMIN"]);

  const user = await prisma.user.findUnique({
    where: { id: advisorId },
    include: { advisorProfile: true },
  });

  if (!user || !user.advisorProfile) throw new Error("Advisor not found");

  await prisma.advisorProfile.update({
    where: { userId: advisorId },
    data: {
      verificationStatus: "VERIFIED",
      verifiedAt: new Date(),
      verifiedByAdminId: session.user.id,
      rejectionReason: null, // clear any previous rejections
    },
  });

  console.log(`\n\n[RESEND EMAIL STUB] Advisor Approved`);
  console.log(`To: ${user.email}`);
  console.log(`Subject: Your Legal Aid Clinic Application is Approved!`);
  console.log(`Body: You have been verified and can now answer questions.\n\n`);

  revalidatePath("/dashboard/admin/volunteers");
  revalidatePath(`/dashboard/admin/volunteers/${advisorId}`);
}

export async function rejectAdvisor(advisorId: string, reason: string) {
  await requireRole(["ADMIN"]);

  if (!reason || reason.trim().length === 0) {
    throw new Error("Rejection reason is required");
  }

  const user = await prisma.user.findUnique({
    where: { id: advisorId },
  });

  if (!user) throw new Error("Advisor not found");

  await prisma.advisorProfile.update({
    where: { userId: advisorId },
    data: {
      verificationStatus: "REJECTED",
      rejectionReason: reason,
      verifiedAt: null,
      verifiedByAdminId: null,
    },
  });

  console.log(`\n\n[RESEND EMAIL STUB] Advisor Rejected`);
  console.log(`To: ${user.email}`);
  console.log(`Subject: Update on your Legal Aid Clinic Application`);
  console.log(`Body: We could not approve your application at this time. Reason: ${reason}\n\n`);

  revalidatePath("/dashboard/admin/volunteers");
  revalidatePath(`/dashboard/admin/volunteers/${advisorId}`);
}

export async function toggleAdvisorActive(advisorId: string, isActive: boolean) {
  await requireRole(["ADMIN"]);

  await prisma.user.update({
    where: { id: advisorId },
    data: { isActive },
  });

  revalidatePath("/dashboard/admin/volunteers");
  revalidatePath(`/dashboard/admin/volunteers/${advisorId}`);
}
