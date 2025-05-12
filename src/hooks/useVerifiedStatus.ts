
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useVerifiedStatus(userId?: string) {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function checkVerificationStatus() {
      setLoading(true);
      try {
        // Check if user is Sujal Giri (hardcoded for now)
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, invitation_code_created_at')
          .eq('id', userId)
          .single();
        
        if (userError) throw userError;

        // Check for Sujal Giri's account
        const { data: sujalData } = await supabase
          .from('profiles')
          .select()
          .or(`username.eq.sujalgiri,id.eq.e938a337-2234-47ee-b101-451594c14534`)
          .single();

        // Grant verification if user is Sujal
        if (sujalData && sujalData.id === userId) {
          setIsVerified(true);
          setLoading(false);
          return;
        }

        // Count successful invitations
        const { count, error: countError } = await supabase
          .from('invitation_codes')
          .select('*', { count: 'exact', head: false })
          .eq('created_by', userId)
          .not('redeemed_by', 'is', null);
        
        if (countError) throw countError;
        
        // User is verified if they have 10+ successful invitations
        setIsVerified(count !== null && count >= 10);
      } catch (error) {
        console.error("Error checking verification status:", error);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    }

    checkVerificationStatus();
  }, [userId]);

  return { isVerified, loading };
}
