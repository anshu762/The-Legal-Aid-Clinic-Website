import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireRole(allowedRoles: Role[]) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard"); // Or a dedicated /unauthorized page
  }

  if (session.user.role === "LEGAL_ADVISOR" && session.user.verificationStatus !== "VERIFIED") {
    // We let them access their dashboard to see the "Pending" banner,
    // but this check can be customized to block specific actions.
    // For full page blocking, we can throw an error or redirect.
  }

  return session;
}

export async function requireVerifiedAdvisor() {
  const session = await requireRole(["LEGAL_ADVISOR"]);
  
  if (session.user.verificationStatus !== "VERIFIED") {
    throw new Error("UNAUTHORIZED: Advisor is not verified.");
  }
  
  return session;
}
