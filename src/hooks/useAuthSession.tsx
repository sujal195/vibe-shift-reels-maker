
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Send notifications on auth events if user is logged in
      if (session?.user && (event === 'SIGNED_IN' || event === 'SIGNED_OUT')) {
        try {
          await fetch(`${window.location.origin.includes('localhost') 
            ? 'https://gfhcmeicnbccihtyclbj.supabase.co' 
            : window.location.origin}/functions/v1/notify-admin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: event === 'SIGNED_IN' ? 'signin' : 'signout',
              email: session.user.email
            }),
          });
        } catch (e) {
          console.error('Failed to notify admin:', e);
        }
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    try {
      // Notify admin before signing out if we have session data
      if (session?.user?.email) {
        try {
          await fetch(`${window.location.origin.includes('localhost') 
            ? 'https://gfhcmeicnbccihtyclbj.supabase.co' 
            : window.location.origin}/functions/v1/notify-admin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'signout',
              email: session.user.email
            }),
          });
        } catch (e) {
          console.error('Failed to notify admin:', e);
        }
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "An error occurred while signing out.",
        variant: "destructive"
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthSession must be used within an AuthProvider");
  }
  return context;
}
