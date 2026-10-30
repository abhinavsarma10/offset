import { Receipt, Wallet, CircleDollarSign } from "lucide-react";
import { formatCurrency } from "@/services/format";

interface SummaryCardsProps {
  originalAmountCents: number;
  totalRepaidCents: number;
  remainingCents: number;
  transactionCount: number;
}

function SummaryCards({
  originalAmountCents,
  totalRepaidCents,
  remainingCents,
  transactionCount,
}: SummaryCardsProps) {
  const cards = [
    {
      label: "Original cost",
      value: formatCurrency(originalAmountCents),
      detail: "World Cup tickets",
      icon: Wallet,
      color: "text-zinc-300",
    },
    {
      label: "Total repaid",
      value: formatCurrency(totalRepaidCents),
      detail: `${transactionCount} transactions`,
      icon: CircleDollarSign,
      color: "text-emerald-400",
    },
    {
      label: "Still outstanding",
      value: formatCurrency(remainingCents),
      detail: "Remaining balance",
      icon: Receipt,
      color: "text-amber-300",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-white/[0.07] bg-zinc-900/70 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-500">
                {card.label}
              </p>
              <Icon size={17} className={card.color} />
            </div>

            <p className="mt-4 text-2xl font-semibold tracking-tight text-white">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{card.detail}</p>
          </div>
        );
      })}
    </section>
  );
}

export default SummaryCards;
