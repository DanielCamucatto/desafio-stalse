import { fetchMetrics } from "@/lib/api";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const metrics = await fetchMetrics();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">
          Métricas
        </p>
        <h1 className="text-3xl font-bold text-brand-900">Dashboard</h1>
      </div>
      <Dashboard metrics={metrics} />
    </main>
  );
}
