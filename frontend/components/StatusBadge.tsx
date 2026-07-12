const STATUS_STYLES: Record<string, string> = {
  open: "bg-blue-50 text-blue-700",
  in_progress: "bg-brand-100 text-brand-700",
  closed: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em andamento",
  closed: "Fechado",
};

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-brand-500 text-white",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-gray-100 text-gray-600",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

function badgeClasses(styles: Record<string, string>, value: string) {
  return `inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
    styles[value] ?? "bg-gray-100 text-gray-600"
  }`;
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={badgeClasses(STATUS_STYLES, status)}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={badgeClasses(PRIORITY_STYLES, priority)}>
      {PRIORITY_LABELS[priority] ?? priority}
    </span>
  );
}
