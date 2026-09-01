import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MatchForm } from "./MatchForm";

export default async function AdminConsultationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { id } = await params;

  const request = await prisma.consultationRequest.findUnique({
    where: { id },
    include: {
      requester: true,
      matchedAdvisor: true,
    },
  }) as any;

  if (!request) notFound();

  // THE MATCHING ENGINE
  let matchingAdvisors: any[] = [];
  if (request.status === "PENDING") {
    // 1. Fetch all verified active advisors
    const allAdvisors = await prisma.user.findMany({
      where: {
        role: "LEGAL_ADVISOR",
        isActive: true,
        advisorProfile: {
          verificationStatus: "VERIFIED",
        }
      },
      include: { advisorProfile: true }
    });

    // 2. Filter in memory
    matchingAdvisors = allAdvisors.filter(adv => {
      const profile = adv.advisorProfile!;
      
      // Is paused?
      const availJson = (profile.weeklyAvailability as any) || {};
      if (availJson.isPaused) return false;

      // Specialization match (or general)
      const hasSpecMatch = profile.specialization.length === 0 || 
                           profile.specialization.some((s: string) => s.toLowerCase() === request.category.toLowerCase());
      
      // Language match (or English)
      const hasLangMatch = profile.languages.length === 0 ||
                           request.languages.some((l: string) => profile.languages.includes(l));

      return hasSpecMatch && hasLangMatch;
    });
  }

  const preferredSlots = (request.preferredSlots as string[]) || [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif">Consultation Review</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/consultations">Back to List</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Seeker Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader className="bg-muted/10 border-b border-border">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{request.preferredName || request.requester.fullName}</CardTitle>
                  <p className="text-muted-foreground mt-1">{request.contactEmail} • {request.contactPhone || "No Phone"}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {request.status === "PENDING" && <Badge variant="secondary">Pending Match</Badge>}
                  {request.status === "CONFIRMED" && <Badge className="bg-green-600">Confirmed</Badge>}
                  {request.status === "COMPLETED" && <Badge variant="outline">Completed</Badge>}
                  {request.urgencyFlag && <Badge variant="destructive">Urgent</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Category</h3>
                  <p>{request.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Requested Length</h3>
                  <p>{request.requestedLengthMinutes} minutes</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Languages</h3>
                  <p>{request.languages.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Location</h3>
                  <p>{request.cityState}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Description</h3>
                <p className="whitespace-pre-wrap bg-muted/20 p-4 rounded-md border border-border">{request.description}</p>
              </div>

              {request.attachmentUrl && (
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Attachment</h3>
                  <Button asChild variant="outline" size="sm">
                    <a href={`/api/attachments/${request.attachmentUrl}`} target="_blank" rel="noopener noreferrer">
                      View Secure Attachment
                    </a>
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Matching / Status */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader className="bg-muted/10 border-b border-border">
              <CardTitle>Matching Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              
              {request.status === "PENDING" ? (
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground mb-4">Suggested Verified Matches</h3>
                  {matchingAdvisors.length > 0 ? (
                    <MatchForm 
                      requestId={request.id} 
                      advisors={matchingAdvisors} 
                      preferredSlots={preferredSlots} 
                    />
                  ) : (
                    <p className="text-destructive text-sm bg-destructive/10 p-3 rounded">
                      No advisors match these criteria who are verified and unpaused.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Matched Advisor</h3>
                    <p>{request.matchedAdvisor?.fullName || "Unknown"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Confirmed Time</h3>
                    <p>{request.confirmedSlot?.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Meeting Link</h3>
                    <a href={request.meetingLink || "#"} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">
                      {request.meetingLink}
                    </a>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
