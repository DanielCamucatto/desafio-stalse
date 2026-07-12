"use client";

import { useState } from "react";
import Link from "next/link";
import { updateTicket, type Ticket } from "@/lib/api";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";

const actionButton =
  "rounded-md border border-brand-900/10 bg-white px-4 py-2 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white";

const primaryButton =
  "rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-brand-500";

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
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <Link
        href="/tickets"
        className="text-sm font-semibold text-brand-600 hover:underline"
      >
        ← Voltar para tickets
      </Link>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>

        <h1 className="mt-3 text-2xl font-bold text-brand-900">
          {ticket.subject}
        </h1>

        <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Cliente</dt>
            <dd className="font-medium text-brand-900">
              {ticket.customer_name}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Canal</dt>
            <dd className="font-medium capitalize text-brand-900">
              {ticket.channel}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Criado em</dt>
            <dd className="font-medium text-brand-900">
              {formatDateTime(ticket.created_at)}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={primaryButton}
                disabled={isSaving || ticket.status === "closed"}
                onClick={() => handleUpdate({ status: "closed" })}
              >
                Fechar ticket
              </button>
              <button
                type="button"
                className={actionButton}
                disabled={isSaving || ticket.status === "in_progress"}
                onClick={() => handleUpdate({ status: "in_progress" })}
              >
                Marcar em andamento
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Prioridade
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={primaryButton}
                disabled={isSaving || ticket.priority === "high"}
                onClick={() => handleUpdate({ priority: "high" })}
              >
                Marcar como alta
              </button>
              <button
                type="button"
                className={actionButton}
                disabled={isSaving || ticket.priority === "low"}
                onClick={() => handleUpdate({ priority: "low" })}
              >
                Marcar como baixa
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
