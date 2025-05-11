
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  previousUsers: Array<{email: string, lastSignIn: Date}>;
  setPreviousUsers: React.Dispatch<React.SetStateAction<Array<{email: string, lastSignIn: Date}>>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Load previous users from localStorage
const loadPreviousUsers = (): Array<{email: string, lastSignIn: Date}> => {
  try {
    const stored = localStorage.getItem('memoria-previous-users');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((user: any) => ({
        ...user,
        lastSignIn: new Date(user.lastSignIn)
      }));
    }
  } catch (error) {
    console.error('Failed to parse previous users from localStorage:', error);
  }
  return [];
};

// Save previous users to localStorage
const savePreviousUsers = (users: Array<{email: string, lastSignIn: Date}>) => {
  try {
    localStorage.setItem('memoria-previous-users', JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save previous users to localStorage:', error);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previousUsers, setPreviousUsers] = useState<Array<{email: string, lastSignIn: Date}>>(loadPreviousUsers());

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Track previous users for quick sign-in
      if (session?.user?.email && event === 'SIGNED_IN') {
        const email = session.user.email;
        setPreviousUsers(prev => {
          const filteredUsers = prev.filter(u => u.email !== email);
          const updatedUsers = [
            { email, lastSignIn: new Date() },
            ...filteredUsers
          ].slice(0, 5); // Keep only last 5 users
          
          savePreviousUsers(updatedUsers);
          return updatedUsers;
        });
      }

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
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signOut,
      previousUsers,
      setPreviousUsers 
    }}>
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
