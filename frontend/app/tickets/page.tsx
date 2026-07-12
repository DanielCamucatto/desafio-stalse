import { fetchTickets } from "@/lib/api";
import { TicketsTable } from "@/components/TicketsTable";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const tickets = await fetchTickets();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">
          Suporte
        </p>
        <h1 className="text-3xl font-bold text-brand-900">Tickets</h1>
      </div>
      <TicketsTable tickets={tickets} />
    </main>
  );
}
