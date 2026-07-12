"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Ticket } from "@/lib/api";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";

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
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Buscar por cliente, assunto, canal..."
        aria-label="Buscar tickets"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full max-w-md rounded-md border border-gray-200 px-4 py-2 text-sm text-brand-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Canal</th>
              <th className="px-4 py-3">Assunto</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Prioridade</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b border-gray-50 last:border-0 hover:bg-brand-50/40"
              >
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                  {formatDateTime(ticket.created_at)}
                </td>
                <td className="px-4 py-3 font-medium text-brand-900">
                  {ticket.customer_name}
                </td>
                <td className="px-4 py-3 capitalize text-gray-600">
                  {ticket.channel}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="font-medium text-brand-600 hover:underline"
                  >
                    {ticket.subject}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={ticket.priority} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
