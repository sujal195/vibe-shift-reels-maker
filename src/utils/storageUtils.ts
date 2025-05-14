
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures that all required storage buckets exist
 * This function makes a direct call to the create-buckets edge function
 */
export const ensureStorageBuckets = async (): Promise<boolean> => {
  try {
    console.log("Initializing storage buckets...");
    // Use the function URL directly instead of accessing protected properties
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/create-buckets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from create-buckets:", errorData);
      return false;
    }
    
    const result = await response.json();
    console.log("Storage buckets initialized:", result);
    return true;
  } catch (err) {
    console.error("Failed to initialize storage:", err);
    return false;
  }
};
