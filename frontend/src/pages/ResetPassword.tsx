import { useState, type FormEvent } from "react";
import { Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setMessage("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setSuccess(true);
      setMessage("Your password has been updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update your password.",
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
            Choose a new password for your account.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl">
          <h2 className="text-xl font-semibold">Set new password</h2>

          <p className="mt-1 mb-6 text-sm text-zinc-500">
            Choose a password with at least 8 characters.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                New password
              </label>
              <Input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="border-white/10 bg-zinc-900 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Confirm new password
              </label>
              <Input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                className="border-white/10 bg-zinc-900 text-white"
              />
            </div>

            {message && (
              <p
                className={`text-sm ${
                  success ? "text-emerald-400" : "text-red-400"
                }`}
                role="status"
              >
                {message}
              </p>
            )}

            {success ? (
              <Button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="w-full bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
              >
                Continue to Offset
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
              >
                {loading ? "Updating..." : "Update password"}
              </Button>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
