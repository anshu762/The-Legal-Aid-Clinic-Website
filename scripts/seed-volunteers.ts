import { PrismaClient, Role, VerificationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dummyAdvisors = [
    {
      fullName: "Alice Chen",
      email: "alice.chen@example.com",
      specialization: ["Housing", "Immigration"],
      languages: ["English", "Mandarin"],
    },
    {
      fullName: "Robert Diaz",
      email: "robert.diaz@example.com",
      specialization: ["Family Law", "Domestic Violence"],
      languages: ["English", "Spanish"],
    },
    {
      fullName: "Fatima Al-Fayed",
      email: "fatima.alfayed@example.com",
      specialization: ["Employment", "Civil Rights"],
      languages: ["English", "Arabic"],
    },
    {
      fullName: "Marcus Johnson",
      email: "marcus.johnson@example.com",
      specialization: ["Housing", "Consumer Protection"],
      languages: ["English"],
    },
    {
      fullName: "Elena Rodriguez",
      email: "elena.rodriguez@example.com",
      specialization: ["Immigration", "Family Law"],
      languages: ["English", "Spanish", "Portuguese"],
    },
    {
      fullName: "David Kim",
      email: "david.kim@example.com",
      specialization: ["Employment", "Housing"],
      languages: ["English", "Korean"],
    },
  ];

  console.log("Seeding volunteers...");

  for (const advisor of dummyAdvisors) {
    const existing = await prisma.user.findUnique({
      where: { email: advisor.email },
    });

    if (existing) {
      console.log(`Advisor ${advisor.email} already exists. Skipping.`);
      continue;
    }

    await prisma.user.create({
      data: {
        fullName: advisor.fullName,
        email: advisor.email,
        role: Role.LEGAL_ADVISOR,
        advisorProfile: {
          create: {
            specialization: advisor.specialization,
            languages: advisor.languages,
            verificationStatus: VerificationStatus.VERIFIED,
            yearsOfExperience: Math.floor(Math.random() * 10) + 2,
            bio: "Committed to providing accessible legal aid.",
          },
        },
      },
    });
    console.log(`Created verified advisor: ${advisor.fullName}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
