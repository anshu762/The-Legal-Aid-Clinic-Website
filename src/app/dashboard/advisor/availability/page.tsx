import { prisma } from "@/lib/prisma";
import { requireVerifiedAdvisor } from "@/lib/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailabilityForm } from "./AvailabilityForm";

export default async function AvailabilityPage() {
  const session = await requireVerifiedAdvisor();

  const profile = await prisma.advisorProfile.findUnique({
    where: { userId: session.user.id },
  });

  const availJson: any = profile?.weeklyAvailability || {};

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold font-serif">Manage Availability</h1>
      <p className="text-muted-foreground">Update your schedule for consultations. You can pause requests if you are currently busy.</p>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle>Schedule & Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailabilityForm 
            initialIsPaused={!!availJson.isPaused} 
            initialSchedule={availJson.schedule || ""} 
            initialDurations={profile?.preferredDurations || []} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
