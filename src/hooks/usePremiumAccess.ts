
import { useState, useEffect } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { checkPremiumAccess, getUserPremiumAccess, UserPremiumAccess } from '@/utils/premiumUtils';

interface PremiumAccessResult {
  canAccess: boolean;
  isLoading: boolean;
  isSubscribed: boolean;
  isTrial: boolean;
  trialEndsAt: Date | null;
  usagesLeft: number | null;
  accessDetails: UserPremiumAccess | null;
}

export const usePremiumAccess = (): PremiumAccessResult => {
  const { user } = useAuthSession();
  const [isLoading, setIsLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [accessDetails, setAccessDetails] = useState<UserPremiumAccess | null>(null);
  
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setCanAccess(false);
        setIsLoading(false);
        setAccessDetails(null);
        return;
      }
      
      try {
        // Fetch the user's premium access status
        const userAccess = await getUserPremiumAccess(user.id);
        setAccessDetails(userAccess);
        
        // Check if they can access premium features
        const access = await checkPremiumAccess(user.id);
        setCanAccess(access);
      } catch (err) {
        console.error('Error checking premium access:', err);
        setCanAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [user]);
  
  // Calculate derived values
  const isSubscribed = !!accessDetails?.is_premium;
  const isTrial = !isSubscribed && !!accessDetails?.trial_end_date && 
    new Date(accessDetails.trial_end_date) > new Date();
  
  const trialEndsAt = accessDetails?.trial_end_date 
    ? new Date(accessDetails.trial_end_date) 
    : null;
  
  // Calculate usages left today
  const usagesLeft = accessDetails && isTrial
    ? Math.max(0, 2 - (accessDetails.daily_usage_count || 0))
    : null;
  
  return {
    canAccess,
    isLoading,
    isSubscribed,
    isTrial,
    trialEndsAt,
    usagesLeft,
    accessDetails
  };
};

export default usePremiumAccess;
