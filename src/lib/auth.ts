import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { advisorProfile: true },
        });
        
        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }
        
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          verificationStatus: user.advisorProfile?.verificationStatus,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.verificationStatus = (user as any).verificationStatus;
      }
      
      // Hit DB to check if session is still valid (password change bumps sessionsValidAfter)
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { sessionsValidAfter: true, role: true, advisorProfile: { select: { verificationStatus: true } } },
        });
        
        if (!dbUser) {
          throw new Error("User no longer exists");
        }
        
        // Ensure token was issued AFTER the sessionsValidAfter timestamp
        // JWT 'iat' is in seconds, JS Date is in ms
        const validAfterSeconds = Math.floor(dbUser.sessionsValidAfter.getTime() / 1000);
        if (token.iat && (token.iat as number) < validAfterSeconds) {
          throw new Error("Session invalid due to password change");
        }
        
        // Sync role/status in case they were updated by an admin
        token.role = dbUser.role;
        token.verificationStatus = dbUser.advisorProfile?.verificationStatus;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.verificationStatus = token.verificationStatus as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
};
