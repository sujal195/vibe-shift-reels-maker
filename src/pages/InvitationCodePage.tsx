
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";

type InvitationCodeValues = {
  code: string;
};

const InvitationCodePage = () => {
  const { user, isLoading } = useAuthSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  const form = useForm<InvitationCodeValues>({
    defaultValues: { code: "" }
  });

  useEffect(() => {
    async function checkInvitationStatus() {
      if (!user?.id) return;

      setIsVerifying(true);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('invitation_code_used')
        .eq('id', user.id)
        .maybeSingle();

      if (!error && profile?.invitation_code_used) {
        navigate('/profile-setup');
      }
      
      setIsVerifying(false);
    }

    if (user) {
      checkInvitationStatus();
    }
  }, [user, navigate]);

  async function onSubmit(data: InvitationCodeValues) {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ invitation_code_used: data.code })
        .eq('id', user.id);

      if (profileError) {
        toast({ 
          title: "Error updating profile", 
          description: profileError.message, 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }

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
            type: 'invitation_code_redeemed',
            user: user.email,
            code: data.code
          }),
        });
      } catch (e) {
        console.error('Failed to notify admin:', e);
      }

      toast({ title: "Success!", description: "Invitation code verified successfully." });
      navigate('/profile-setup');
    } catch (e) {
      console.error('Error verifying invitation code:', e);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-xl text-primary">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg w-[450px] max-w-full mx-4 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-2">MEMORIA</h1>
        <p className="text-md text-muted-foreground text-center mb-2">Exclusive Community</p>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Enter Your Invitation Code</h2>
          <p className="text-sm text-muted-foreground mt-2">
            To join Memoria, please enter the invitation code.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invitation Code</FormLabel>
                  <FormControl>
                    <Input 
                      required 
                      disabled={loading} 
                      placeholder="Enter your invitation code" 
                      className="text-center tracking-wider text-lg"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InvitationCodePage;
