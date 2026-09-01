import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ClosureNoteForm } from "./ClosureNoteForm";

export default async function AdvisorDashboard() {
  const session = await requireRole(["LEGAL_ADVISOR"]);

  if (session.user.verificationStatus !== "VERIFIED") {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold font-serif">Advisor Dashboard</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-bold">Your application is under review.</span> Once verified, you'll be able to answer questions and take consultations.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch confirmed consultations for this advisor
  // STRICT PRIVACY: NEVER SELECT contactEmail, contactPhone, or preferredName
  const consultations = await prisma.consultationRequest.findMany({
    where: {
      matchedAdvisorId: session.user.id,
      status: { in: ["CONFIRMED", "COMPLETED"] }
    },
    select: {
      id: true,
      category: true,
      description: true,
      languages: true,
      requestedLengthMinutes: true,
      confirmedSlot: true,
      meetingLink: true,
      status: true,
      closureNote: true,
      // ABSOLUTELY NO REQUESTER CONTACT FIELDS HERE
    },
    orderBy: { confirmedSlot: "asc" }
  });

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Advisor Dashboard</h1>
        <div className="space-x-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/advisor/availability">Manage Availability</Link>
          </Button>
          <Button asChild>
            <Link href="/forum">Browse Forum</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-serif">Your Consultations</h2>
        
        {consultations.length === 0 ? (
          <div className="bg-background rounded-xl shadow-sm border border-border p-8 text-center text-muted-foreground">
            You don't have any confirmed consultations yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultations.map((c) => (
              <Card key={c.id} className="shadow-sm border-border flex flex-col">
                <CardHeader className="bg-muted/10 border-b border-border pb-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{c.category}</Badge>
                    {c.status === "CONFIRMED" && <Badge className="bg-green-600">Confirmed</Badge>}
                    {c.status === "COMPLETED" && <Badge variant="secondary">Completed</Badge>}
                  </div>
                  <CardTitle className="text-lg mt-2">
                    {c.confirmedSlot ? c.confirmedSlot.toLocaleString() : "TBD"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="text-xs font-bold text-muted-foreground uppercase">Length</span>
                      <p className="text-sm">{c.requestedLengthMinutes} mins</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-muted-foreground uppercase">Language</span>
                      <p className="text-sm">{c.languages.join(", ")}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-muted-foreground uppercase">Description</span>
                      <p className="text-sm line-clamp-3 text-muted-foreground">{c.description}</p>
                    </div>
                    
                    {c.status === "CONFIRMED" && c.meetingLink && (
                      <div className="pt-4 border-t border-border mt-4">
                        <Button asChild className="w-full">
                          <a href={c.meetingLink} target="_blank" rel="noreferrer">Join Meeting</a>
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto border-t border-border pt-4">
                    <ClosureNoteForm consultationId={c.id} initialNote={c.closureNote || ""} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
