import { fetchTickets } from "@/lib/api";
import { TicketsTable } from "@/components/TicketsTable";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const tickets = await fetchTickets();

  return (
    <main>
      <h1>Tickets</h1>
      <TicketsTable tickets={tickets} />
    </main>
  );
}
