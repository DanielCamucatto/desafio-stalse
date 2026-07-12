import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Dashboard } from "./Dashboard";
import type { Metrics } from "@/lib/api";

const metrics: Metrics = {
  generated_at: "2024-01-01T00:00:00+00:00",
  total_tickets: 42,
  by_day: [
    { date: "2024-01-01", count: 5 },
    { date: "2024-01-02", count: 7 },
  ],
  top_categories: [
    { category: "Technical issue", count: 20 },
    { category: "Billing inquiry", count: 15 },
  ],
};

describe("Dashboard", () => {
  it("renders the total tickets card", () => {
    render(<Dashboard metrics={metrics} />);

    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders the top categories", () => {
    render(<Dashboard metrics={metrics} />);

    expect(screen.getByText("Technical issue")).toBeInTheDocument();
    expect(screen.getByText("Billing inquiry")).toBeInTheDocument();
  });

  it("renders ticket counts by day", () => {
    render(<Dashboard metrics={metrics} />);

    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
    expect(screen.getByText("02/01/2024")).toBeInTheDocument();
  });
});
