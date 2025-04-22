
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function ContinueWithGoogle() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      // Get the current origin to use for the redirect
      const currentOrigin = window.location.origin;
      
      // Check if we're in a preview environment (Lovable uses gptengineer.app, lovable.dev, etc.)
      const isPreviewEnvironment = 
        currentOrigin.includes('gptengineer.app') || 
        currentOrigin.includes('lovable.dev') ||
        currentOrigin.includes('localhost');
      
      // Use the current origin as the redirect URL or fallback to the deployed URL
      const redirectUrl = isPreviewEnvironment 
        ? `${currentOrigin}/invitation-code` 
        : `${currentOrigin}/invitation-code`;
      
      console.log("Redirecting to:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error("Google login error:", error);
        toast({ 
          title: "Google login failed", 
          description: error.message || "Please try again later.", 
          variant: "destructive" 
        });
      }
    } catch (e) {
      console.error("Google login exception:", e);
      toast({ 
        title: "Authentication error", 
        description: "Please try again or use email/password login instead.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full flex items-center gap-2 mt-2" 
      onClick={handleGoogleLogin}
      disabled={loading}
    >
      {loading ? (
        <span>Connecting...</span>
      ) : (
        <>
          <LogIn className="h-5 w-5" />
          <span>Continue with Google</span>
        </>
      )}
    </Button>
  );
}
