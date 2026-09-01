"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { revalidatePath } from "next/cache";

export async function saveFeedback(consultationId: string, rating: number, text: string) {
  const session = await requireRole(["SEEKING_HELP"]);

  const req = await prisma.consultationRequest.findUnique({
    where: { id: consultationId }
  });

  if (!req || req.requesterId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.consultationRequest.update({
    where: { id: consultationId },
    data: {
      requesterFeedbackRating: rating,
      requesterFeedbackText: text,
    }
  });

  revalidatePath("/dashboard/client");
}
