export type AccountType = "checking" | "savings" | "investment" | "retirement";

export type Transaction = {
  id: string;
  accountId: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
};

export type Account = {
  id: string;
  name: string;
  institution: string;
  type: AccountType;
  balance: number;
  monthlyContribution: number;
  annualReturn: number;
  owner: "Tom" | "Maya" | "Joint";
};

export const typeLabels: Record<AccountType, string> = {
  checking: "Checking",
  savings: "Savings",
  investment: "Investments",
  retirement: "Retirement",
};

export const accounts: Account[] = [
  {
    id: "chk-1",
    name: "Everyday Checking",
    institution: "Harbor Bank",
    type: "checking",
    balance: 8420,
    monthlyContribution: 0,
    annualReturn: 0.001,
    owner: "Joint",
  },
  {
    id: "chk-2",
    name: "Household Bills",
    institution: "Harbor Bank",
    type: "checking",
    balance: 3150,
    monthlyContribution: 0,
    annualReturn: 0.001,
    owner: "Joint",
  },
  {
    id: "sav-1",
    name: "Emergency Fund",
    institution: "Meridian Savings",
    type: "savings",
    balance: 31500,
    monthlyContribution: 400,
    annualReturn: 0.042,
    owner: "Joint",
  },
  {
    id: "sav-2",
    name: "Kids' Education",
    institution: "Meridian Savings",
    type: "savings",
    balance: 18900,
    monthlyContribution: 350,
    annualReturn: 0.05,
    owner: "Joint",
  },
  {
    id: "inv-1",
    name: "Index Brokerage",
    institution: "Northline Invest",
    type: "investment",
    balance: 142300,
    monthlyContribution: 1500,
    annualReturn: 0.072,
    owner: "Joint",
  },
  {
    id: "inv-2",
    name: "Growth Portfolio",
    institution: "Northline Invest",
    type: "investment",
    balance: 46800,
    monthlyContribution: 500,
    annualReturn: 0.085,
    owner: "Maya",
  },
  {
    id: "ret-1",
    name: "401(k) — Tom",
    institution: "Vantage Retirement",
    type: "retirement",
    balance: 218400,
    monthlyContribution: 1900,
    annualReturn: 0.068,
    owner: "Tom",
  },
  {
    id: "ret-2",
    name: "Roth IRA — Maya",
    institution: "Vantage Retirement",
    type: "retirement",
    balance: 97250,
    monthlyContribution: 583,
    annualReturn: 0.07,
    owner: "Maya",
  },
];

const merchants: Array<[string, string, number]> = [
  ["Ferry Building Market", "Groceries", -142.18],
  ["Blue Bottle Coffee", "Dining", -18.5],
  ["Payroll — Northwind", "Income", 5240.0],
  ["Pacific Gas & Electric", "Utilities", -186.44],
  ["Automatic Transfer", "Transfer", -1500.0],
  ["Kaiser Premium", "Health", -412.0],
  ["Shell Station", "Transport", -64.21],
  ["Rent — Ardmore", "Housing", -3200.0],
  ["Dividend Reinvest", "Investment", 318.72],
  ["Alpine Outfitters", "Shopping", -228.9],
  ["City Preschool", "Childcare", -940.0],
  ["Interest Paid", "Income", 96.34],
  ["Sunset Pharmacy", "Health", -37.15],
  ["Trailhead Bikes", "Shopping", -519.0],
  ["Contribution — Employer Match", "Income", 712.5],
];

function seeded(i: number) {
  return (Math.sin(i * 12.9898) * 43758.5453) % 1;
}

export const transactions: Transaction[] = Array.from({ length: 64 }, (_, i) => {
  const account = accounts[Math.floor(Math.abs(seeded(i + 3)) * accounts.length)]!;
  const [merchant, category, amount] = merchants[i % merchants.length]!;
  const day = new Date(2026, 8, 7);
  day.setDate(day.getDate() - Math.floor(i * 1.4));
  const jitter = 1 + Math.abs(seeded(i + 11)) * 0.35;
  return {
    id: `tx-${i}`,
    accountId: account.id,
    date: day.toISOString().slice(0, 10),
    merchant,
    category,
    amount: Math.round(amount * jitter * 100) / 100,
  };
});

export type ProjectionPoint = {
  year: number;
  label: string;
  total: number;
  checking: number;
  savings: number;
  investment: number;
  retirement: number;
};

export function projectWealth(
  selected: Account[],
  years: number,
  returnAdjustment = 0,
): ProjectionPoint[] {
  const startYear = new Date().getFullYear();
  const balances = new Map(selected.map((a) => [a.id, a.balance]));
  const points: ProjectionPoint[] = [];

  for (let y = 0; y <= years; y++) {
    const buckets = { checking: 0, savings: 0, investment: 0, retirement: 0 };
    for (const a of selected) buckets[a.type] += balances.get(a.id) ?? 0;
    const total = buckets.checking + buckets.savings + buckets.investment + buckets.retirement;
    points.push({ year: startYear + y, label: `${startYear + y}`, total, ...buckets });

    for (const a of selected) {
      const rate = Math.max(0, a.annualReturn + returnAdjustment);
      let bal = balances.get(a.id) ?? 0;
      for (let m = 0; m < 12; m++) bal = bal * (1 + rate / 12) + a.monthlyContribution;
      balances.set(a.id, bal);
    }
  }
  return points;
}

export const currency = (n: number, digits = 0) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const compact = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `$${Math.round(n / 1_000)}K`
      : `$${Math.round(n)}`;
