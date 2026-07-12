import { fetchMetrics } from "@/lib/api";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const metrics = await fetchMetrics();

  return (
    <main>
      <h1>Dashboard</h1>
      <Dashboard metrics={metrics} />
    </main>
  );
}
