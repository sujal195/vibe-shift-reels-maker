
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  mediaType?: "photo" | "voice";
  mediaUrl?: string;
  privacy: "public" | "friends" | "private";
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    // In a real app, this would make an API call
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(newLiked ? likeCount + 1 : likeCount - 1);
  };

  const formatTimestamp = (timestamp: string) => {
    // Simple formatter - in a real app, use a library like date-fns
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const privacyIcon = {
    "public": "🌍",
    "friends": "👥",
    "private": "🔒"
  }[post.privacy];

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-foreground">{post.author.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{formatTimestamp(post.createdAt)}</span>
                <span className="mx-1">•</span>
                <span>{privacyIcon}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Hide</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-3 text-foreground whitespace-pre-line">
          {post.content}
        </div>

        {post.mediaType === "photo" && post.mediaUrl && (
          <div className="mt-3">
            <img
              src={post.mediaUrl}
              alt="Post media"
              className="w-full rounded-md max-h-96 object-contain"
            />
          </div>
        )}

        {post.mediaType === "voice" && post.mediaUrl && (
          <div className="mt-3 p-3 bg-secondary rounded-md">
            <audio src={post.mediaUrl} controls className="w-full" />
          </div>
        )}

        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <div>{likeCount > 0 ? `${likeCount} likes` : ""}</div>
          <div>{post.comments > 0 ? `${post.comments} comments` : ""}</div>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex justify-between">
          <Button
            variant="ghost"
            className={`flex-1 ${liked ? "text-primary" : "text-muted-foreground"}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 mr-2 ${liked ? "fill-primary" : ""}`} />
            Like
          </Button>
          <Button variant="ghost" className="flex-1 text-muted-foreground">
            <MessageCircle className="h-5 w-5 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" className="flex-1 text-muted-foreground">
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
