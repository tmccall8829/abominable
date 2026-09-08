import { Landmark, PiggyBank, LineChart, Sprout, Check } from "lucide-react";
import { accounts, currency, typeLabels, type Account, type AccountType } from "@/lib/finance";
import { cn } from "@/lib/utils";

const icons: Record<AccountType, typeof Landmark> = {
  checking: Landmark,
  savings: PiggyBank,
  investment: LineChart,
  retirement: Sprout,
};

const order: AccountType[] = ["checking", "savings", "investment", "retirement"];

type Props = {
  selectedIds: string[];
  onToggle: (id: string) => void;
  focusedId: string | null;
  onFocus: (id: string) => void;
};

export function AccountSidebar({ selectedIds, onToggle, focusedId, onFocus }: Props) {
  const total = accounts
    .filter((a) => selectedIds.includes(a.id))
    .reduce((s, a) => s + a.balance, 0);

  return (
    <aside className="flex w-[268px] shrink-0 flex-col gap-5 px-3 py-4">
      <div className="px-2">
        <div className="flex items-center gap-2">
          <div className="grid size-6 place-items-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
            F
          </div>
          <span className="text-sm font-semibold tracking-tight">Foundry</span>
        </div>
        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Net worth included
          </p>
          <p className="mt-1 font-mono text-[22px] leading-none tracking-tight">
            {currency(total)}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto pb-4">
        {order.map((type) => {
          const group = accounts.filter((a) => a.type === type);
          const Icon = icons[type];
          const sum = group
            .filter((a) => selectedIds.includes(a.id))
            .reduce((s, a) => s + a.balance, 0);
          return (
            <div key={type}>
              <div className="flex items-center justify-between px-2 pb-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  <Icon className="size-3" strokeWidth={2} />
                  {typeLabels[type]}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {currency(sum)}
                </span>
              </div>
              <div className="space-y-0.5">
                {group.map((a) => (
                  <Row
                    key={a.id}
                    account={a}
                    included={selectedIds.includes(a.id)}
                    focused={focusedId === a.id}
                    onToggle={() => onToggle(a.id)}
                    onFocus={() => onFocus(a.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function Row({
  account,
  included,
  focused,
  onToggle,
  onFocus,
}: {
  account: Account;
  included: boolean;
  focused: boolean;
  onToggle: () => void;
  onFocus: () => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
        focused ? "bg-card shadow-panel" : "hover:bg-sidebar-accent",
      )}
    >
      <button
        onClick={onToggle}
        aria-label={included ? "Exclude from projection" : "Include in projection"}
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors",
          included
            ? "border-transparent bg-primary text-primary-foreground"
            : "border-border bg-transparent text-transparent",
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </button>
      <button onClick={onFocus} className="min-w-0 flex-1 text-left">
        <p
          className={cn(
            "truncate text-[13px] leading-tight",
            included ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {account.name}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {account.institution} · {account.owner}
        </p>
      </button>
      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
        {currency(account.balance)}
      </span>
    </div>
  );
}
