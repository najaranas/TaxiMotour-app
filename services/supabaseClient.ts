import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/clerk-expo";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseClient(
  session?: ReturnType<typeof useSession>["session"]
) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase URL or Anon Key is not defined in environment variables."
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    async accessToken() {
      return session?.getToken() ?? null;
    },
  });
}
