import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AccountSidebar } from "@/components/AccountSidebar";
import { ProjectionChart } from "@/components/ProjectionChart";
import { TransactionLedger } from "@/components/TransactionLedger";
import { accounts } from "@/lib/finance";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Foundry — Family Wealth Projections" },
      {
        name: "description",
        content:
          "Track checking, savings, investment, and retirement accounts in one calm workspace, with long-term wealth projections and a live transaction ledger.",
      },
      { property: "og:title", content: "Foundry — Family Wealth Projections" },
      {
        property: "og:description",
        content:
          "A minimal personal and family finance workspace for long-term wealth projections across all your accounts.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [selectedIds, setSelectedIds] = useState(accounts.map((a) => a.id));
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [years, setYears] = useState(30);
  const [scenario, setScenario] = useState<"conservative" | "base" | "optimistic">("base");

  const selected = useMemo(
    () => accounts.filter((a) => selectedIds.includes(a.id)),
    [selectedIds],
  );

  return (
    <div className="flex h-screen bg-sidebar text-foreground">
      <AccountSidebar
        selectedIds={selectedIds}
        onToggle={(id) =>
          setSelectedIds((ids) =>
            ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
          )
        }
        focusedId={focusedId}
        onFocus={(id) => setFocusedId((f) => (f === id ? null : id))}
      />
      <main className="flex min-w-0 flex-1 flex-col gap-3 py-4 pr-4">
        <div className="flex min-h-0 flex-1 gap-3">
          <TransactionLedger focusedId={focusedId} />
          <ProjectionChart
            selected={selected}
            years={years}
            onYears={setYears}
            scenario={scenario}
            onScenario={setScenario}
          />
        </div>
      </main>
    </div>
  );
}
