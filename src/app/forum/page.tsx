import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  // Next 16 searchParams is async, await it
  const sp = await searchParams;
  const q = sp.q || "";
  const category = sp.category || "";
  const page = parseInt(sp.page || "1", 10);
  const take = 10;
  const skip = (page - 1) * take;

  const where = {
    isRemoved: false,
    isHidden: false,
    ...(q ? { title: { contains: q, mode: 'insensitive' as const } } : {}),
    ...(category ? { category } : {}),
  };

  const [questions, total] = await Promise.all([
    prisma.forumQuestion.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { answers: true } },
        author: { select: { fullName: true } },
      },
    }),
    prisma.forumQuestion.count({ where }),
  ]);

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground font-serif">Community Forum</h1>
            <p className="text-muted-foreground mt-2">Ask questions and get answers from verified legal advisors.</p>
          </div>
          <div>
            {session?.user ? (
              session.user.role === "SEEKING_HELP" ? (
                <Button asChild><Link href="/forum/ask">Ask a Question</Link></Button>
              ) : (
                <p className="text-sm text-muted-foreground">Advisors can answer below.</p>
              )
            ) : (
              <Button asChild><Link href="/login">Login to Ask</Link></Button>
            )}
          </div>
        </div>

        <div className="bg-background p-4 rounded-xl shadow-sm border border-border mb-8">
          <form className="flex flex-col sm:flex-row gap-4" method="GET" action="/forum">
            <input 
              type="text" 
              name="q" 
              defaultValue={q} 
              placeholder="Search keywords..." 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm flex-grow"
            />
            <select 
              name="category" 
              defaultValue={category}
              className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              <option value="Housing">Housing</option>
              <option value="Family">Family</option>
              <option value="Employment">Employment</option>
              <option value="Immigration">Immigration</option>
            </select>
            <Button type="submit">Search</Button>
            {(q || category) && (
              <Button type="button" variant="outline" asChild>
                <Link href="/forum">Clear</Link>
              </Button>
            )}
          </form>
        </div>

        <div className="space-y-4">
          {questions.map((q) => (
            <Card key={q.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{q.category}</Badge>
                      {q.status === "RESOLVED" && <Badge className="bg-green-600 hover:bg-green-700">Resolved</Badge>}
                      {q.status === "IN_PROGRESS" && <Badge variant="secondary">In Progress</Badge>}
                      {q.status === "UNANSWERED" && <Badge variant="outline" className="text-muted-foreground">Unanswered</Badge>}
                    </div>
                    <Link href={`/forum/${q.id}`} className="block">
                      <h3 className="text-xl font-bold text-primary hover:underline">{q.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">{q.body}</p>
                    <p className="text-xs text-muted-foreground pt-2">
                      Asked by {q.isAnonymous ? "Anonymous" : q.author.fullName} on {q.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-center min-w-[80px] shrink-0 text-center bg-muted/30 p-3 rounded-lg">
                    <span className="text-2xl font-bold text-foreground">{q._count.answers}</span>
                    <span className="text-xs text-muted-foreground uppercase font-medium">Answers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-16 bg-background rounded-xl border border-dashed border-border text-muted-foreground">
              No questions found matching your criteria.
            </div>
          )}
        </div>

        {/* Basic Pagination */}
        <div className="flex justify-between items-center mt-8">
          {page > 1 ? (
            <Button variant="outline" asChild>
              <Link href={`/forum?q=${q}&category=${category}&page=${page - 1}`}>Previous</Link>
            </Button>
          ) : <div />}
          <span className="text-sm text-muted-foreground">Page {page} of {Math.max(1, Math.ceil(total / take))}</span>
          {skip + take < total ? (
            <Button variant="outline" asChild>
              <Link href={`/forum?q=${q}&category=${category}&page=${page + 1}`}>Next</Link>
            </Button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
