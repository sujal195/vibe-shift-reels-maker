
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";
import { supabase } from "@/integrations/supabase/client";
import PhotoUploader from "@/components/photo/PhotoUploader";
import { Loader2 } from "lucide-react";

interface EditProfileFormProps {
  onSuccess: () => void;
  initialData: {
    name: string;
    bio: string;
    avatar?: string;
    coverPhoto?: string;
  };
}

const EditProfileForm = ({ onSuccess, initialData }: EditProfileFormProps) => {
  const { user } = useAuthSession();
  const [name, setName] = useState(initialData.name);
  const [bio, setBio] = useState(initialData.bio);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatar || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData.coverPhoto || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize storage buckets
  const ensureStorageBuckets = async () => {
    try {
      // Call the edge function to create storage buckets if they don't exist
      const { error } = await supabase.functions.invoke('create-buckets');
      if (error) throw error;
    } catch (err) {
      console.error("Failed to initialize storage:", err);
    }
  };

  const handleAvatarSelect = (_file: File, publicUrl: string) => {
    setAvatarPreview(publicUrl);
  };

  const handleCoverSelect = (_file: File, publicUrl: string) => {
    setCoverPreview(publicUrl);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure storage buckets exist before attempting update
      await ensureStorageBuckets();
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: name,
          bio,
          avatar_url: avatarPreview,
          cover_url: coverPreview,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      // Update user metadata
      const { error: userUpdateError } = await supabase.auth.updateUser({
        data: {
          display_name: name,
          avatar_url: avatarPreview
        }
      });

      if (userUpdateError) {
        console.error("Error updating user metadata:", userUpdateError);
        // Continue anyway as this is not critical
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-white">Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-zinc-900 border-zinc-800"
        />
      </div>
      
      <div>
        <Label htmlFor="bio" className="text-white">Bio</Label>
        <Textarea 
          id="bio" 
          value={bio} 
          onChange={(e) => setBio(e.target.value)} 
          placeholder="Tell us about yourself"
          className="resize-none bg-zinc-900 border-zinc-800"
          rows={3}
        />
      </div>
      
      <div>
        <Label className="text-white">Profile Picture</Label>
        <div className="mt-2">
          <PhotoUploader
            photoPreview={avatarPreview}
            onPhotoSelect={handleAvatarSelect}
            onRemovePhoto={handleRemoveAvatar}
            uploadType="profile"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-white">Cover Photo</Label>
        <div className="mt-2">
          <PhotoUploader
            photoPreview={coverPreview}
            onPhotoSelect={handleCoverSelect}
            onRemovePhoto={handleRemoveCover}
            uploadType="cover"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
