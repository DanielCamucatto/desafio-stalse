import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TicketsTable } from "./TicketsTable";
import type { Ticket } from "@/lib/api";

const tickets: Ticket[] = [
  {
    id: 1,
    created_at: "2024-01-01T10:00:00",
    customer_name: "Alice",
    channel: "email",
    subject: "Login issue",
    status: "open",
    priority: "high",
  },
  {
    id: 2,
    created_at: "2024-01-02T10:00:00",
    customer_name: "Bob",
    channel: "chat",
    subject: "Billing question",
    status: "closed",
    priority: "low",
  },
];

describe("TicketsTable", () => {
  it("renders a row per ticket with the required columns", () => {
    render(<TicketsTable tickets={tickets} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Login issue")).toBeInTheDocument();
    expect(screen.getByText("Billing question")).toBeInTheDocument();
  });

  it("filters rows by search text", async () => {
    const user = userEvent.setup();
    render(<TicketsTable tickets={tickets} />);

    await user.type(screen.getByLabelText(/buscar/i), "Alice");

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });
});
