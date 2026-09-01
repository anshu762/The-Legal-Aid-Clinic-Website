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
            path: ['consultationId'],
            equals: cons.id
          }
        }
      });

      if (!existingLog) {
        console.log(`\n\n[CRON DISPATCH] ${reminderType} for Consultation ${cons.id}`);
        
        const eventType = reminderType === "24H_REMINDER" ? "CONSULTATION_REMINDER_24H" : "CONSULTATION_REMINDER_1H";

        const { sendTransactionalEmail } = await import("../src/lib/email/sender");
        
        // Seeker Email
        await sendTransactionalEmail(cons.requesterId, eventType, {
          email: cons.contactEmail,
          name: cons.preferredName,
          meetingLink: cons.meetingLink || "",
          time: cons.confirmedSlot.toLocaleString(),
          consultationId: cons.id,
        });

        // Advisor Email
        await sendTransactionalEmail(cons.matchedAdvisor.id, eventType, {
          email: cons.matchedAdvisor.email,
          name: cons.matchedAdvisor.fullName,
          meetingLink: cons.meetingLink || "",
          time: cons.confirmedSlot.toLocaleString(),
          consultationId: cons.id,
        });
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
