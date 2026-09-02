import { PrismaClient, Role } from "@prisma/client";
import { subDays, addHours, startOfMonth, subMonths } from "date-fns";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedAnalytics() {
  console.log("Seeding Analytics Data...");

  // 1. Create a dummy seeker and advisor if they don't exist
  const passwordHash = await bcrypt.hash("password123", 10);
  
  let seeker = await prisma.user.findUnique({ where: { email: "seeker.analytics@example.com" } });
  if (!seeker) {
    seeker = await prisma.user.create({
      data: {
        email: "seeker.analytics@example.com",
        fullName: "Analytics Seeker",
        passwordHash,
        role: Role.SEEKING_HELP,
      },
    });
  }

  let advisor = await prisma.user.findUnique({ where: { email: "advisor.analytics@example.com" } });
  if (!advisor) {
    advisor = await prisma.user.create({
      data: {
        email: "advisor.analytics@example.com",
        fullName: "Analytics Advisor",
        passwordHash,
        role: Role.LEGAL_ADVISOR,
        advisorProfile: {
          create: {
            verificationStatus: "VERIFIED",
            specialization: ["Family Law", "Property Law"],
            languages: ["English"],
          }
        }
      },
    });
  }

  const now = new Date();
  
  // 2. Generate Forum Questions and Answers
  const categories = ["Family Law", "Property Law", "Criminal Defense", "Civil Rights"];
  
  console.log("Creating Forum Questions & Answers...");
  for (let i = 0; i < 60; i++) {
    // Distribute randomly over the last 90 days
    const daysAgo = Math.floor(Math.random() * 90);
    const questionDate = subDays(now, daysAgo);
    
    const category = categories[i % categories.length];
    
    const question = await prisma.forumQuestion.create({
      data: {
        title: `Question ${i} regarding ${category}`,
        body: `This is a test question body for analytics. It's related to ${category}.`,
        category,
        authorId: seeker.id,
        createdAt: questionDate,
        status: i % 3 === 0 ? "RESOLVED" : "IN_PROGRESS",
      },
    });

    // Create an answer with a delay of 1 to 48 hours
    const delayHours = Math.floor(Math.random() * 47) + 1;
    const answerDate = addHours(questionDate, delayHours);

    await prisma.forumAnswer.create({
      data: {
        body: `This is a test answer for question ${i}. It was answered after ${delayHours} hours.`,
        questionId: question.id,
        advisorId: advisor.id,
        createdAt: answerDate,
      },
    });
  }

  // 3. Generate Consultations
  const cities = ["Mumbai, MH", "Delhi, DL", "Bangalore, KA", "Chennai, TN", "Kolkata, WB"];
  
  console.log("Creating Consultations...");
  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const requestDate = subDays(now, daysAgo);
    
    const cityState = cities[i % cities.length];
    const category = categories[i % categories.length];

    await prisma.consultationRequest.create({
      data: {
        requesterId: seeker.id,
        preferredName: "Analytics Seeker",
        contactEmail: "seeker.analytics@example.com",
        cityState,
        category,
        description: `Consultation request ${i}`,
        languages: ["English"],
        requestedLengthMinutes: 30,
        preferredSlots: JSON.stringify(["Morning", "Afternoon"]),
        status: i % 4 === 0 ? "CONFIRMED" : "PENDING",
        matchedAdvisorId: i % 4 === 0 ? advisor.id : null,
        createdAt: requestDate,
      },
    });
  }

  console.log("Done seeding analytics.");
}

seedAnalytics()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
