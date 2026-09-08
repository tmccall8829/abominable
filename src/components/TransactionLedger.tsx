import { accounts, currency, transactions } from "@/lib/finance";
import { cn } from "@/lib/utils";

export function TransactionLedger({ focusedId }: { focusedId: string | null }) {
  const rows = transactions
    .filter((t) => !focusedId || t.accountId === focusedId)
    .slice(0, 40);
  const account = accounts.find((a) => a.id === focusedId);
  const net = rows.reduce((s, t) => s + t.amount, 0);

  return (
    <section className="flex min-h-0 w-[360px] shrink-0 flex-col rounded-2xl border border-border bg-card shadow-panel">
      <header className="border-b border-border px-4 py-3.5">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Ledger</p>
        <p className="mt-1 text-sm font-medium tracking-tight">
          {account ? account.name : "All accounts"}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {rows.length} recent · net{" "}
          <span className="font-mono">{currency(net, 2)}</span>
        </p>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 border-b border-border/60 px-4 py-2.5 last:border-0 hover:bg-sidebar-accent"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] leading-tight">{t.merchant}</p>
              <p className="text-[11px] text-muted-foreground">
                {t.date} · {t.category}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 font-mono text-[12px]",
                t.amount >= 0 ? "text-positive" : "text-foreground",
              )}
            >
              {t.amount >= 0 ? "+" : ""}
              {currency(t.amount, 2)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
