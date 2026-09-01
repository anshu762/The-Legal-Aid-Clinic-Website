import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runCron() {
  console.log("Starting Reminder Cron Job...");
  
  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
  
  // 1. Find consultations confirmed for exactly between now and 24 hours from now
  const upcoming = await prisma.consultationRequest.findMany({
    where: {
      status: "CONFIRMED",
      confirmedSlot: {
        gte: now,
        lte: in24Hours,
      }
    },
    include: {
      requester: true,
      matchedAdvisor: true,
    }
  });

  console.log(`Found ${upcoming.length} upcoming consultations within the next 24h.`);

  for (const cons of upcoming) {
    if (!cons.confirmedSlot || !cons.matchedAdvisor) continue;

    const msUntil = cons.confirmedSlot.getTime() - now.getTime();
    const hoursUntil = msUntil / (1000 * 60 * 60);

    let reminderType = "";
    if (hoursUntil <= 24 && hoursUntil > 23) reminderType = "24H_REMINDER";
    else if (hoursUntil <= 1 && hoursUntil > 0) reminderType = "1H_REMINDER";

    if (reminderType) {
      // Check if we already sent this exact reminder type for this consultation
      const existingLog = await prisma.notificationLog.findFirst({
        where: {
          userId: cons.requesterId, // just using requesterId to anchor the log
          type: reminderType,
          payload: {
            equals: { consultationId: cons.id }
          }
        }
      });

      if (!existingLog) {
        console.log(`\n\n[CRON DISPATCH] ${reminderType} for Consultation ${cons.id}`);
        
        // Log it to prevent duplicates
        await prisma.notificationLog.create({
          data: {
            userId: cons.requesterId,
            type: reminderType,
            payload: { consultationId: cons.id }
          }
        });

        // Email Seeker
        console.log(`To: ${cons.contactEmail}`);
        console.log(`Subject: Reminder: Your Legal Consultation is in ${reminderType === "24H_REMINDER" ? "24 hours" : "1 hour"}`);
        console.log(`Body: Your meeting with ${cons.matchedAdvisor.fullName} is coming up. Link: ${cons.meetingLink}`);

        // Email Advisor (STRICT PRIVACY)
        console.log(`\nTo: ${cons.matchedAdvisor.email}`);
        console.log(`Subject: Reminder: Upcoming Consultation`);
        console.log(`Body: You have a [${cons.category}] consultation starting soon. Link: ${cons.meetingLink}\n\n`);
      }
    }
  }

  console.log("Cron finished.");
  process.exit(0);
}

runCron().catch((e) => {
  console.error(e);
  process.exit(1);
});
