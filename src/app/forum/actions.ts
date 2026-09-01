"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { requireRole, requireVerifiedAdvisor } from "@/lib/roles";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ReportTargetType, ForumQuestionStatus } from "@prisma/client";

const askSchema = z.object({
  title: z.string().min(10).max(100),
  body: z.string().min(20).max(2000),
  category: z.string().min(1),
  isAnonymous: z.boolean().default(false),
});

export async function askQuestion(formData: z.infer<typeof askSchema>) {
  const session = await requireRole(["SEEKING_HELP"]);
  const parsed = askSchema.safeParse(formData);

  if (!parsed.success) {
    throw new Error("Invalid question data");
  }

  const question = await prisma.forumQuestion.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      category: parsed.data.category,
      isAnonymous: parsed.data.isAnonymous,
      authorId: session.user.id,
    },
  });

  revalidatePath("/forum");
  return { id: question.id };
}

export async function submitAnswer(questionId: string, body: string) {
  const session = await requireVerifiedAdvisor();

  if (!body || body.trim().length < 20) {
    throw new Error("Answer is too short");
  }

  // Use a transaction to ensure we update the question status atomically
  await prisma.$transaction(async (tx) => {
    await tx.forumAnswer.create({
      data: {
        body,
        questionId,
        advisorId: session.user.id,
      },
    });

    const question = await tx.forumQuestion.findUnique({
      where: { id: questionId },
      select: { status: true },
    });

    if (question?.status === "UNANSWERED") {
      await tx.forumQuestion.update({
        where: { id: questionId },
        data: { status: "IN_PROGRESS" },
      });
    }
  });

  revalidatePath(`/forum/${questionId}`);
  revalidatePath("/forum");
}

export async function toggleUpvote(answerId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Must be logged in to upvote");

  const userId = session.user.id;

  await prisma.$transaction(async (tx) => {
    const existing = await tx.upvote.findUnique({
      where: {
        userId_answerId: { userId, answerId },
      },
    });

    if (existing) {
      await tx.upvote.delete({
        where: { userId_answerId: { userId, answerId } },
      });
      await tx.forumAnswer.update({
        where: { id: answerId },
        data: { upvoteCount: { decrement: 1 } },
      });
    } else {
      await tx.upvote.create({
        data: { userId, answerId },
      });
      await tx.forumAnswer.update({
        where: { id: answerId },
        data: { upvoteCount: { increment: 1 } },
      });
    }
  });

  // Depending on where this is called, we might need to rely on client-side state
  // to avoid hard refreshing the entire page, but for safety we can revalidate.
}

export async function markResolved(questionId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const question = await prisma.forumQuestion.findUnique({
    where: { id: questionId },
    select: { authorId: true },
  });

  if (!question || question.authorId !== session.user.id) {
    throw new Error("Only the author can mark this as resolved");
  }

  await prisma.forumQuestion.update({
    where: { id: questionId },
    data: { status: "RESOLVED" },
  });

  revalidatePath(`/forum/${questionId}`);
  revalidatePath("/forum");
}

export async function reportItem(
  targetType: "QUESTION" | "ANSWER" | "ADVISOR_PROFILE",
  targetId: string,
  reason: string,
  note?: string,
  isEmergency?: boolean
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Must be logged in to report");

  await prisma.report.create({
    data: {
      reporterId: session.user.id,
      targetType,
      targetId,
      reason: note ? `${reason}: ${note}` : reason,
      isEmergency: isEmergency || false,
      status: "OPEN"
    }
  });
}
