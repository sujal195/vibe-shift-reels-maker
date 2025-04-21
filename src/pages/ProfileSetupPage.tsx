
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";
import { User, Image, Upload } from "lucide-react";

type ProfileSetupValues = {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
};

const ProfileSetupPage = () => {
  const { user, isLoading } = useAuthSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  
  const form = useForm<ProfileSetupValues>({
    defaultValues: { 
      firstName: "", 
      lastName: "", 
      username: "",
      bio: "" 
    }
  });

  useEffect(() => {
    // Pre-fill form with user data if available
    if (user?.user_metadata) {
      const metadata = user.user_metadata;
      form.setValue('firstName', metadata.first_name || '');
      form.setValue('lastName', metadata.last_name || '');
      
      if (metadata.first_name && metadata.last_name) {
        // Generate a suggested username
        const suggestedUsername = `${metadata.first_name.toLowerCase()}${metadata.last_name.toLowerCase()}`;
        form.setValue('username', suggestedUsername);
      }
    }
  }, [user, form]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onBasicInfoSubmit(data: ProfileSetupValues) {
    setLoading(true);
    
    try {
      // Check if username is available
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', data.username)
        .not('id', 'eq', user?.id)
        .maybeSingle();

      if (existingUser) {
        toast({ 
          title: "Username taken", 
          description: "This username is already taken. Please choose another one.", 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          display_name: `${data.firstName} ${data.lastName}`
        }
      });

      if (updateError) {
        toast({ 
          title: "Error updating user", 
          description: updateError.message, 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          username: data.username,
          display_name: `${data.firstName} ${data.lastName}`,
        })
        .eq('id', user?.id);

      if (profileError) {
        toast({ 
          title: "Error updating profile", 
          description: profileError.message, 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }

      // Move to next step
      setStep(2);
    } catch (e) {
      console.error('Error updating profile:', e);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  async function onBioSubmit(data: ProfileSetupValues) {
    setLoading(true);
    
    try {
      // Update profile bio
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          bio: data.bio, // This is now valid!
        })
        .eq('id', user?.id);

      if (profileError) {
        toast({ 
          title: "Error updating bio", 
          description: profileError.message, 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }

      // Move to next step
      setStep(3);
    } catch (e) {
      console.error('Error updating bio:', e);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  async function onProfilePictureSubmit() {
    if (!profilePicture) {
      // Skip if no profile picture selected
      setStep(4);
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload profile picture to storage
      const fileExt = profilePicture.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, profilePicture);

      if (uploadError) {
        toast({ 
          title: "Error uploading picture", 
          description: uploadError.message, 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }

      // Get the public URL
      const { data } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: data.publicUrl
        })
        .eq('id', user?.id);

      if (profileError) {
        toast({ 
          title: "Error updating profile", 
          description: profileError.message, 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }

      // Move to final step
      setStep(4);
    } catch (e) {
      console.error('Error uploading profile picture:', e);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  function finishSetup() {
    // Notify admin via edge function
    try {
      fetch(`https://gfhcmeicnbccihtyclbj.supabase.co/functions/v1/notify-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'profile_completed',
          user: user?.email,
          username: form.getValues('username')
        }),
      });
    } catch (e) {
      console.error('Failed to notify admin:', e);
    }

    toast({ 
      title: "Profile setup complete!", 
      description: "Welcome to Memoria! You're all set to start using the platform."
    });
    navigate('/');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-xl text-primary">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg w-[550px] max-w-full mx-4 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-2">MEMORIA</h1>
        <p className="text-md text-muted-foreground text-center mb-6">Complete Your Profile</p>

        {/* Progress indicators */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-[22%] h-2 rounded-full ${s <= step ? 'bg-primary' : 'bg-secondary'}`}
            />
          ))}
        </div>
        
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Step 1: Basic Information</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Let's start with some basic information about you.
              </p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onBasicInfoSubmit)} className="space-y-4">
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
                              placeholder="First Name" 
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
                              placeholder="Last Name" 
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-muted-foreground">@</span>
                          <Input 
                            className="pl-9" 
                            required 
                            disabled={loading} 
                            placeholder="Choose a unique username" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-6" disabled={loading}>
                  {loading ? "Saving..." : "Continue to Bio"}
                </Button>
              </form>
            </Form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Step 2: Your Bio</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Tell the community a little about yourself.
              </p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onBioSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Me</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={5}
                          placeholder="Share a bit about yourself, your interests, and what brings you to Memoria..." 
                          disabled={loading} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)} 
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Continue to Profile Picture"}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Step 3: Profile Picture</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Add a profile picture to make your profile more personal.
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-6">
              <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                {profilePicturePreview ? (
                  <img 
                    src={profilePicturePreview} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-muted-foreground" />
                )}
              </div>
              
              <div className="w-full">
                <label 
                  htmlFor="profile-picture" 
                  className="cursor-pointer flex flex-col items-center justify-center bg-secondary hover:bg-secondary/80 rounded-lg p-6 border-2 border-dashed border-border transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">
                    {profilePicture ? 'Change picture' : 'Upload a profile picture'}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max 5MB.
                  </span>
                  <input 
                    id="profile-picture" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleProfilePictureChange}
                    disabled={loading}
                  />
                </label>
              </div>
              
              <div className="flex justify-between w-full mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(2)} 
                  disabled={loading}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={onProfilePictureSubmit} 
                  disabled={loading}
                >
                  {loading ? "Uploading..." : profilePicture ? "Upload & Continue" : "Skip & Continue"}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Setup Complete!</h2>
              <p className="text-sm text-muted-foreground mt-2">
                You're all set to start using Memoria. Welcome to the community!
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-6">
              <Image className="h-24 w-24 text-primary" />
              
              <div className="text-center">
                <h3 className="text-lg font-medium">
                  {`${form.getValues('firstName')} ${form.getValues('lastName')}`}
                </h3>
                <p className="text-sm text-muted-foreground">@{form.getValues('username')}</p>
              </div>
              
              <Button 
                type="button" 
                className="w-full mt-6"
                onClick={finishSetup}
              >
                Go to My Timeline
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSetupPage;
