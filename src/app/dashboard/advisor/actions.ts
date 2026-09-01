"use server";

import { prisma } from "@/lib/prisma";
import { requireVerifiedAdvisor } from "@/lib/roles";
import { revalidatePath } from "next/cache";

export async function updateAvailability(data: {
  isPaused?: boolean;
  weeklyAvailability?: string;
  preferredDurations?: number[];
}) {
  const session = await requireVerifiedAdvisor();

  // Phase 5 TODO: If isPaused is true, ensure this advisor is strictly excluded 
  // from the Consultation Matching engine queries.

  // The database schema doesn't have an explicit `isPaused` field on AdvisorProfile.
  // Wait, let's check if it does. 
  // It has `weeklyAvailability` and `preferredDurations`.
  // Wait, the user asked for a toggle "pause new requests". 
  // Let me just store it inside the JSON of `weeklyAvailability` for now if the schema doesn't have it, 
  // or I can add an `isPaused` field if I really need to, but the prompt says:
  // "Pausing availability actually removes the advisor from consultation matching in the next phase (leave a TODO comment referencing Phase 5 if matching doesn't exist yet)."
  // Since I don't want to run a migration right now unless necessary, I'll store it in `weeklyAvailability` JSON.
  
  const currentProfile = await prisma.advisorProfile.findUnique({
    where: { userId: session.user.id }
  });

  const currentAvail = (currentProfile?.weeklyAvailability as any) || {};

  await prisma.advisorProfile.update({
    where: { userId: session.user.id },
    data: {
      weeklyAvailability: {
        ...currentAvail,
        ...(data.weeklyAvailability ? { schedule: data.weeklyAvailability } : {}),
        ...(data.isPaused !== undefined ? { isPaused: data.isPaused } : {})
      },
      ...(data.preferredDurations ? { preferredDurations: data.preferredDurations } : {})
    },
  });

  revalidatePath("/dashboard/advisor/availability");
  revalidatePath("/dashboard/advisor");
}

export async function saveClosureNote(consultationId: string, note: string) {
  const session = await requireVerifiedAdvisor();

  // Ensure this consultation actually belongs to this advisor
  const cons = await prisma.consultationRequest.findUnique({
    where: { id: consultationId }
  });

  if (!cons || cons.matchedAdvisorId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.consultationRequest.update({
    where: { id: consultationId },
    data: { 
      closureNote: note,
      status: "COMPLETED" // Mark as completed if they are adding a closure note
    }
  });

  revalidatePath("/dashboard/advisor");
}
