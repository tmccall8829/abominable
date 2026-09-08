export type InsightStat = { k: string; v: string };

export type Insight = {
  id: string;
  question: string;
  verdict: string;
  scope: string;
  stats: InsightStat[];
  note: string;
};

// ponytail: canned responses standing in for a real ask-your-money model.
// Swap for an actual query/LLM pipeline over `accounts`/`transactions` when that lands.
export const insights: Insight[] = [
  {
    id: "japan-trip",
    question: "Can we afford a 3-week trip to Japan next spring?",
    verdict: "Yes, comfortably",
    scope: "Checking + Emergency Fund",
    stats: [
      { k: "Est. cost", v: "$6,200" },
      { k: "Buffer after", v: "$28,900" },
      { k: "Runway impact", v: "–2 wks" },
    ],
    note: "Your emergency fund covers about 7 months of expenses today. A $6,200 trip trims that to roughly 6.5 months and rebuilds within two paychecks after.",
  },
  {
    id: "max-401k",
    question: "What happens if I max out my 401(k) this year?",
    verdict: "–$1,240/mo take-home",
    scope: "401(k) — Tom · pre-tax contribution",
    stats: [
      { k: "New contribution", v: "$1,958/mo" },
      { k: "Take-home change", v: "–$1,240/mo" },
      { k: "2056 balance", v: "+$412K" },
    ],
    note: "Raising Tom's contribution to the 2026 IRS limit costs about $1,240/month in take-home pay, but adds roughly $412K to the 2056 base-scenario projection.",
  },
  {
    id: "emergency-runway",
    question: "How many months does our emergency fund cover?",
    verdict: "7.4 months",
    scope: "Emergency Fund · trailing 90-day spend",
    stats: [
      { k: "Fund balance", v: "$31,500" },
      { k: "Avg monthly spend", v: "$4,260" },
      { k: "6-mo target", v: "Covered" },
    ],
    note: "At the household's trailing 90-day average spend, the Emergency Fund alone covers 7.4 months — above the 6-month target before even counting Household Bills.",
  },
  {
    id: "retire-60",
    question: "Are we on track to retire by 60?",
    verdict: "On track",
    scope: "Retirement + investment · base scenario",
    stats: [
      { k: "Projected at 60", v: "$2.3M" },
      { k: "Monthly need", v: "$7,800" },
      { k: "Safe withdrawal", v: "4.1%" },
    ],
    note: "At current contributions and a base 7% return, combined retirement and investment balances reach roughly $2.3M by age 60 — comfortably above the $7,800/month target at a 4% withdrawal rate.",
  },
];
