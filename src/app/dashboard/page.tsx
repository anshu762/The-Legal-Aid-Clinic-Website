import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardController() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "SEEKING_HELP") {
    redirect("/dashboard/client");
  } else if (session.user.role === "LEGAL_ADVISOR") {
    redirect("/dashboard/advisor");
  } else if (session.user.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  // Fallback
  redirect("/login");
}
