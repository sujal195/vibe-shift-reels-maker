import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";
import { LazyImage } from "@/components/ui/lazy-image";

interface PhotoUploaderProps {
  photoPreview: string | null;
  onPhotoSelect: (file: File, publicUrl: string) => void;
  onRemovePhoto: () => void;
  disabled?: boolean;
  uploadType?: 'profile' | 'cover' | 'post';
}

const PhotoUploader = ({
  photoPreview,
  onPhotoSelect,
  onRemovePhoto,
  disabled = false,
  uploadType = 'post'
}: PhotoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthSession();
  const [isUploading, setIsUploading] = useState(false);

  // Determine the target bucket and folder based on uploadType
  const getBucketDetails = () => {
    if (uploadType === 'profile' || uploadType === 'cover') {
      return {
        bucket: "avatars",
        folder: uploadType === 'profile' ? 'profile-pictures' : 'cover-pictures'
      };
    }
    return {
      bucket: "media",
      folder: 'post-pictures'
    };
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${uploadType}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const { bucket, folder } = getBucketDetails();
        const filePath = `${folder}/${fileName}`;

        // Check if storage services are initialized first
        await ensureStorageBuckets();

        // Upload file to storage
        const { error: uploadError } = await supabase
          .storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(uploadError.message);
        }

        // Get the public URL of the uploaded file
        const { data } = supabase
          .storage
          .from(bucket)
          .getPublicUrl(filePath);

        onPhotoSelect(file, data.publicUrl);
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again later.",
          variant: "destructive"
        });
      }
      setIsUploading(false);
    }
  };

  // Ensure storage buckets are initialized
  const ensureStorageBuckets = async () => {
    try {
      // Call the edge function to create storage buckets if they don't exist
      const { error } = await supabase.functions.invoke('create-buckets');
      if (error) throw error;
    } catch (err) {
      console.error("Failed to initialize storage:", err);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handlePhotoClick}
        disabled={disabled || isUploading}
        className="text-foreground hover:text-primary"
        type="button"
      >
        <Camera className="h-5 w-5 mr-2" />
        {isUploading ? "Uploading..." : "Photo"}
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
      />

      {photoPreview && (
        <div className="relative mb-4">
          <LazyImage 
            src={photoPreview} 
            alt="Upload preview" 
            className="w-full rounded-md max-h-72 object-contain bg-zinc-900" 
          />
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute top-2 right-2 rounded-full" 
            onClick={onRemovePhoto}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default PhotoUploader;
