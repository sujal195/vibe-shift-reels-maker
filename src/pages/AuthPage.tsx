
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "@/components/auth/SignUpForm";
import SignInForm from "@/components/auth/SignInForm";
import ContinueWithGoogle from "@/components/auth/ContinueWithGoogle";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const { user, isLoading } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/home");
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
        <p className="text-md text-muted-foreground text-center mb-6">Your Life as a Living Timeline</p>
        
        {isSignIn ? (
          <>
            <h2 className="text-xl font-semibold text-center text-white">Sign In</h2>
            <SignInForm />
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground mb-1">Don't have an account?</p>
              <Button 
                variant="link" 
                onClick={() => setIsSignIn(false)}
                className="p-0 h-auto text-primary"
              >
                Sign up
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-center text-white">Create an Account</h2>
            <SignUpForm />
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground mb-1">Already have an account?</p>
              <Button 
                variant="link" 
                onClick={() => setIsSignIn(true)}
                className="p-0 h-auto text-primary"
              >
                Sign in
              </Button>
            </div>
          </>
        )}
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-muted-foreground">or continue with</span>
          </div>
        </div>
        
        <ContinueWithGoogle />
      </div>
    </div>
  );
};

export default AuthPage;
