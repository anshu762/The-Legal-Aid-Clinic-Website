"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";

export async function getAnalyticsData(startDate: Date, endDate: Date) {
  await requireRole(["ADMIN"]);

  // 1. Question Volume by Category
  const questionsByCategory = await prisma.forumQuestion.groupBy({
    by: ['category'],
    _count: { id: true },
    where: { createdAt: { gte: startDate, lte: endDate } },
  });

  // 2. Average time-to-first-answer (overall and by category)
  // We use Prisma $queryRaw for this complex aggregation
  // Cast dates to timestamps to compute diff in hours
  const avgAnswerTimeByCategory = await prisma.$queryRaw<
    Array<{ category: string; avgHours: number | null }>
  >`
    SELECT 
      q.category,
      AVG(EXTRACT(EPOCH FROM (MIN_A."firstAnswerAt" - q."createdAt")) / 3600)::float as "avgHours"
    FROM "ForumQuestion" q
    JOIN (
      SELECT "questionId", MIN("createdAt") as "firstAnswerAt"
      FROM "ForumAnswer"
      GROUP BY "questionId"
    ) MIN_A ON MIN_A."questionId" = q.id
    WHERE q."createdAt" >= ${startDate} AND q."createdAt" <= ${endDate}
    GROUP BY q.category
  `;

  const avgAnswerTimeOverall = await prisma.$queryRaw<
    Array<{ avgHours: number | null }>
  >`
    SELECT 
      AVG(EXTRACT(EPOCH FROM (MIN_A."firstAnswerAt" - q."createdAt")) / 3600)::float as "avgHours"
    FROM "ForumQuestion" q
    JOIN (
      SELECT "questionId", MIN("createdAt") as "firstAnswerAt"
      FROM "ForumAnswer"
      GROUP BY "questionId"
    ) MIN_A ON MIN_A."questionId" = q.id
    WHERE q."createdAt" >= ${startDate} AND q."createdAt" <= ${endDate}
  `;

  // 3. Consultation volume by month/time
  // Truncate to day if range <= 31 days, else month
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isDaily = diffDays <= 31;
  const truncUnit = isDaily ? 'day' : 'month';

  const consultationVolume = await prisma.$queryRaw<
    Array<{ dateGroup: Date; count: number }>
  >`
    SELECT 
      date_trunc(${truncUnit}, "createdAt") as "dateGroup",
      COUNT(id)::int as count
    FROM "ConsultationRequest"
    WHERE "createdAt" >= ${startDate} AND "createdAt" <= ${endDate}
    GROUP BY "dateGroup"
    ORDER BY "dateGroup" ASC
  `;

  // 4. Geographic spread by city/state
  const geoSpread = await prisma.consultationRequest.groupBy({
    by: ['cityState'],
    _count: { id: true },
    where: { createdAt: { gte: startDate, lte: endDate } },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  return {
    questionsByCategory: questionsByCategory.map(q => ({
      category: q.category,
      count: q._count.id,
    })),
    avgAnswerTimeByCategory: avgAnswerTimeByCategory.map(a => ({
      category: a.category,
      avgHours: a.avgHours ? Number(a.avgHours.toFixed(1)) : 0,
    })),
    avgAnswerTimeOverall: avgAnswerTimeOverall[0]?.avgHours 
      ? Number(avgAnswerTimeOverall[0].avgHours.toFixed(1)) 
      : 0,
    consultationVolume: consultationVolume.map(c => ({
      date: isDaily ? c.dateGroup.toLocaleDateString() : c.dateGroup.toLocaleString('default', { month: 'short', year: 'numeric' }),
      count: c.count,
    })),
    geoSpread: geoSpread.map(g => ({
      location: g.cityState,
      count: (g._count as any)?.id ?? 0,
    })),
  };
}
