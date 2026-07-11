"use client";

import { useState } from "react";
import { updateTicket, type Ticket } from "@/lib/api";

export function TicketDetail({ ticket: initialTicket }: { ticket: Ticket }) {
  const [ticket, setTicket] = useState(initialTicket);
  const [isSaving, setIsSaving] = useState(false);

  async function handleUpdate(patch: Parameters<typeof updateTicket>[1]) {
    setIsSaving(true);
    try {
      const updated = await updateTicket(ticket.id, patch);
      setTicket(updated);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h1>{ticket.subject}</h1>
      <dl>
        <dt>Cliente</dt>
        <dd>{ticket.customer_name}</dd>
        <dt>Canal</dt>
        <dd>{ticket.channel}</dd>
        <dt>Criado em</dt>
        <dd>{ticket.created_at}</dd>
        <dt>Status</dt>
        <dd>{ticket.status}</dd>
        <dt>Prioridade</dt>
        <dd>{ticket.priority}</dd>
      </dl>

      <div>
        <button
          type="button"
          disabled={isSaving || ticket.status === "closed"}
          onClick={() => handleUpdate({ status: "closed" })}
        >
          Fechar ticket
        </button>
        <button
          type="button"
          disabled={isSaving || ticket.status === "in_progress"}
          onClick={() => handleUpdate({ status: "in_progress" })}
        >
          Marcar em andamento
        </button>
        <button
          type="button"
          disabled={isSaving || ticket.priority === "high"}
          onClick={() => handleUpdate({ priority: "high" })}
        >
          Marcar como alta
        </button>
        <button
          type="button"
          disabled={isSaving || ticket.priority === "low"}
          onClick={() => handleUpdate({ priority: "low" })}
        >
          Marcar como baixa
        </button>
      </div>
    </div>
  );
}
