
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";

// Mock data for demonstration
const mockPosts = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "",
    },
    content: "Just had an amazing day at the beach! The sunset was absolutely breathtaking. Sometimes it's the simple moments that create the most beautiful memories. 🌅",
    timestamp: "2 hours ago",
    likes: 15,
    comments: 3,
    shares: 1,
  },
  {
    id: 2,
    user: {
      name: "Sarah Smith",
      avatar: "",
    },
    content: "Celebrating my graduation today! Four years of hard work finally paid off. Grateful for all the support from family and friends. On to the next chapter! 🎓",
    timestamp: "5 hours ago",
    likes: 42,
    comments: 12,
    shares: 5,
  },
];

const PostCard = ({ post }: { post: any }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.user.avatar} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.user.name}</p>
              <p className="text-sm text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm mb-4">{post.content}</p>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
              <Heart className="h-4 w-4 mr-2" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
              <MessageCircle className="h-4 w-4 mr-2" />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
              <Share className="h-4 w-4 mr-2" />
              {post.shares}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PostFeed = () => {
  return (
    <div className="space-y-6">
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {mockPosts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No memories to show yet. Start sharing your first memory!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PostFeed;
