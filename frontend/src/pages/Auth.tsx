import { useState, type FormEvent } from "react";
import { Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Auth() {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setMessage("Account created. Check your email if confirmation is required.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
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
            A simpler way to keep shared expenses in balance.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl">
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-zinc-900 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setMessage("");
              }}
              className={`rounded-lg py-2 text-sm font-medium ${
                mode === "signin"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500"
              }`}
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setMessage("");
              }}
              className={`rounded-lg py-2 text-sm font-medium ${
                mode === "signup"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500"
              }`}
            >
              Create account
            </button>
          </div>

          <h2 className="text-xl font-semibold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>

          <p className="mt-1 mb-6 text-sm text-zinc-500">
            {mode === "signin"
              ? "Sign in to access your shared spaces."
              : "Get started with your first shared space."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Email address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="border-white/10 bg-zinc-900 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Password
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

            {message && (
              <p className="text-sm text-amber-400" role="status">
                {message}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Private spaces. Shared visibility. Your data stays yours.
        </p>
      </div>
    </main>
  );
}