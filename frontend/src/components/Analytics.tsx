import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/services/format";

interface AnalyticsProps {
  transactions: Transaction[];
  totalRepaidCents: number;
}

const chartColors = [
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#fbbf24",
  "#f87171",
  "#22d3ee",
  "#a1a1aa",
];

function Analytics({
  transactions,
  totalRepaidCents,
}: AnalyticsProps) {
  // Group transactions by date and calculate cumulative repayments.
  const dailyTotals = transactions.reduce<Record<string, number>>(
    (totals, transaction) => {
      totals[transaction.transactionDate] =
        (totals[transaction.transactionDate] ?? 0) +
        transaction.amountCents;

      return totals;
    },
    {}
  );

  const sortedDates = Object.keys(dailyTotals).sort();

  let runningTotal = 0;

  const repaymentData = sortedDates.map((date) => {
    runningTotal += dailyTotals[date];

    return {
      date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString("en-CA", {
        month: "short",
        day: "numeric",
      }),
      total: runningTotal / 100,
    };
  });

  // Calculate totals for each transaction category.
  const categoryTotals = transactions.reduce<Record<string, number>>(
    (totals, transaction) => {
      totals[transaction.category] =
        (totals[transaction.category] ?? 0) +
        transaction.amountCents;

      return totals;
    },
    {}
  );

  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value: value / 100,
    }))
    .sort((a, b) => b.value - a.value);

  const averageTransaction =
    transactions.length > 0
      ? totalRepaidCents / transactions.length
      : 0;

  const largestTransaction = transactions.reduce(
    (largest, transaction) =>
      Math.max(largest, transaction.amountCents),
    0
  );

  const tooltipStyle = {
    backgroundColor: "#18181b",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "12px",
  };

  return (
    <section className="mt-10 space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Analytics
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Repayment activity and transaction breakdown
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <p className="text-sm text-zinc-500">Total transactions</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {transactions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <p className="text-sm text-zinc-500">Average transaction</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {formatCurrency(averageTransaction)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <p className="text-sm text-zinc-500">Largest transaction</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {formatCurrency(largestTransaction)}
          </p>
        </div>
      </div>

      {/* Repayment history */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 sm:p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-white">
            Repayment history
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Cumulative amount reimbursed over time
          </p>
        </div>

        {repaymentData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
            No repayment data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={repaymentData}>
              <defs>
                <linearGradient id="repaymentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                stroke="#71717a"
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                stroke="#71717a"
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />

              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [
                  formatCurrency(Number(value) * 100),
                  "Repaid",
                ]}
                labelStyle={{ color: "#a1a1aa" }}
              />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#repaymentGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 sm:p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-white">
            Category breakdown
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Distribution of recorded transactions
          </p>
        </div>

        {categoryData.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-zinc-500">
            No category data available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [
                      formatCurrency(Number(value) * 100),
                      "Amount",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                    />
                    <span className="truncate text-sm text-zinc-300">
                      {category.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-medium text-white">
                    {formatCurrency(category.value * 100)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Analytics;