
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  feature_id?: string;
}

export interface UserPremiumAccess {
  is_premium: boolean;
  trial_start_date: string | null;
  trial_end_date: string | null;
  premium_start_date: string | null;
  premium_end_date: string | null;
  daily_usage_count: number;
  last_usage_date: string | null;
}

/**
 * Fetches all premium features
 */
export const fetchPremiumFeatures = async (): Promise<PremiumFeature[]> => {
  const { data, error } = await supabase
    .from('premium_features')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching premium features:", error);
    return [];
  }
  
  return data || [];
};

/**
 * Fetches smart notifications
 */
export const fetchSmartNotifications = async (): Promise<SmartNotification[]> => {
  const { data, error } = await supabase
    .from('smart_notifications')
    .select('*')
    .eq('active', true);
  
  if (error) {
    console.error("Error fetching smart notifications:", error);
    return [];
  }
  
  return data || [];
};

/**
 * Fetches user premium access status
 */
export const getUserPremiumAccess = async (userId: string): Promise<UserPremiumAccess | null> => {
  const { data, error } = await supabase
    .from('user_premium_access')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error("Error fetching user premium access:", error);
    return null;
  }
  
  return data;
};

/**
 * Records that a notification was shown to a user
 */
export const recordNotificationShown = async (userId: string, notificationId: string) => {
  const { error } = await supabase
    .from('user_notifications')
    .insert({
      user_id: userId,
      notification_id: notificationId,
      shown_at: new Date().toISOString(),
      dismissed: false
    });
  
  if (error) {
    console.error("Error recording notification:", error);
  }
};

/**
 * Records that a notification was dismissed by a user
 */
export const dismissNotification = async (notificationId: string) => {
  const { error } = await supabase
    .from('user_notifications')
    .update({ dismissed: true })
    .eq('id', notificationId);
  
  if (error) {
    console.error("Error dismissing notification:", error);
  }
};

/**
 * Checks if a user can access premium features
 */
export const checkPremiumAccess = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Use the RPC function we created in the migration
    const { data, error } = await supabase.rpc('can_access_premium', { user_id: userId });
    
    if (error) {
      console.error("Error checking premium access:", error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error("Exception checking premium access:", err);
    return false;
  }
};

/**
 * Tracks a premium feature usage
 */
export const trackPremiumUsage = async (userId: string): Promise<void> => {
  if (!userId) return;
  
  try {
    // Use the RPC function we created in the migration
    const { error } = await supabase.rpc('track_premium_usage', { user_id: userId });
    
    if (error) {
      console.error("Error tracking premium usage:", error);
    }
  } catch (err) {
    console.error("Exception tracking premium usage:", err);
  }
};

/**
 * Handles premium feature access attempt. Shows a prompt if user cannot access.
 */
export const tryAccessPremiumFeature = async (userId: string, featureName: string): Promise<boolean> => {
  const hasAccess = await checkPremiumAccess(userId);
  
  if (!hasAccess) {
    toast({
      title: "Premium Feature",
      description: `${featureName} is a premium feature. New users can use premium features twice a day for 3 days, or upgrade to Premium for unlimited access.`,
      variant: "default",
    });
    return false;
  }
  
  // Track premium feature usage
  await trackPremiumUsage(userId);
  return true;
};
