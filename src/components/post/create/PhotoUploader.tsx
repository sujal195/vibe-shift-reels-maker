
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface PhotoUploaderProps {
  photoPreview: string | null;
  onPhotoSelect: (file: File) => void;
  onRemovePhoto: () => void;
  disabled?: boolean;
}

const PhotoUploader = ({
  photoPreview,
  onPhotoSelect,
  onRemovePhoto,
  disabled = false
}: PhotoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoSelect(file);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handlePhotoClick}
        disabled={disabled}
        className="text-foreground hover:text-primary"
      >
        <Camera className="h-5 w-5 mr-2" />
        Photo
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
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
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default PhotoUploader;
