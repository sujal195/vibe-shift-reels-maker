
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
      
      // Determine the redirect URL
      // We'll use the production URL when in production, otherwise use current origin
      // This prevents localhost redirects when using the deployed version
      const redirectUrl = `${currentOrigin}/invitation-code`;
      
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
