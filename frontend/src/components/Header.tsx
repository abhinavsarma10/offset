import { useEffect, useState } from "react";
import {
  Wallet,
  Users,
  ChevronDown,
  UserPlus,
  Copy,
  Check,
  X,
} from "lucide-react";

import { getSpaceMembers, type SpaceMember } from "@/services/spaces";
import { createInvitation } from "@/services/invitations";

interface HeaderProps {
  spaceId: string;
}

function Header({ spaceId }: HeaderProps) {
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersOpen, setMembersOpen] = useState(false);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [copied, setCopied] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMembers() {
      setLoadingMembers(true);
      setError("");

      try {
        const result = await getSpaceMembers(spaceId);

        if (!cancelled) {
          setMembers(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load members.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingMembers(false);
        }
      }
    }

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, [spaceId]);

  async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setInviteLoading(true);
    setInviteError("");
    setInvitationUrl("");
    setCopied(false);

    try {
      const invitation = await createInvitation(spaceId, inviteEmail.trim());

      const url = new URL("/", window.location.origin);
      url.searchParams.set("token", invitation.invitation_token);

      const link = url.toString();

      setInvitationUrl(link);

      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
      } catch {
        // The link remains visible so it can be copied manually.
      }
    } catch (err) {
      setInviteError(
        err instanceof Error ? err.message : "Unable to generate invitation.",
      );
    } finally {
      setInviteLoading(false);
    }
  }

  function closeInvite() {
    setInviteOpen(false);
    setInviteEmail("");
    setInvitationUrl("");
    setInviteError("");
    setCopied(false);
  }

  return (
    <header className="flex min-w-0 flex-1 items-center justify-between gap-4">
      {/* Branding */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-400/10">
          <Wallet size={22} strokeWidth={2.5} />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            offset<span className="text-emerald-400">.</span>
          </h1>
          <p className="hidden text-xs text-zinc-500 sm:block">
            Personal reimbursement tracker
          </p>
        </div>
      </div>

      {/* Members and invitations */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Members dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMembersOpen((open) => !open)}
            aria-expanded={membersOpen}
            aria-label="View space members"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-zinc-300 transition hover:bg-white/[0.07]"
          >
            <Users size={16} className="text-violet-400" />
            <span className="text-xs">
              {loadingMembers ? "..." : `${members.length} members`}
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${
                membersOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {membersOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-white/10 bg-zinc-900 p-3 shadow-2xl">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Space members
              </p>

              {loadingMembers ? (
                <p className="px-2 py-3 text-sm text-zinc-400">
                  Loading members...
                </p>
              ) : error ? (
                <p className="px-2 py-3 text-sm text-red-400">{error}</p>
              ) : members.length === 0 ? (
                <p className="px-2 py-3 text-sm text-zinc-400">
                  No members found.
                </p>
              ) : (
                <div className="space-y-1">
                  {members.map((member) => (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.04]"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-400/10 text-xs font-semibold text-violet-400">
                          {member.display_name.charAt(0).toUpperCase()}
                        </div>

                        <span className="truncate text-sm text-zinc-200">
                          {member.display_name}
                        </span>
                      </div>

                      <span className="shrink-0 text-[10px] capitalize text-violet-400">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Invite button */}
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-400/20"
        >
          <UserPlus size={15} />
          <span>Invite</span>
        </button>
      </div>

      {/* Invitation dialog */}
      {inviteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Invite someone
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Give someone access to this shared space.
                </p>
              </div>

              <button
                type="button"
                onClick={closeInvite}
                aria-label="Close invitation dialog"
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label
                  htmlFor="invite-email"
                  className="mb-2 block text-sm text-zinc-300"
                >
                  Email address
                </label>

                <input
                  id="invite-email"
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="person@example.com"
                  disabled={inviteLoading || !!invitationUrl}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50"
                />
              </div>

              {inviteError && (
                <p className="text-sm text-red-400">{inviteError}</p>
              )}

              {invitationUrl && (
                <div className="space-y-3 rounded-xl border border-violet-400/20 bg-violet-400/5 p-3">
                  <p className="text-sm text-violet-300">
                    Invitation link generated.
                  </p>

                  <input
                    readOnly
                    value={invitationUrl}
                    onFocus={(event) => event.target.select()}
                    className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none"
                  />

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(invitationUrl);
                        setCopied(true);
                      } catch {
                        setInviteError(
                          "Unable to copy automatically. Select and copy the link above.",
                        );
                      }
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-violet-300"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy invitation link"}
                  </button>

                  <p className="text-xs text-zinc-500">
                    This invitation expires after 7 days and can only be
                    accepted by the invited email address.
                  </p>
                </div>
              )}

              {!invitationUrl && (
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-400 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {inviteLoading
                    ? "Generating link..."
                    : "Generate invitation link"}
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
