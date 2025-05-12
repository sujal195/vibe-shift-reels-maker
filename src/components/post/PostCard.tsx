
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import BlueTickBadge from "@/components/BlueTickBadge";
import { useVerifiedStatus } from "@/hooks/useVerifiedStatus";

export interface Post {
  id: string;
  content?: string;
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
  privacy?: "public" | "friends" | "private";
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const { isVerified } = useVerifiedStatus(post.author.id);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  // Format createdAt as relative time (e.g., "2 hours ago")
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <Card className="mb-4 bg-card border-border">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{post.author.name}</span>
                {isVerified && <BlueTickBadge size="sm" />}
              </div>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        {post.content && <p className="mb-4">{post.content}</p>}
        
        {post.mediaType === "photo" && post.mediaUrl && (
          <div className="mb-4 rounded-md overflow-hidden">
            <img src={post.mediaUrl} alt="Post media" className="w-full h-auto" />
          </div>
        )}
        
        {post.mediaType === "voice" && post.mediaUrl && (
          <div className="mb-4">
            <audio src={post.mediaUrl} controls className="w-full" />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center ${liked ? 'text-red-500' : ''}`} 
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 mr-1 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-1" />
            {post.comments}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center">
            <Share className="h-5 w-5 mr-1" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
