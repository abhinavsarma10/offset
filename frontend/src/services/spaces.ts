import { supabase } from "@/lib/supabase";

interface CreateSpaceInput {
  name: string;
  initialAmountCents: number;
  currency: string;
}

export interface Space {
  id: string;
  name: string;
  original_amount_cents: number;
  currency: string;
}

export interface SpaceMember {
  user_id: string;
  display_name: string;
  role: "owner" | "member";
}

export async function createSpace(input: CreateSpaceInput) {
  const { data, error } = await supabase.rpc("create_space", {
    space_name: input.name,
    initial_amount_cents: input.initialAmountCents,
    space_currency: input.currency,
  });

  if (error) throw error;

  return data as string;
}

export async function getMySpaces(): Promise<Space[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("You must be signed in.");

  const { data, error } = await supabase
    .from("space_members")
    .select(
      `
      space_id,
      spaces (
        id,
        name,
        original_amount_cents,
        currency
      )
    `,
    )
    .eq("user_id", user.id);

  if (error) throw error;

  return (data ?? []).flatMap((membership) => membership.spaces ?? []);
}

export async function getSpaceMembers(spaceId: string): Promise<SpaceMember[]> {
  const { data: memberships, error: membershipError } = await supabase
    .from("space_members")
    .select("user_id, role")
    .eq("space_id", spaceId);

  if (membershipError) throw membershipError;

  const userIds = (memberships ?? []).map((membership) => membership.user_id);

  if (userIds.length === 0) return [];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, display_name")
    .in("user_id", userIds);

  if (profilesError) throw profilesError;

  return (memberships ?? []).map((membership) => {
    const profile = profiles?.find(
      (item) => item.user_id === membership.user_id,
    );

    return {
      user_id: membership.user_id,
      display_name: profile?.display_name ?? "Offset member",
      role: membership.role as "owner" | "member",
    };
  });
}
