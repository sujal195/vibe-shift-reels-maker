
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";
import { LazyImage } from "@/components/ui/lazy-image";
import { getImageDimensions } from "@/utils/imageUtils";

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
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Load image dimensions to prevent CLS
  useEffect(() => {
    if (photoPreview) {
      getImageDimensions(photoPreview).then(dimensions => {
        setImageDimensions(dimensions);
      });
    }
  }, [photoPreview]);

  // Determine the target bucket based on uploadType
  const bucket = "media";

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Function to compress and optimize image before upload
  const optimizeImage = async (file: File): Promise<File> => {
    // For small files (< 300KB), don't bother compressing
    if (file.size < 300 * 1024) {
      return file;
    }
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          // Determine target size based on image dimensions
          const MAX_WIDTH = 1200; // Max width for any image
          const MAX_HEIGHT = 1200; // Max height for any image
          
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
          
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Try to use WebP if possible for better compression
          let format = 'image/webp';
          let quality = 0.85;
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file); // Fallback to original if compression fails
                return;
              }
              
              // Create a new file from the compressed blob
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.(png|jpg|jpeg)$/i, '.webp'),
                { type: format }
              );
              
              resolve(compressedFile);
            },
            format,
            quality
          );
        };
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setIsUploading(true);
      try {
        // Optimize the image before upload
        const optimizedFile = await optimizeImage(file);
        
        const fileExt = optimizedFile.name.split('.').pop();
        const fileName = `${user.id}-${uploadType}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath =
          uploadType === "cover"
            ? `cover-pictures/${fileName}`
            : uploadType === "profile"
            ? `profile-pictures/${fileName}`
            : `post-pictures/${fileName}`;

        // Check if bucket exists, if not show proper message
        const { data: bucketExists } = await supabase
          .storage
          .getBucket(bucket);
          
        if (!bucketExists) {
          toast({
            title: "Storage not configured",
            description: "Storage buckets are not set up properly. Please contact support.",
            variant: "destructive"
          });
          setIsUploading(false);
          return;
        }

        const { error: uploadError } = await supabase
          .storage
          .from(bucket)
          .upload(filePath, optimizedFile);

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

        // Get dimensions for the uploaded image to prevent CLS
        const dimensions = await getImageDimensions(data.publicUrl);
        setImageDimensions(dimensions);
        
        onPhotoSelect(optimizedFile, data.publicUrl);
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "An unexpected error occurred during upload. Storage might not be configured.",
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
          <LazyImage 
            src={photoPreview} 
            alt="Upload preview" 
            className="w-full rounded-md max-h-72 object-contain bg-zinc-900"
            width={imageDimensions.width}
            height={imageDimensions.height}
            priority={true} // This is above the fold, don't lazy load
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
