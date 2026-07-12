import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TicketDetail } from "./TicketDetail";
import * as api from "@/lib/api";
import type { Ticket } from "@/lib/api";

const ticket: Ticket = {
  id: 1,
  created_at: "2024-01-01T10:00:00",
  customer_name: "Alice",
  channel: "email",
  subject: "Login issue",
  status: "open",
  priority: "low",
};

describe("TicketDetail", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the ticket details", () => {
    render(<TicketDetail ticket={ticket} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Login issue")).toBeInTheDocument();
    expect(screen.getByText("Aberto")).toBeInTheDocument();
    expect(screen.getByText("Baixa")).toBeInTheDocument();
  });

  it("closes the ticket and updates the UI when clicking the close button", async () => {
    const user = userEvent.setup();
    vi.spyOn(api, "updateTicket").mockResolvedValue({
      ...ticket,
      status: "closed",
    });

    render(<TicketDetail ticket={ticket} />);
    await user.click(screen.getByRole("button", { name: /fechar ticket/i }));

    expect(api.updateTicket).toHaveBeenCalledWith(1, { status: "closed" });
    expect(await screen.findByText("Fechado")).toBeInTheDocument();
  });

  it("marks priority as high and updates the UI", async () => {
    const user = userEvent.setup();
    vi.spyOn(api, "updateTicket").mockResolvedValue({
      ...ticket,
      priority: "high",
    });

    render(<TicketDetail ticket={ticket} />);
    await user.click(
      screen.getByRole("button", { name: /marcar como alta/i })
    );

    expect(api.updateTicket).toHaveBeenCalledWith(1, { priority: "high" });
    expect(await screen.findByText("Alta")).toBeInTheDocument();
  });
});
