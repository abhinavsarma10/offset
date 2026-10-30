import { ArrowDownRight, CheckCircle2, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/services/format";

interface ProgressCardProps {
  originalAmountCents: number;
  totalRepaidCents: number;
  remainingCents: number;
  progress: number;
}

function ProgressCard({
  originalAmountCents,
  totalRepaidCents,
  remainingCents,
  progress,
}: ProgressCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-300/15 bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-900 p-6 sm:p-9">
      <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-400/10 p-2 text-emerald-300">
              <TrendingUp size={17} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/60">
              Remaining balance
            </span>
          </div>
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-emerald-200">
            CAD $
          </span>
        </div>

        <div className="mt-7">
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {formatCurrency(remainingCents)}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Still to go until we're all settled.
          </p>
        </div>

        <div className="mt-9">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-semibold text-emerald-300">
                {progress.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-zinc-400">of the total repaid</p>
            </div>
            <p className="text-right text-xs text-zinc-400">
              {formatCurrency(totalRepaidCents)}
              <span className="text-zinc-600"> / </span>
              {formatCurrency(originalAmountCents)}
            </p>
          </div>

          <div
            className="h-3 overflow-hidden rounded-full bg-black/30"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Repayment progress"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <div className="flex items-center gap-2 text-sm text-emerald-100/70">
            <CheckCircle2 size={16} className="text-emerald-400" />
            Every little bit counts.
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <ArrowDownRight size={14} />
            Getting closer
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgressCard;
