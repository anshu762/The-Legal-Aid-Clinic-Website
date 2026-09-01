"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { revalidatePath } from "next/cache";

export async function createArticle(data: {
  title: string;
  slug: string;
  category: string;
  language: string;
  bodyMarkdown: string;
  pdfUrl?: string;
  isActive?: boolean;
}) {
  await requireRole(["ADMIN"]);

  await prisma.knowYourRightsArticle.create({
    data: {
      ...data,
      publishedAt: data.isActive ? new Date() : null,
    },
  });

  revalidatePath("/dashboard/admin/articles");
  revalidatePath("/know-your-rights");
}

export async function updateArticle(
  id: string,
  data: {
    title: string;
    slug: string;
    category: string;
    language: string;
    bodyMarkdown: string;
    pdfUrl?: string;
    isActive?: boolean;
  }
) {
  await requireRole(["ADMIN"]);

  await prisma.knowYourRightsArticle.update({
    where: { id },
    data: {
      ...data,
      publishedAt: data.isActive ? new Date() : null,
    },
  });

  revalidatePath("/dashboard/admin/articles");
  revalidatePath("/know-your-rights");
  revalidatePath(`/know-your-rights/${data.slug}`);
}

export async function toggleArticleActive(id: string, isActive: boolean) {
  await requireRole(["ADMIN"]);

  const article = await prisma.knowYourRightsArticle.update({
    where: { id },
    data: { 
      isActive,
      publishedAt: isActive ? new Date() : null
    },
  });

  revalidatePath("/dashboard/admin/articles");
  revalidatePath("/know-your-rights");
  revalidatePath(`/know-your-rights/${article.slug}`);
}
