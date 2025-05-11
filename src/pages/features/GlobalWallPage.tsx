
import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { Globe, Search, Heart, MessageSquare, Share2, Image, Camera, Calendar, Clock, MapPin, Filter } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample posts for the global memory wall
const globalPosts = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    content: "Sharing this beautiful sunset from my trip to Hawaii last month. One of the most breathtaking views I've ever seen!",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    location: "Waikiki Beach, Hawaii",
    date: "3 days ago",
    likes: 248,
    comments: 42,
    isFeatured: true,
    tags: ["sunset", "travel", "hawaii", "beach"]
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    content: "Graduated today! Four years of hard work has finally paid off. So grateful for everyone who supported me along this journey.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    location: "University of California",
    date: "1 week ago",
    likes: 372,
    comments: 89,
    isFeatured: false,
    tags: ["graduation", "achievement", "education", "milestone"]
  },
  {
    id: 3,
    user: {
      name: "Emily Williams",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    content: "Today marks 5 years since I moved to New York. The city that never sleeps has become my home, and I can't imagine living anywhere else.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    location: "New York City",
    date: "2 weeks ago",
    likes: 185,
    comments: 27,
    isFeatured: true,
    tags: ["newyork", "anniversary", "city", "memories"]
  },
  {
    id: 4,
    user: {
      name: "David Garcia",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    content: "First day at my new job! Excited to start this new chapter with an amazing team.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
    location: "Tech Innovations Inc.",
    date: "3 weeks ago",
    likes: 127,
    comments: 31,
    isFeatured: false,
    tags: ["newjob", "career", "milestone", "work"]
  },
];

// Popular tags for the global wall
const popularTags = [
  { name: "travel", count: 1243 },
  { name: "family", count: 876 },
  { name: "graduation", count: 542 },
  { name: "wedding", count: 489 },
  { name: "birthday", count: 352 },
  { name: "holiday", count: 298 },
  { name: "achievement", count: 245 },
  { name: "nature", count: 213 },
  { name: "pets", count: 187 },
  { name: "friends", count: 164 }
];

const GlobalWallPage = () => {
  const { user } = useAuthSession();
  const [posts, setPosts] = useState(globalPosts);
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      description: `Searching for "${searchQuery}" in global memories`,
    });
  };

  const handleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
    
    setPosts(posts.map(post =>
      post.id === postId
        ? { 
            ...post, 
            likes: likedPosts.includes(postId) ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
    
    if (!likedPosts.includes(postId)) {
      toast({
        description: "Memory liked",
      });
    }
  };

  const handleComment = (postId: number) => {
    toast({
      description: "Comment feature coming soon",
    });
  };

  const handleShare = (postId: number) => {
    toast({
      description: "Share feature coming soon",
    });
  };

  const handlePostMemory = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to post to the Global Memory Wall",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Post to Global Wall",
      description: "Coming soon: Share your memories with the world",
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Global Memory Wall</h1>
        </div>
        
        <div className="mb-8">
          <div className="bg-secondary/30 p-8 rounded-lg">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Shared Memories From Around The World</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Discover and connect with moments that matter, shared by the MEMORIA community worldwide.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <form onSubmit={handleSearch} className="relative w-full max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search memories, topics, or tags..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Button onClick={handlePostMemory} className="whitespace-nowrap">
                <Image className="h-4 w-4 mr-2" />
                Post Memory
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Memory feed */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-6">
              {posts
                .filter(post => activeTab !== 'featured' || post.isFeatured)
                .map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={post.user.avatar} alt={post.user.name} />
                            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{post.user.name}</h3>
                            <div className="flex items-center text-xs text-muted-foreground gap-3">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.date}
                              </span>
                              {post.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {post.location}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {post.isFeatured && (
                            <Badge className="ml-auto" variant="default">
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <p className="mb-4">{post.content}</p>
                        
                        {post.image && (
                          <div className="relative aspect-video rounded-md overflow-hidden mb-4">
                            <img 
                              src={post.image} 
                              alt="Memory" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between border-t border-border pt-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`gap-2 ${likedPosts.includes(post.id) ? 'text-red-500' : ''}`}
                            onClick={() => handleLike(post.id)}
                          >
                            <Heart className={`h-4 w-4 ${likedPosts.includes(post.id) ? 'fill-red-500' : ''}`} />
                            <span>{post.likes}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleComment(post.id)}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleShare(post.id)}
                          >
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline">
                Load More Memories
              </Button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-72">
            <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Popular Tags</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge 
                      key={tag.name} 
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => {
                        setSearchQuery(tag.name);
                        toast({
                          description: `Filtering by tag: #${tag.name}`,
                        });
                      }}
                    >
                      #{tag.name}
                      <span className="ml-1 text-xs text-muted-foreground">
                        {tag.count}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Memory Filters</h3>
              </div>
              <div className="p-4">
                <Button variant="outline" className="w-full justify-start mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  By Date
                </Button>
                <Button variant="outline" className="w-full justify-start mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  By Location
                </Button>
                <Button variant="outline" className="w-full justify-start mb-2">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Share Your Memory</h3>
              </div>
              <div className="p-4 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Share a special moment with the world by posting it to the Global Memory Wall.
                </p>
                <Button onClick={handlePostMemory} className="w-full">
                  Post Memory
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GlobalWallPage;
