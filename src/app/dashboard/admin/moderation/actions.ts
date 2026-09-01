"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { revalidatePath } from "next/cache";

export async function processReport(
  reportId: string,
  actionType: "DISMISS" | "HIDE" | "REMOVE",
  resolutionNote: string
) {
  await requireRole(["ADMIN"]);

  const report = await prisma.report.findUnique({
    where: { id: reportId }
  });

  if (!report) throw new Error("Report not found");

  // Step 1: Execute soft-delete if applicable
  if (actionType === "HIDE" || actionType === "REMOVE") {
    const isRemoved = actionType === "REMOVE";
    const isHidden = actionType === "HIDE" || actionType === "REMOVE";

    switch (report.targetType) {
      case "QUESTION":
        await prisma.forumQuestion.update({
          where: { id: report.targetId },
          data: { isHidden, isRemoved }
        });
        break;
      case "ANSWER":
        await prisma.forumAnswer.update({
          where: { id: report.targetId },
          data: { isHidden, isRemoved }
        });
        break;
      case "ADVISOR_PROFILE":
        // For an advisor, we deactivate their account
        await prisma.user.update({
          where: { id: report.targetId },
          data: { isActive: !isRemoved } 
        });
        break;
      case "GENERAL":
        // General reports have no specific target to delete
        break;
    }
  }

  // Step 2: Update the Report row itself
  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: actionType === "DISMISS" ? "DISMISSED" : "RESOLVED",
      resolutionNote
    }
  });

  revalidatePath("/dashboard/admin/moderation");
  if (report.targetType === "QUESTION") revalidatePath(`/forum/${report.targetId}`);
  revalidatePath("/forum");
}

export async function proactiveAdminAction(
  targetType: "QUESTION" | "ANSWER" | "ADVISOR_PROFILE",
  targetId: string,
  actionType: "HIDE" | "REMOVE",
  reason: string
) {
  const session = await requireRole(["ADMIN"]);

  // Creates a system report and immediately resolves it
  const report = await prisma.report.create({
    data: {
      reporterId: session.user.id,
      targetType,
      targetId,
      reason: `Proactive Admin Action: ${reason}`,
      status: "OPEN"
    }
  });

  await processReport(report.id, actionType, reason);
}
