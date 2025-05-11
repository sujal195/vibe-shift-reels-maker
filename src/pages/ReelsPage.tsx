import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Video, PlayCircle, Plus, Clock, TrendingUp, VideoOff, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const ReelsPage = () => {
  const { user } = useAuthSession();
  const [activeTab, setActiveTab] = useState<'trending' | 'following' | 'recent'>('trending');

  const placeholderReels = [
    {
      id: "reel-1",
      title: "Summer Memories",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      authorName: "Travel Memories",
      views: 1200,
      likes: 243
    },
    {
      id: "reel-2",
      title: "City Adventures",
      thumbnail: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
      authorName: "Urban Explorer",
      views: 850,
      likes: 112
    },
    {
      id: "reel-3",
      title: "Nature Walk",
      thumbnail: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      authorName: "Nature Lover",
      views: 2300,
      likes: 455
    },
    {
      id: "reel-4",
      title: "Family Gathering",
      thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
      authorName: "Family Memories",
      views: 789,
      likes: 113
    },
    {
      id: "reel-5",
      title: "Beach Sunset",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      authorName: "Ocean Lover",
      views: 1843,
      likes: 304
    },
    {
      id: "reel-6",
      title: "Mountain Hiking",
      thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      authorName: "Adventure Seeker",
      views: 2120,
      likes: 384
    }
  ];

  const handleCreateReel = () => {
    if (user) {
      toast({
        title: "Create Reel",
        description: "Reel creation feature will be available soon. Stay tuned!",
      });
    } else {
      toast({
        title: "Sign in required",
        description: "Please sign in to create reels",
      });
    }
  };

  const handleLikeReel = (id: string) => {
    toast({
      title: "Liked",
      description: "You liked this reel",
    });
  };

  const handleViewReel = (id: string) => {
    toast({
      description: "Opening reel view...",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Memory Reels</h1>
          <Button onClick={handleCreateReel} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Reel
          </Button>
        </div>
        
        {!user && (
          <div className="p-4 bg-secondary rounded mb-6 text-center">
            <span className="mr-2">Sign in to create and share your own memory reels.</span>
            <Link to="/auth" className="text-primary underline ml-1">
              Sign In / Sign Up
            </Link>
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <Button 
            variant={activeTab === 'trending' ? "default" : "outline"} 
            onClick={() => setActiveTab('trending')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Trending
          </Button>
          <Button 
            variant={activeTab === 'following' ? "default" : "outline"} 
            onClick={() => setActiveTab('following')}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Following
          </Button>
          <Button 
            variant={activeTab === 'recent' ? "default" : "outline"} 
            onClick={() => setActiveTab('recent')}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Recent
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderReels.map((reel) => (
            <div 
              key={reel.id} 
              className="bg-card rounded-lg overflow-hidden shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-video bg-muted group cursor-pointer" onClick={() => handleViewReel(reel.id)}>
                <img 
                  src={reel.thumbnail} 
                  alt={reel.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                  00:45
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-foreground mb-1">{reel.title}</h3>
                <p className="text-sm text-muted-foreground">{reel.authorName}</p>
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-muted-foreground">{reel.views.toLocaleString()} views</p>
                  <button 
                    onClick={() => handleLikeReel(reel.id)} 
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-3 w-3" />
                    {reel.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {placeholderReels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <VideoOff className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No reels found</h3>
            <p className="text-muted-foreground mb-6">
              There are no reels to display right now. Be the first to create one!
            </p>
            <Button onClick={handleCreateReel}>Create Your First Reel</Button>
          </div>
        )}

        <div className="text-center mt-8 p-6 bg-secondary/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Auto-Generated Memory Reels</h2>
          <p className="text-muted-foreground mb-4">
            MEMORIA can automatically create beautiful 1-minute video summaries from your memories.
            Our AI selects your best moments and combines them with music to tell your story.
          </p>
          <Button variant="outline" onClick={handleCreateReel} className="mt-2">Try Auto-Generated Reels</Button>
        </div>
      </div>
    </Layout>
  );
};

export default ReelsPage;
