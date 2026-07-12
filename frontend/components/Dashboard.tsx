import type { Metrics } from "@/lib/api";
import { formatDate } from "@/lib/format";

const RECENT_DAYS_LIMIT = 14;

export function Dashboard({ metrics }: { metrics: Metrics }) {
  const recentDays = metrics.by_day.slice(-RECENT_DAYS_LIMIT).reverse();

  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Total de tickets
          </p>
          <p className="mt-2 text-4xl font-bold text-brand-500">
            {metrics.total_tickets.toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Top categorias
          </p>
          <ul className="flex flex-wrap gap-2">
            {metrics.top_categories.map((item) => (
              <li
                key={item.category}
                className="flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-sm"
              >
                <span className="font-medium text-brand-900">
                  {item.category}
                </span>
                <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Tickets por dia (últimos {RECENT_DAYS_LIMIT} dias com dados)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="py-2">Data</th>
                <th className="py-2">Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {recentDays.map((item) => (
                <tr key={item.date} className="border-b border-gray-50 last:border-0">
                  <td className="whitespace-nowrap py-2 text-brand-900">
                    {formatDate(item.date)}
                  </td>
                  <td className="py-2 text-gray-600">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-gray-400">
        Métricas geradas em: {metrics.generated_at}
      </p>
    </div>
  );
}
