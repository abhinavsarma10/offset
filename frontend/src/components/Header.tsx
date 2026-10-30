import { Heart, Wallet } from "lucide-react";

function Header() {
  return (
    <header className="flex items-center justify-between gap-4">
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-400/10">
          <Wallet size={22} strokeWidth={2.5} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            offset<span className="text-emerald-400">.</span>
          </h1>
          <p className="text-xs text-zinc-500">
            Private reimbursement tracker
          </p>
        </div>
      </div>

      {/* Shared account */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 sm:flex">
          <Heart size={14} className="text-emerald-400" />
          <span className="text-xs text-zinc-300">Shared space</span>
        </div>

        {/* Placeholder avatars until authentication is implemented */}
        <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-950 bg-violet-500 text-xs font-bold text-white">
            A
          </div>

          <div className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-950 bg-emerald-500 text-xs font-bold text-zinc-950">
            G
          </div>

          <span className="ml-2 hidden pr-1 text-xs text-zinc-400 sm:block">
            2 members
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;