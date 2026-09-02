import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VolunteerActions } from "./VolunteerActions";

import { BackButton } from "@/components/ui/back-button";

export default async function AdminVolunteerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id, role: "LEGAL_ADVISOR" },
    include: { advisorProfile: true },
  });

  if (!user || !user.advisorProfile) {
    notFound();
  }

  const profile = user.advisorProfile;

  return (
    <div className="space-y-6 max-w-4xl">
      <BackButton />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif">Review Application</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/volunteers">Back to Roster</Link>
        </Button>
      </div>

      <Card className="shadow-sm border-border overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{user.fullName}</CardTitle>
              <p className="text-muted-foreground mt-1">{user.email}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {profile.verificationStatus === "PENDING" && <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">Pending Review</Badge>}
              {profile.verificationStatus === "VERIFIED" && <Badge className="bg-green-600">Verified</Badge>}
              {profile.verificationStatus === "REJECTED" && <Badge variant="destructive">Rejected</Badge>}
              
              {!user.isActive && <Badge variant="destructive">Account Deactivated</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specialization.map(s => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Languages</h3>
                <p className="text-foreground">{profile.languages.join(", ")}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Experience / Bar</h3>
                <p className="text-foreground">{profile.barEnrollment || "Not provided"}</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Credential Proof</h3>
                {profile.credentialProofUrl ? (
                  <Button asChild variant="outline" className="w-full justify-start text-primary">
                    <a href={`/api/admin/credentials/${profile.credentialProofUrl}`} target="_blank" rel="noopener noreferrer">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      View Secure Attachment
                    </a>
                  </Button>
                ) : (
                  <p className="text-muted-foreground italic">No credential uploaded.</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Bio</h3>
                <p className="text-foreground whitespace-pre-wrap">{profile.bio || "No bio provided."}</p>
              </div>

              {profile.verificationStatus === "REJECTED" && profile.rejectionReason && (
                <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20">
                  <h3 className="text-sm font-bold text-destructive uppercase tracking-wider mb-2">Rejection Reason</h3>
                  <p className="text-destructive text-sm">{profile.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>

          <VolunteerActions advisorId={user.id} status={profile.verificationStatus} isActive={user.isActive} />
        </CardContent>
      </Card>
    </div>
  );
}
