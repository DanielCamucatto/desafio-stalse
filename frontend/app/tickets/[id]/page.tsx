import { notFound } from "next/navigation";
import { fetchTicket } from "@/lib/api";
import { TicketDetail } from "@/components/TicketDetail";

export const dynamic = "force-dynamic";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let ticket;
  try {
    ticket = await fetchTicket(Number(id));
  } catch {
    notFound();
  }

  return <TicketDetail ticket={ticket} />;
}
