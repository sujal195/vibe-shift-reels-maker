
import { supabase } from "@/integrations/supabase/client";

/**
 * A utility function that safely runs queries against tables that might not be in the TypeScript definitions yet
 */
export const safeQuery = async (table: string) => {
  // @ts-ignore - This is a workaround for tables not in TS definitions yet
  return supabase.from(table);
};

/**
 * Safely fetch posts for a user
 * @param userId The user ID to fetch posts for
 * @returns A properly formatted array of posts
 */
export const fetchUserPosts = async (userId: string) => {
  try {
    const postsApi = await safeQuery('posts');
    const { data, error } = await postsApi
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Error in posts fetch:", err);
    return [];
  }
};

/**
 * Get user profile data
 * @param userId The user ID to fetch profile for
 */
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error in profile fetch:", err);
    return null;
  }
};

/**
 * Get the post count for a user
 * @param userId The user ID to count posts for
 */
export const countUserPosts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('count_user_posts', { user_id: userId });
    
    if (error) {
      console.error("Error counting posts:", error);
      return 0;
    }
    
    return data?.[0]?.count || 0;
  } catch (err) {
    console.error("Error counting posts:", err);
    return 0;
  }
};
