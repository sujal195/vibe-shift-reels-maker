
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Signed in successfully!" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Account created successfully!" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-[450px] max-w-full mx-4 space-y-6 border border-zinc-800">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">MEMORIA</h1>
        <p className="text-md text-gray-400 text-center mb-6">Your Life as a Living Timeline</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-white">
            {isSignIn ? "Sign In" : "Create Account"}
          </h2>
          
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full p-3 rounded bg-zinc-800 text-white border border-zinc-700"
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full p-3 rounded bg-zinc-800 text-white border border-zinc-700"
          />
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? "Loading..." : (isSignIn ? "Sign In" : "Sign Up")}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400 mb-1">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button 
              type="button"
              variant="link" 
              onClick={() => setIsSignIn(!isSignIn)}
              className="p-0 h-auto text-purple-400"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
