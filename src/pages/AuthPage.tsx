
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const { user, isLoading } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthPage mounted, user:', user, 'isLoading:', isLoading);
    if (!isLoading && user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <span className="text-xl text-white">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-[450px] max-w-full mx-4 space-y-6 border border-zinc-800">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">MEMORIA</h1>
        <p className="text-md text-gray-400 text-center mb-6">Your Life as a Living Timeline</p>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-white">
            {isSignIn ? "Sign In" : "Create Account"}
          </h2>
          
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-3 rounded bg-zinc-800 text-white border border-zinc-700"
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-3 rounded bg-zinc-800 text-white border border-zinc-700"
            />
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400 mb-1">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button 
              variant="link" 
              onClick={() => setIsSignIn(!isSignIn)}
              className="p-0 h-auto text-purple-400"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
