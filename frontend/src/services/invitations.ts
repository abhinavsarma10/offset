import { supabase } from "@/lib/supabase";

interface CreateInvitationResponse {
  invitation_token: string;
  invitation_expires_at: string;
}

export async function createInvitation(
  spaceId: string,
  email: string,
): Promise<CreateInvitationResponse> {
  const { data, error } = await supabase.rpc("create_space_invitation", {
    target_space_id: spaceId,
    recipient_email: email,
  });

  if (error) throw error;

  const invitation = data?.[0] as CreateInvitationResponse | undefined;

  if (!invitation) {
    throw new Error("Unable to generate invitation.");
  }

  return invitation;
}

export async function acceptInvitation(token: string): Promise<string> {
  const { data, error } = await supabase.rpc("accept_space_invitation", {
    invitation_token: token,
  });

  if (error) throw error;

  return data as string;
}
