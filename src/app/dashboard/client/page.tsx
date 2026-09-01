import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FeedbackForm } from "./FeedbackForm";

export default async function ClientDashboard() {
  const session = await requireRole(["SEEKING_HELP"]);

  const requests = await prisma.consultationRequest.findMany({
    where: { requesterId: session.user.id },
    include: { matchedAdvisor: true },
    orderBy: { id: "desc" }
  }) as any[];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif">Client Dashboard</h1>
        <Button asChild>
          <Link href="/consultations/request">Request Consultation</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {requests.map((req) => (
          <Card key={req.id} className="shadow-sm border-border">
            <CardHeader className="bg-muted/10 border-b border-border">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2">{req.category}</Badge>
                  <CardTitle>Consultation Request</CardTitle>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {req.status === "PENDING" && <Badge variant="secondary">Finding a match...</Badge>}
                  {req.status === "CONFIRMED" && <Badge className="bg-green-600">Confirmed</Badge>}
                  {req.status === "COMPLETED" && <Badge variant="outline">Completed</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase">Description</h4>
                    <p className="text-sm mt-1">{req.description}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase">Length</h4>
                      <p className="text-sm mt-1">{req.requestedLengthMinutes}m</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase">Language</h4>
                      <p className="text-sm mt-1">{req.languages.join(", ")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-md border border-border">
                  {req.status === "PENDING" ? (
                    <div className="text-sm text-muted-foreground">
                      We are currently matching you with a verified legal advisor. You will receive an email once a time is confirmed.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase">Advisor</h4>
                        <p className="text-sm font-medium">{req.matchedAdvisor?.fullName}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase">Confirmed Time</h4>
                        <p className="text-sm font-medium">{req.confirmedSlot?.toLocaleString()}</p>
                      </div>
                      
                      {req.status === "CONFIRMED" && (
                        <div className="pt-2">
                          <Button asChild className="w-full">
                            <a href={req.meetingLink || "#"} target="_blank" rel="noreferrer">Join Meeting</a>
                          </Button>
                        </div>
                      )}

                      {req.status === "COMPLETED" && (
                        <div className="pt-4 border-t border-border mt-4">
                          <FeedbackForm 
                            consultationId={req.id} 
                            initialRating={req.requesterFeedbackRating || 0} 
                            initialText={req.requesterFeedbackText || ""} 
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {requests.length === 0 && (
          <div className="bg-background rounded-xl border border-dashed border-border p-12 text-center">
            <h3 className="text-lg font-bold font-serif mb-2">No Requests Yet</h3>
            <p className="text-muted-foreground mb-6">You haven't requested any consultations. If you need legal advice, you can request one now.</p>
            <Button asChild>
              <Link href="/consultations/request">Request Consultation</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
