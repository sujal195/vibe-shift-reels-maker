
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image, Mic, MapPin, Smile } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const { user } = useAuthSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    // Here you would typically send the post to your backend
    console.log("Creating post:", content);
    setContent("");
  };

  if (!user) return null;

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-3">
            <Avatar>
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] border-0 p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0 resize-none"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-4">
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
                <Image className="h-5 w-5 mr-2" />
                Photo
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
                <Mic className="h-5 w-5 mr-2" />
                Audio
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2" />
                Location
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
                <Smile className="h-5 w-5 mr-2" />
                Feeling
              </Button>
            </div>
            
            <Button 
              type="submit" 
              disabled={!content.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              Share Memory
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
