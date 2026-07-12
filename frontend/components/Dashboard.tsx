import type { Metrics } from "@/lib/api";

const RECENT_DAYS_LIMIT = 14;

export function Dashboard({ metrics }: { metrics: Metrics }) {
  const recentDays = metrics.by_day.slice(-RECENT_DAYS_LIMIT).reverse();

  return (
    <div>
      <section>
        <h2>Total de tickets</h2>
        <p>{metrics.total_tickets}</p>
      </section>

      <section>
        <h2>Top categorias</h2>
        <ul>
          {metrics.top_categories.map((item) => (
            <li key={item.category}>
              <span>{item.category}</span>: <span>{item.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Tickets por dia (últimos {RECENT_DAYS_LIMIT} dias com dados)</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {recentDays.map((item) => (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p>Métricas geradas em: {metrics.generated_at}</p>
    </div>
  );
}
