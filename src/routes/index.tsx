import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AccountSidebar } from "@/components/AccountSidebar";
import { AskPalette } from "@/components/AskPalette";
import { ProjectionChart } from "@/components/ProjectionChart";
import { TransactionLedger } from "@/components/TransactionLedger";
import { accounts } from "@/lib/finance";
import type { Insight } from "@/lib/insights";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abominable — Family Wealth Projections" },
      {
        name: "description",
        content:
          "Track checking, savings, investment, and retirement accounts in one calm workspace, with long-term wealth projections and a live transaction ledger.",
      },
      { property: "og:title", content: "Abominable — Family Wealth Projections" },
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
  const [askOpen, setAskOpen] = useState(false);
  const [pinned, setPinned] = useState<Insight | null>(null);

  const selected = useMemo(
    () => accounts.filter((a) => selectedIds.includes(a.id)),
    [selectedIds],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setAskOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
        onAsk={() => setAskOpen(true)}
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
            pinned={pinned}
            onUnpin={() => setPinned(null)}
          />
        </div>
      </main>
      <AskPalette open={askOpen} onOpenChange={setAskOpen} onPin={setPinned} />
    </div>
  );
}
