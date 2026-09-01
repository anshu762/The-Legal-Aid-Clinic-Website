import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          email: user.email,
          token,
          expiresAt,
        },
      });

      const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;
      
      // If SMTP is configured, send the actual email
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"Legal Aid Clinic" <noreply@tlc.org>',
          to: user.email,
          subject: "Reset Your Password - The Legal Aid Clinic",
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
              <h2 style="color: #0f172a;">Password Reset Request</h2>
              <p>We received a request to reset your password for The Legal Aid Clinic.</p>
              <p>Click the button below to reset it. This link is valid for 1 hour.</p>
              <div style="margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
              </div>
              <p style="color: #64748b; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });
        console.log(`[EMAIL SENT] Password reset sent to ${email}`);
      } else {
        // Fallback to console if no SMTP configured
        console.log(`\n\n[NO SMTP CONFIGURED] Password reset requested for ${email}`);
        console.log(`[LINK] Click here to reset: ${resetLink}\n\n`);
      }
    }

    // Always return success even if user not found (security best practice)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
