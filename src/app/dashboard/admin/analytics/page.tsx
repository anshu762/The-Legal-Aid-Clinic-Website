import { getAnalyticsData } from "./actions";
import { AnalyticsClient } from "./components/AnalyticsClient";
import { subDays, parseISO, startOfDay, endOfDay } from "date-fns";

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string, from?: string, to?: string }> }) {
  const { range, from, to } = await searchParams;
  
  const now = endOfDay(new Date());
  let startDate = startOfDay(subDays(now, 30)); // default 30 days
  let endDate = now;

  if (range === "7") {
    startDate = startOfDay(subDays(now, 7));
  } else if (range === "90") {
    startDate = startOfDay(subDays(now, 90));
  } else if (range === "all") {
    startDate = new Date(0); // Epoch
  } else if (range === "custom" && from && to) {
    startDate = startOfDay(parseISO(from));
    endDate = endOfDay(parseISO(to));
  }

  const data = await getAnalyticsData(startDate, endDate);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-serif">Analytics Dashboard</h1>
      </div>

      <AnalyticsClient initialData={data} currentRange={range || "30"} />
    </div>
  );
}
