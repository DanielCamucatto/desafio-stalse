export type Ticket = {
  id: number;
  created_at: string;
  customer_name: string;
  channel: string;
  subject: string;
  status: string;
  priority: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function fetchTickets(): Promise<Ticket[]> {
  const response = await fetch(`${API_BASE_URL}/tickets`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tickets: ${response.status}`);
  }
  return response.json();
}

export async function fetchTicket(id: number): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ticket ${id}: ${response.status}`);
  }
  return response.json();
}

export type TicketPatch = Partial<Pick<Ticket, "status" | "priority">>;

export async function updateTicket(
  id: number,
  patch: TicketPatch
): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!response.ok) {
    throw new Error(`Failed to update ticket ${id}: ${response.status}`);
  }
  return response.json();
}
