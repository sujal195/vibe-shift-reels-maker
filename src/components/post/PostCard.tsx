
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, Pause } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Post } from "./PostFeed";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuthSession();
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAudioPlay = () => {
    setIsPlaying(!isPlaying);
    // Audio play/pause logic would go here
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  
  // Get display name from user metadata or email
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Avatar>
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{displayName}</p>
                <p className="text-sm text-muted-foreground">{timeAgo}</p>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {post.content && (
              <p className="text-sm leading-relaxed">{post.content}</p>
            )}

            {post.media_url && post.media_type === 'image' && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={post.media_url}
                  alt="Post content"
                  className="w-full h-auto object-cover max-h-96"
                />
              </div>
            )}

            {post.media_url && post.media_type === 'audio' && (
              <div className="bg-secondary rounded-lg p-4 flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAudioPlay}
                  className="shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-0"></div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">0:00</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${
                    isLiked ? 'text-red-500' : 'text-muted-foreground'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments_count || 0}</span>
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
