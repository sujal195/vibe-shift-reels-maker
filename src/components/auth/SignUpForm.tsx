
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { User, Mail, Lock } from "lucide-react";

type SignUpValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
};

export default function SignUpForm() {
  const navigate = useNavigate();
  const form = useForm<SignUpValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      agreeToTerms: false
    }
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: SignUpValues) {
    if (!data.agreeToTerms) {
      toast({
        title: "Terms required",
        description: "You must agree to the terms and conditions.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            display_name: `${data.firstName} ${data.lastName}`
          }
        }
      });

      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      // Notify admin via edge function
      try {
        await fetch(`${window.location.origin.replace('localhost:3000', 'gfhcmeicnbccihtyclbj.supabase.co')}/functions/v1/notify-admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'signup',
            user: `${data.firstName} ${data.lastName}`,
            email: data.email
          }),
        });
      } catch (e) {
        console.error('Failed to notify admin:', e);
      }

      // Automatically log in user after signup
      if (signUpData.session) {
        toast({ title: "Welcome to MEMORIA!", description: "Your account has been created successfully." });
        navigate('/profile-setup'); // Direct to profile setup
      } else {
        toast({ title: "Sign up successful!", description: "Please check your email to verify your account." });
        navigate('/auth'); 
      }
    } catch (e) {
      console.error('Unexpected error during signup:', e);
      toast({ 
        title: "Sign up failed", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      required 
                      disabled={loading} 
                      placeholder="John" 
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      required 
                      disabled={loading} 
                      placeholder="Doe" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="pl-9" 
                    type="password" 
                    minLength={6} 
                    required 
                    disabled={loading} 
                    placeholder="Password (minimum 6 characters)" 
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
          name="agreeToTerms"
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
                  I agree to the Terms and Conditions and Privacy Policy
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </Form>
  );
}
