
import { supabase } from "@/integrations/supabase/client";

/**
 * A utility function that safely runs queries against tables that might not be in the TypeScript definitions yet
 */
export const safeQuery = async (table: string) => {
  // @ts-ignore - This is a workaround for tables not in TS definitions yet
  return supabase.from(table);
};
