"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";


interface AnalyticsData {
  questionsByCategory: { category: string; count: number }[];
  avgAnswerTimeByCategory: { category: string; avgHours: number }[];
  avgAnswerTimeOverall: number;
  consultationVolume: { date: string; count: number }[];
  geoSpread: { location: string; count: number }[];
}

export function AnalyticsClient({ initialData, currentRange }: { initialData: AnalyticsData, currentRange: string }) {
  const router = useRouter();

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/dashboard/admin/analytics?range=${e.target.value}`);
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => 
      Object.values(row).map(val => typeof val === 'string' ? `"${val}"` : val).join(",")
    ).join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <select 
          value={currentRange} 
          onChange={handleRangeChange}
          className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Question Volume */}
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Question Volume by Category</h3>
            <Button variant="outline" size="sm" onClick={() => downloadCSV(initialData.questionsByCategory, "question-volume")}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialData.questionsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" name="Questions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avg Answer Time */}
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Avg Time-to-First-Answer</h3>
            <Button variant="outline" size="sm" onClick={() => downloadCSV(initialData.avgAnswerTimeByCategory, "avg-answer-time")}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Overall Average: <strong className="text-foreground">{initialData.avgAnswerTimeOverall} hours</strong></p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialData.avgAnswerTimeByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" unit="h" />
                <YAxis dataKey="category" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="avgHours" fill="#16a34a" name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consultation Volume */}
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Consultation Volume Over Time</h3>
            <Button variant="outline" size="sm" onClick={() => downloadCSV(initialData.consultationVolume, "consultation-volume")}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={initialData.consultationVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#db2777" strokeWidth={3} name="Consultations" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Spread */}
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Geographic Spread (Top 10)</h3>
            <Button variant="outline" size="sm" onClick={() => downloadCSV(initialData.geoSpread, "geo-spread")}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialData.geoSpread}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
