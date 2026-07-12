import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime } from "./format";

describe("formatDateTime", () => {
  it("formats an ISO datetime as pt-BR date and time", () => {
    expect(formatDateTime("2026-07-01T09:12:00")).toBe("01/07/2026, 09:12");
  });

  it("returns the original string when it cannot be parsed", () => {
    expect(formatDateTime("not-a-date")).toBe("not-a-date");
  });
});

describe("formatDate", () => {
  it("formats an ISO date (no time) as pt-BR", () => {
    expect(formatDate("2024-01-01")).toBe("01/01/2024");
  });

  it("returns the original string when it cannot be parsed", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});
