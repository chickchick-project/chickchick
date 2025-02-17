import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

interface GraphQLResponse<T> {
  data: T;
  errors?: { message: string }[];
}

export const fetchSupabase = async <T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> => {
  const response = await fetch(`${supabaseUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    console.error("GraphQL Error:", result.errors);
    throw new Error(result.errors.map((err) => err.message).join(", "));
  }

  return result.data;
};
