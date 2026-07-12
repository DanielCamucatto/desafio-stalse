"use client";

import { useMemo, useState } from "react";
import { formatDate } from "@/lib/format";

type DayCount = { date: string; count: number };

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 32 };
const Y_TICK_COUNT = 4;

// brand-600 — validado com o script de acessibilidade do skill de dataviz
// (brand-500 sozinho fica em 2.95:1 de contraste, abaixo do piso de 3:1)
const LINE_COLOR = "#de5d10";
const AREA_COLOR = "#f2701f";
const GRID_COLOR = "#e1e0d9";
const AXIS_COLOR = "#c3c2b7";
const MUTED_TEXT = "#898781";

export function TicketsByDayChart({ data }: { data: DayCount[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { points, yTicks, innerWidth, innerHeight } = useMemo(() => {
    const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
    const maxCount = Math.max(...data.map((d) => d.count), 0);
    const niceMax = Math.max(Math.ceil(maxCount / 5) * 5, 5);

    const points = data.map((d, i) => {
      const x =
        data.length === 1
          ? PADDING.left + innerWidth / 2
          : PADDING.left + (i / (data.length - 1)) * innerWidth;
      const y = PADDING.top + innerHeight - (d.count / niceMax) * innerHeight;
      return { x, y, ...d };
    });

    const yTicks = Array.from({ length: Y_TICK_COUNT + 1 }, (_, i) => {
      const value = Math.round((niceMax / Y_TICK_COUNT) * i);
      const y = PADDING.top + innerHeight - (value / niceMax) * innerHeight;
      return { value, y };
    });

    return { points, yTicks, innerWidth, innerHeight };
  }, [data]);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const baselineY = PADDING.top + innerHeight;
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`
      : "";

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  function updateHoverFromClientX(target: Element, clientX: number) {
    const rect = target.getBoundingClientRect();
    if (rect.width === 0 || points.length === 0) {
      return;
    }
    const relativeX =
      ((clientX - rect.left) / rect.width) * CHART_WIDTH;
    let closest = 0;
    let closestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relativeX);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setHoverIndex(closest);
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Gráfico de tickets por dia"
      >
        {yTicks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PADDING.left}
              x2={CHART_WIDTH - PADDING.right}
              y1={tick.y}
              y2={tick.y}
              stroke={GRID_COLOR}
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 8}
              y={tick.y + 4}
              fontSize={11}
              fill={MUTED_TEXT}
              textAnchor="end"
            >
              {tick.value}
            </text>
          </g>
        ))}

        <line
          x1={PADDING.left}
          x2={CHART_WIDTH - PADDING.right}
          y1={baselineY}
          y2={baselineY}
          stroke={AXIS_COLOR}
          strokeWidth={1}
        />

        {areaPath && (
          <path d={areaPath} fill={AREA_COLOR} fillOpacity={0.1} stroke="none" />
        )}

        <path
          d={linePath}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((p, i) => {
          const showLabel =
            i === 0 || i === points.length - 1 || i % 2 === 0;
          return showLabel ? (
            <text
              key={`label-${p.date}`}
              x={p.x}
              y={baselineY + 18}
              fontSize={10}
              fill={MUTED_TEXT}
              textAnchor="middle"
            >
              {formatDate(p.date).slice(0, 5)}
            </text>
          ) : null;
        })}

        {points.map((p) => (
          <circle
            key={p.date}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={LINE_COLOR}
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}

        {hovered && (
          <line
            x1={hovered.x}
            x2={hovered.x}
            y1={PADDING.top}
            y2={baselineY}
            stroke={AXIS_COLOR}
            strokeWidth={1}
          />
        )}

        <rect
          data-testid="chart-hit-layer"
          x={PADDING.left}
          y={PADDING.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          onPointerMove={(event) =>
            updateHoverFromClientX(event.currentTarget, event.clientX)
          }
          onPointerLeave={() => setHoverIndex(null)}
        />
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[120%] rounded-md border border-gray-100 bg-white px-3 py-2 text-xs shadow-md"
          style={{
            left: `${(hovered.x / CHART_WIDTH) * 100}%`,
            top: `${(hovered.y / CHART_HEIGHT) * 100}%`,
          }}
        >
          <p className="font-semibold text-brand-900">{hovered.count} tickets</p>
          <p className="text-gray-500">{formatDate(hovered.date)}</p>
        </div>
      )}
    </div>
  );
}
