import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, role, advisorProfile } = await req.json();

    if (!fullName || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (role === Role.ADMIN) {
      return NextResponse.json({ error: "Cannot register as admin" }, { status: 403 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: role as Role,
        ...(role === Role.LEGAL_ADVISOR
          ? {
              advisorProfile: {
                create: {
                  verificationStatus: "PENDING",
                  specialization: advisorProfile?.specialization || [],
                  languages: advisorProfile?.languages || [],
                  barEnrollment: advisorProfile?.barEnrollment || null,
                  credentialProofUrl: advisorProfile?.credentialProofUrl || null,
                  bio: advisorProfile?.bio || null,
                },
              },
            }
          : {}),
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
