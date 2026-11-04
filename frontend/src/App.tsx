import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import CreateSpace from "./pages/CreateSpace";

import { useAuth } from "./contexts/AuthContext";
import { getMySpaces, type Space } from "./services/spaces";
import { acceptInvitation } from "./services/invitations";

function App() {
  const { user, loading: authLoading } = useAuth();

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [error, setError] = useState("");

  const invitationToken = new URLSearchParams(window.location.search).get(
    "token",
  );

  useEffect(() => {
    if (!user) {
      setSpaces([]);
      setSelectedSpace(null);
      setLoadingSpaces(false);
      setError("");
      return;
    }

    let cancelled = false;

    async function loadSpaces() {
      setLoadingSpaces(true);
      setError("");

      try {
        let acceptedSpaceId: string | null = null;

        // Accept an invitation before loading the user's spaces.
        if (invitationToken) {
          acceptedSpaceId = await acceptInvitation(invitationToken);

          // Remove the invitation token from the browser URL.
          window.history.replaceState({}, "", window.location.pathname);
        }

        const userSpaces = await getMySpaces();

        if (cancelled) return;

        setSpaces(userSpaces);

        // Open the newly joined space, or the first available space.
        const targetSpace =
          userSpaces.find((space) => space.id === acceptedSpaceId) ??
          userSpaces[0] ??
          null;

        setSelectedSpace(targetSpace);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load your spaces.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSpaces(false);
        }
      }
    }

    loadSpaces();

    return () => {
      cancelled = true;
    };
  }, [user, invitationToken]);

  if (authLoading || loadingSpaces) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        Loading Offset...
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4 text-center">
        <p className="text-red-400">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5"
        >
          Try again
        </button>
      </div>
    );
  }

  if (spaces.length === 0) {
    return (
      <CreateSpace
        onCreated={async () => {
          try {
            const updatedSpaces = await getMySpaces();

            setSpaces(updatedSpaces);
            setSelectedSpace(updatedSpaces[0] ?? null);
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Unable to load your new space.",
            );
          }
        }}
      />
    );
  }

  if (!selectedSpace) {
    return null;
  }

  return <Dashboard space={selectedSpace} />;
}

export default App;
