import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, ShieldCheck, MessageSquare, Activity } from "lucide-react";

export default async function AdminDashboard() {
  await requireRole(["ADMIN"]);

  // Fetch real metrics from Prisma
  const totalUsersCount = await prisma.user.count();
  const pendingAdvisorsCount = await prisma.advisorProfile.count({
    where: { verificationStatus: "PENDING" },
  });
  const activeConsultationsCount = await prisma.consultationRequest.count({
    where: { status: { in: ["PENDING", "CONFIRMED"] } },
  });
  const flaggedPostsCount = await prisma.report.count({
    where: { status: "OPEN" },
  });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, fullName: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Welcome, Admin</h1>
        <p className="text-muted-foreground mt-1">Here is the overview of system metrics and recent activities.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600"><Users size={16} /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalUsersCount}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Advisors</CardTitle>
            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600"><ShieldCheck size={16} /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingAdvisorsCount}</div>
            {pendingAdvisorsCount > 0 && <p className="text-xs text-yellow-600 mt-1 font-medium">Requires verification</p>}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Consultations</CardTitle>
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600"><MessageSquare size={16} /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{activeConsultationsCount}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Reports</CardTitle>
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-600"><AlertTriangle size={16} /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{flaggedPostsCount}</div>
            {flaggedPostsCount > 0 && <p className="text-xs text-red-600 mt-1 font-medium">Action needed</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-md">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium rounded-tr-md">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{user.fullName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'LEGAL_ADVISOR' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle>Quick System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-700 text-sm">Database Sync</span>
              </div>
              <span className="text-green-600 text-xs font-bold">ONLINE</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-700 text-sm">Email Service</span>
              </div>
              <span className="text-green-600 text-xs font-bold">ONLINE</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-blue-700 text-sm">Automated Matching</span>
              </div>
              <span className="text-blue-600 text-xs font-bold">ACTIVE</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
