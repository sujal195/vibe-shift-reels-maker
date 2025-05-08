
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface PostButtonProps {
  onClick: () => void;
  disabled: boolean;
  isPosting?: boolean;
}

const PostButton = ({ onClick, disabled, isPosting = false }: PostButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled || isPosting}
      className="ml-auto"
    >
      <Send className="h-4 w-4 mr-2" />
      {isPosting ? "Posting..." : "Post"}
    </Button>
  );
};

export default PostButton;
