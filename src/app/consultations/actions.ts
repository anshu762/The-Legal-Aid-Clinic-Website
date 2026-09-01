"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { revalidatePath } from "next/cache";

export async function createConsultationRequest(data: {
  preferredName: string;
  contactEmail: string;
  contactPhone?: string;
  cityState: string;
  category: string;
  description: string;
  attachmentUrl?: string;
  languages: string[];
  requestedLengthMinutes: number;
  preferredSlots: any;
  urgencyFlag: boolean;
}) {
  const session = await requireRole(["SEEKING_HELP"]);

  const req = await prisma.consultationRequest.create({
    data: {
      requesterId: session.user.id,
      preferredName: data.preferredName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      cityState: data.cityState,
      category: data.category,
      description: data.description,
      attachmentUrl: data.attachmentUrl,
      languages: data.languages,
      requestedLengthMinutes: data.requestedLengthMinutes,
      preferredSlots: data.preferredSlots,
      urgencyFlag: data.urgencyFlag,
      status: "PENDING"
    }
  });

  revalidatePath("/dashboard/client");
  return { success: true, id: req.id };
}
