import { useState } from "react";
import { CornerDownLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { insights, type Insight } from "@/lib/insights";
import { cn } from "@/lib/utils";

const SESSION_BUDGET = 3;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPin: (insight: Insight) => void;
};

export function AskPalette({ open, onOpenChange, onPin }: Props) {
  const [active, setActive] = useState<Insight | null>(null);
  const [asked, setAsked] = useState<Set<string>>(new Set());

  const budget = SESSION_BUDGET - asked.size;
  const exhausted = budget <= 0;

  function ask(insight: Insight) {
    setAsked((s) => new Set(s).add(insight.id));
    setActive(insight);
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) setActive(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden rounded-2xl border-border p-0 shadow-panel">
        <DialogTitle className="sr-only">Ask about your money</DialogTitle>
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
          <span className="size-1.5 shrink-0 rounded-full bg-primary" />
          <span className="flex-1 text-[15px]">
            {active ? active.question : "Ask about your money"}
          </span>
          <Badge variant="outline" className="shrink-0 font-mono text-[10px] font-normal">
            {exhausted ? "0 left" : `${budget}/${SESSION_BUDGET} left`}
          </Badge>
        </div>

        {active ? (
          <div className="animate-in fade-in p-4">
            <div className="flex items-center gap-2">
              <Badge className="whitespace-nowrap">{active.verdict}</Badge>
              <span className="text-xs text-muted-foreground">{active.scope}</span>
            </div>
            <div className="mt-3 flex gap-2">
              {active.stats.map((s) => (
                <div key={s.k} className="flex-1 rounded-lg border border-border bg-sidebar p-3">
                  <p className="text-[10px] text-muted-foreground">{s.k}</p>
                  <p className="mt-1 font-mono text-[15px] tracking-tight">{s.v}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
              {active.note}
            </p>
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              <Button variant="outline" size="sm" onClick={() => setActive(null)}>
                Other insights
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onPin(active);
                  handleOpenChange(false);
                }}
              >
                Pin to workspace
              </Button>
              <div className="flex-1" />
              <span className="text-[10.5px] text-muted-foreground">
                {exhausted ? "0 left" : `${budget} left`} · thread ends here
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.13em] text-muted-foreground">
              Suggested insights
            </p>
            <div className="flex flex-col gap-1.5">
              {insights.map((insight, i) => {
                const disabled = exhausted && !asked.has(insight.id);
                return (
                  <button
                    key={insight.id}
                    disabled={disabled}
                    onClick={() => ask(insight)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-border bg-sidebar px-3 py-2.5 text-left transition-colors",
                      "enabled:hover:border-primary disabled:cursor-not-allowed disabled:opacity-40",
                    )}
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-md bg-accent font-mono text-[10px] text-accent-foreground">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-[13px]">{insight.question}</span>
                    <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
            <p className="mt-3 px-0.5 text-[11px] leading-relaxed text-muted-foreground">
              Three questions per session. Each answer pins to the workspace as a structured
              summary.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
