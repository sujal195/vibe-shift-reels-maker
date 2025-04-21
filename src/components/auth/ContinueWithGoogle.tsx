
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function ContinueWithGoogle() {
  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/",
      },
    });
  }

  return (
    <Button type="button" variant="outline" className="w-full flex items-center gap-2 mt-2" onClick={handleGoogleLogin}>
      <LogIn className="h-5 w-5" />
      <span>Continue with Google</span>
    </Button>
  );
}
