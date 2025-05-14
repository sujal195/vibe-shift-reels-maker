
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures that all required storage buckets exist
 * This function makes a direct call to the create-buckets edge function
 */
export const ensureStorageBuckets = async (): Promise<boolean> => {
  try {
    console.log("Initializing storage buckets...");
    // Use the hard-coded URL from the client.ts file rather than trying to access protected properties
    const supabaseUrl = "https://gfhcmeicnbccihtyclbj.supabase.co";
    
    // Get the session token for authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token || '';
    
    const response = await fetch(`${supabaseUrl}/functions/v1/create-buckets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
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
