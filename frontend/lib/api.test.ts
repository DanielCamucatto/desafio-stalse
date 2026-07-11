import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchTicket, fetchTickets, updateTicket } from "./api";

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
