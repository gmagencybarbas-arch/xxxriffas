/**
 * Mock Supabase client — substitua por:
 * import { createClient } from '@supabase/supabase-js'
 * quando conectar ao projeto real.
 */
import type { Raffle } from "./types";
import { getRaffleBySlug as localGet, raffles } from "./data";

export const supabase = {
  from(table: string) {
    return {
      async select() {
        if (table === "raffles") {
          return { data: raffles as Raffle[], error: null };
        }
        return { data: null, error: new Error("unknown table") };
      },
    };
  },
};

export async function fetchRaffles(): Promise<Raffle[]> {
  const { data } = await supabase.from("raffles").select();
  return (data ?? []) as Raffle[];
}

export async function fetchRaffleBySlug(slug: string): Promise<Raffle | null> {
  const row = localGet(slug);
  return row ?? null;
}
