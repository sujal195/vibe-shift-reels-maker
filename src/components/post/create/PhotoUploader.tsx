
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";

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

  // Determine the target bucket based on uploadType
  const bucket = uploadType === "cover"
    ? "covers"
    : uploadType === "profile"
    ? "avatars"
    : "avatars"; // default to avatars for posts as well for now

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
        const filePath =
          uploadType === "cover"
            ? `cover-pictures/${fileName}`
            : uploadType === "profile"
            ? `profile-pictures/${fileName}`
            : `post-pictures/${fileName}`;

        const { error: uploadError } = await supabase
          .storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) {
          toast({
            title: "Upload Failed",
            description: uploadError.message,
            variant: "destructive"
          });
          setIsUploading(false);
          return;
        }

        const { data } = supabase
          .storage
          .from(bucket)
          .getPublicUrl(filePath);

        onPhotoSelect(file, data.publicUrl);
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      }
      setIsUploading(false);
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
          <img 
            src={photoPreview} 
            alt="Upload preview" 
            className="w-full rounded-md max-h-72 object-contain bg-secondary" 
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
