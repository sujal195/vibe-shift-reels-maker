
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InviteSignupForm from "@/components/auth/InviteSignupForm";
import SignInForm from "@/components/auth/SignInForm";
import ContinueWithGoogle from "@/components/auth/ContinueWithGoogle";
import { useAuthSession } from "@/hooks/useAuthSession";

const AuthPage = () => {
  const { user, isLoading } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-xl text-primary">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      <div className="bg-card p-6 rounded-lg shadow-lg w-[350px] space-y-6">
        <h1 className="text-2xl font-bold text-center mb-2">MEMORIA</h1>
        <p className="text-md text-muted-foreground text-center mb-3">Invitation Only Beta</p>
        <InviteSignupForm />
        <div className="text-sm text-center text-muted-foreground">or</div>
        <SignInForm />
        <div className="text-xs uppercase text-muted-foreground text-center">Social login</div>
        <ContinueWithGoogle />
      </div>
    </div>
  );
};

export default AuthPage;
