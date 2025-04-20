
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface PostButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const PostButton = ({ onClick, disabled }: PostButtonProps) => {
  return (
    <Button 
      variant="default" 
      size="sm" 
      onClick={onClick}
      disabled={disabled}
      className="bg-primary hover:bg-primary/90"
    >
      <Upload className="h-4 w-4 mr-2" />
      Post
    </Button>
  );
};

export default PostButton;
