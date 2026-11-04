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
    .select(`
      space_id,
      spaces (
        id,
        name,
        original_amount_cents,
        currency
      )
    `)
    .eq("user_id", user.id);

  if (error) throw error;

  return (data ?? [])
    .flatMap((membership) => membership.spaces ?? []);
}