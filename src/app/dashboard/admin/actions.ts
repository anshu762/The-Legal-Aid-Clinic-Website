"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { revalidatePath } from "next/cache";

import { sendTransactionalEmail } from "@/lib/email/sender";

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

  await sendTransactionalEmail(user.id, "VOLUNTEER_APPROVAL", {
    name: user.fullName,
    email: user.email,
  });

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

  await sendTransactionalEmail(user.id, "VOLUNTEER_REJECTION", {
    name: user.fullName,
    email: user.email,
    reason,
  });

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
