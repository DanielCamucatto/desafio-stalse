import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TicketsByDayChart } from "./TicketsByDayChart";

const data = [
  { date: "2024-01-01", count: 5 },
  { date: "2024-01-02", count: 12 },
  { date: "2024-01-03", count: 8 },
];

describe("TicketsByDayChart", () => {
  it("renders an accessible chart with one point per day", () => {
    render(<TicketsByDayChart data={data} />);

    const chart = screen.getByRole("img", { name: /tickets por dia/i });
    expect(chart).toBeInTheDocument();
    expect(chart.querySelectorAll("circle")).toHaveLength(3);
  });

  it("renders a y-axis tick for the rounded max value", () => {
    render(<TicketsByDayChart data={data} />);

    // max count is 12 -> rounded up to the next multiple of 5 -> 15
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("shows a tooltip with the exact date and count on hover", () => {
    render(<TicketsByDayChart data={data} />);

    const hitLayer = screen.getByTestId("chart-hit-layer");
    hitLayer.getBoundingClientRect = () =>
      ({
        width: 640,
        left: 0,
        top: 0,
        height: 220,
        right: 640,
        bottom: 220,
        x: 0,
        y: 0,
        toJSON: () => {},
      }) as DOMRect;

    // Middle data point (2024-01-02) sits at the horizontal center of the chart.
    fireEvent.pointerMove(hitLayer, { clientX: 320, clientY: 100 });

    expect(screen.getByText("12 tickets")).toBeInTheDocument();
    expect(screen.getByText("02/01/2024")).toBeInTheDocument();
  });

  it("hides the tooltip when the pointer leaves the chart", () => {
    render(<TicketsByDayChart data={data} />);

    const hitLayer = screen.getByTestId("chart-hit-layer");
    hitLayer.getBoundingClientRect = () =>
      ({
        width: 640,
        left: 0,
        top: 0,
        height: 220,
        right: 640,
        bottom: 220,
        x: 0,
        y: 0,
        toJSON: () => {},
      }) as DOMRect;

    fireEvent.pointerMove(hitLayer, { clientX: 320, clientY: 100 });
    expect(screen.getByText("12 tickets")).toBeInTheDocument();

    fireEvent.pointerLeave(hitLayer);
    expect(screen.queryByText("12 tickets")).not.toBeInTheDocument();
  });
});
