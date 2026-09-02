import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

export const revalidate = 3600; // Cache for 1 hour

export default async function VolunteersPage() {
  // CRITICAL: We only select public fields, NEVER email or phone numbers
  let volunteers: any[] = [];
  try {
    volunteers = await prisma.user.findMany({
      where: {
        role: "LEGAL_ADVISOR",
        advisorProfile: {
          verificationStatus: "VERIFIED"
        }
      },
      select: {
        id: true,
        fullName: true,
        image: true,
        advisorProfile: {
          select: {
            specialization: true,
            languages: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  } catch (error) {
    console.warn("Could not fetch volunteers. Database might not be configured yet.");
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-muted/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground font-serif">Our Verified Volunteers</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Dedicated legal professionals committed to providing free, high-quality advice to those in need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {volunteers.map((volunteer) => (
            <Card key={volunteer.id} className="overflow-hidden border-border flex flex-col hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center flex-grow">
                {volunteer.image ? (
                  <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-muted">
                    <img
                      src={volunteer.image}
                      alt={volunteer.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-muted">
                    {volunteer.fullName.charAt(0)}
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-foreground">{volunteer.fullName}</h3>
                  <VerifiedBadge />
                </div>
                
                <div className="mt-6 w-full space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.advisorProfile?.specialization.map((spec: string) => (
                        <Badge key={spec} variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 font-normal">
                          {spec}
                        </Badge>
                      ))}
                      {(!volunteer.advisorProfile?.specialization || volunteer.advisorProfile.specialization.length === 0) && (
                        <span className="text-sm text-muted-foreground">General Practice</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.advisorProfile?.languages.map((lang: string) => (
                        <Badge key={lang} variant="secondary" className="font-normal">
                          {lang}
                        </Badge>
                      ))}
                      {(!volunteer.advisorProfile?.languages || volunteer.advisorProfile.languages.length === 0) && (
                        <span className="text-sm text-muted-foreground">English</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {volunteers.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-background rounded-xl border border-dashed border-border">
              No verified volunteers found at the moment. Please check back later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
