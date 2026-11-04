import { useState, type FormEvent } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSpace } from "@/services/spaces";

interface CreateSpaceProps {
  onCreated: (spaceId: string) => void;
}

export default function CreateSpace({ onCreated }: CreateSpaceProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CAD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
        
      const parsedAmount = Number(amount || 0);

      if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      setError("Please enter a valid, non-negative amount.");
      setLoading(false);
      return;
      }

      const amountCents = Math.round(parsedAmount * 100);

      const spaceId = await createSpace({
        name,
        initialAmountCents: amountCents,
        currency,
      });

      onCreated(spaceId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create your space."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-zinc-950">
            <Wallet size={24} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            offset<span className="text-emerald-400">.</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Set up your shared expense space.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl">
          <h2 className="mb-1 text-xl font-semibold">Create a space</h2>
          <p className="mb-6 text-sm text-zinc-500">
            Give your shared expenses a name and set an optional starting amount.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Space name
              </label>
              <Input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Concert Ticket Reimbursement"
                className="border-white/10 bg-zinc-900 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Original expense amount
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="e.g. 1564.00"
                className="border-white/10 bg-zinc-900 text-white"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Optional. You can leave this at zero.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Currency
              </label>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="h-10 w-full rounded-md border border-white/10 bg-zinc-900 px-3 text-sm text-white"
              >
                <option value="CAD">CAD — Canadian Dollar</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="INR">INR — Indian Rupee</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
            >
              {loading ? "Creating..." : "Create space"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}