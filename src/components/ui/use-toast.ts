
// Re-export from our hooks for backwards compatibility
import { useToast, toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Helper function to ensure storage buckets are initialized
export async function ensureStorageBuckets() {
  try {
    // Call the edge function to create storage buckets if they don't exist
    const { error } = await supabase.functions.invoke('create-buckets');
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to initialize storage:", err);
    return false;
  }
}

export { useToast, toast };
