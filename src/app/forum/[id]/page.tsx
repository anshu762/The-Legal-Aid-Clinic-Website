import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { ReportDialog } from "@/components/forum/ReportDialog";
import { UpvoteButton, MarkResolvedButton, AnswerForm } from "@/components/forum/ForumInteractions";
import { AdminQuickActions } from "../AdminQuickActions";
import { BackButton } from "@/components/ui/back-button";

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const question = await prisma.forumQuestion.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, fullName: true, role: true } },
      answers: {
        orderBy: { upvoteCount: 'desc' },
        include: {
          advisor: {
            select: {
              fullName: true,
              image: true,
              advisorProfile: {
                select: { specialization: true, verificationStatus: true }
              }
            }
          },
          upvotes: session?.user?.id ? {
            where: { userId: session.user.id }
          } : false
        }
      }
    }
  });

  if (!question) {
    notFound();
  }

  const isAdmin = session?.user?.role === "ADMIN";

  if (question.isRemoved && !isAdmin) {
    notFound();
  }
  
  if (question.isHidden && !isAdmin) {
    notFound();
  }

  // Filter out removed/hidden answers for non-admins
  const visibleAnswers = isAdmin 
    ? question.answers 
    : question.answers.filter(a => !a.isRemoved && !a.isHidden);
  // Privacy Rule: Hide author name if anonymous (UNLESS viewer is Admin OR the author themselves)
  const isAuthor = session?.user?.id === question.authorId;
  const displayAuthorName = question.isAnonymous && !isAdmin && !isAuthor
    ? "Anonymous"
    : question.author.fullName;

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <BackButton />
        {/* Question Block */}
        <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2">
                <Badge variant="outline">{question.category}</Badge>
                {question.status === "RESOLVED" && <Badge className="bg-green-600">Resolved</Badge>}
                {question.status === "IN_PROGRESS" && <Badge variant="secondary">In Progress</Badge>}
                {question.status === "UNANSWERED" && <Badge variant="outline">Unanswered</Badge>}
              </div>
              
              <div className="flex items-center gap-3">
                {isAuthor && question.status !== "RESOLVED" && (
                  <MarkResolvedButton questionId={question.id} />
                )}
                {isAdmin && <AdminQuickActions targetType="QUESTION" targetId={question.id} />}
                <ReportDialog targetType="QUESTION" targetId={question.id} />
              </div>
            </div>
            
            <h1 className="text-3xl font-extrabold font-serif text-foreground mb-4">{question.title}</h1>
            <div className="prose prose-sm sm:prose max-w-none text-muted-foreground whitespace-pre-wrap">
              {question.body}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Asked by <span className="font-medium text-foreground">{displayAuthorName}</span> on {question.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Answers List */}
        <div>
          <h2 className="text-2xl font-bold font-serif mb-6">{visibleAnswers.length} Answers</h2>
          
          <div className="space-y-6">
            {visibleAnswers.map((answer) => {
              const hasUpvoted = answer.upvotes && answer.upvotes.length > 0;
              
              return (
                <div key={answer.id} className="bg-background rounded-xl shadow-sm border border-border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {answer.advisor.image ? (
                        <Image src={answer.advisor.image} alt={answer.advisor.fullName} width={40} height={40} className="rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          {answer.advisor.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{answer.advisor.fullName}</span>
                          {answer.advisor.advisorProfile?.verificationStatus === "VERIFIED" && (
                            <VerifiedBadge />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {answer.advisor.advisorProfile?.specialization.join(", ") || "General Practice"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isAdmin && <AdminQuickActions targetType="ANSWER" targetId={answer.id} />}
                      <ReportDialog targetType="ANSWER" targetId={answer.id} />
                    </div>
                  </div>
                  
                  <div className="whitespace-pre-wrap text-muted-foreground mb-6">
                    {answer.body}
                  </div>
                  
                  {/* Legal Disclaimer globally required */}
                  <div className="bg-muted p-3 rounded-md text-xs text-muted-foreground italic mb-6 border border-border">
                    Disclaimer: This information is for educational purposes and does not constitute formal legal representation or establish an attorney-client relationship.
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <UpvoteButton answerId={answer.id} initialCount={answer.upvoteCount} initialUpvoted={!!hasUpvoted} />
                    <span className="text-xs text-muted-foreground">Answered on {answer.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
            
            {question.answers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground bg-background rounded-xl border border-dashed border-border">
                No answers yet. Check back soon.
              </div>
            )}
          </div>
        </div>

        {/* Answer Form for Verified Advisors */}
        {session?.user?.role === "LEGAL_ADVISOR" && session.user.verificationStatus === "VERIFIED" && question.status !== "RESOLVED" && (
          <AnswerForm questionId={question.id} />
        )}

      </div>
    </div>
  );
}
