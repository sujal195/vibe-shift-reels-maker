
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";

type SignInValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function SignInForm() {
  const navigate = useNavigate();
  const { previousUsers } = useAuthSession();
  const form = useForm<SignInValues>({ 
    defaultValues: { 
      email: "", 
      password: "", 
      rememberMe: false 
    } 
  });
  const [loading, setLoading] = useState(false);
  const [showPreviousUsers, setShowPreviousUsers] = useState(!!previousUsers.length);

  async function onSubmit(data: SignInValues) {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      // Notify admin via edge function
      try {
        const apiUrl = `${window.location.origin.includes('localhost') 
          ? 'https://gfhcmeicnbccihtyclbj.supabase.co' 
          : window.location.origin}/functions/v1/notify-admin`;
          
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'signin',
            email: data.email
          }),
        });
      } catch (e) {
        console.error('Failed to notify admin:', e);
      }

      toast({ title: "Login successful!" });
      navigate('/home'); // Directly to home instead of invitation code
    } catch (e) {
      console.error('Unexpected error during login:', e);
      toast({ 
        title: "Login failed", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickSignIn(email: string) {
    form.setValue("email", email);
    setShowPreviousUsers(false); // Hide the previous users list
    toast({ description: `Email filled: ${email}. Please enter your password.` });
  }

  return (
    <>
      {showPreviousUsers && previousUsers.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm text-muted-foreground mb-2">Quick Access</h3>
          <div className="space-y-2">
            {previousUsers.map((user, index) => (
              <button
                key={index}
                className="w-full flex items-center p-2 gap-3 rounded-md hover:bg-secondary transition-colors"
                onClick={() => handleQuickSignIn(user.email)}
              >
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Last sign in: {user.lastSignIn.toLocaleDateString()}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-2 text-center">
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setShowPreviousUsers(false)}
            >
              Use different account
            </Button>
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      type="email" 
                      required 
                      disabled={loading} 
                      placeholder="you@example.com" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  <Link 
                    to="#" 
                    className="text-xs text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({ 
                        title: "Password Reset", 
                        description: "This feature will be available soon." 
                      });
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      type="password" 
                      required 
                      disabled={loading} 
                      placeholder="Enter your password" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
                <div className="leading-none">
                  <FormLabel className="text-sm text-muted-foreground">
                    Remember me for 30 days
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>
    </>
  );
}
