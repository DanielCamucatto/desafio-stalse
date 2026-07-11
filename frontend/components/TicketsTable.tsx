"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Ticket } from "@/lib/api";

export function TicketsTable({ tickets }: { tickets: Ticket[] }) {
  const [query, setQuery] = useState("");

  const filteredTickets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return tickets;
    }
    return tickets.filter((ticket) =>
      [
        ticket.customer_name,
        ticket.subject,
        ticket.channel,
        ticket.status,
        ticket.priority,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [tickets, query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por cliente, assunto, canal..."
        aria-label="Buscar tickets"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Canal</th>
            <th>Assunto</th>
            <th>Status</th>
            <th>Prioridade</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.created_at}</td>
              <td>{ticket.customer_name}</td>
              <td>{ticket.channel}</td>
              <td>
                <Link href={`/tickets/${ticket.id}`}>{ticket.subject}</Link>
              </td>
              <td>{ticket.status}</td>
              <td>{ticket.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
