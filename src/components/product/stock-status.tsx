import { stockState } from "@/lib/catalog";
import { cn } from "@/lib/cn";

const dotClass = {
  "in-stock": "bg-success",
  "low-stock": "bg-accent",
  "sold-out": "bg-ink-subtle",
} as const;

export function StockStatus({ stock }: { stock: number }) {
  const state = stockState(stock);
  const label =
    state === "sold-out"
      ? "Sold out"
      : state === "low-stock"
        ? `Only ${stock} left`
        : "In stock";

  return (
    <p className="flex items-center gap-2 text-caption text-ink-muted">
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", dotClass[state])} />
      {label}
    </p>
  );
}
