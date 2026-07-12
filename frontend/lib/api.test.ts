import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchMetrics, fetchTicket, fetchTickets, updateTicket } from "./api";

describe("fetchTickets", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("calls the tickets endpoint and returns the parsed data", async () => {
    const mockTickets = [
      {
        id: 1,
        created_at: "2024-01-01T10:00:00",
        customer_name: "Alice",
        channel: "email",
        subject: "Login issue",
        status: "open",
        priority: "high",
      },
    ];
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockTickets,
    });

    const result = await fetchTickets();

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/tickets"));
    expect(result).toEqual(mockTickets);
  });

  it("throws when the response is not ok", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchTickets()).rejects.toThrow();
  });
});

describe("fetchTicket", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("calls the single ticket endpoint and returns the parsed data", async () => {
    const mockTicket = {
      id: 1,
      created_at: "2024-01-01T10:00:00",
      customer_name: "Alice",
      channel: "email",
      subject: "Login issue",
      status: "open",
      priority: "high",
    };
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockTicket,
    });

    const result = await fetchTicket(1);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/tickets/1"));
    expect(result).toEqual(mockTicket);
  });
});

describe("updateTicket", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("sends a PATCH request with the given fields and returns the updated ticket", async () => {
    const updatedTicket = {
      id: 1,
      created_at: "2024-01-01T10:00:00",
      customer_name: "Alice",
      channel: "email",
      subject: "Login issue",
      status: "closed",
      priority: "high",
    };
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => updatedTicket,
    });

    const result = await updateTicket(1, { status: "closed" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/tickets/1"),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ status: "closed" }),
      })
    );
    expect(result).toEqual(updatedTicket);
  });
});

describe("fetchMetrics", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("calls the metrics endpoint and returns the parsed data", async () => {
    const mockMetrics = {
      generated_at: "2024-01-01T00:00:00+00:00",
      total_tickets: 2,
      by_day: [{ date: "2024-01-01", count: 2 }],
      top_categories: [{ category: "Technical issue", count: 2 }],
    };
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockMetrics,
    });

    const result = await fetchMetrics();

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/metrics"));
    expect(result).toEqual(mockMetrics);
  });
});
