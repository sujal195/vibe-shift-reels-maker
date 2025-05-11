
import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Video, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ReelsPage = () => {
  const { user } = useAuthSession();

  const placeholderReels = [
    {
      id: "reel-1",
      title: "Summer Memories",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      authorName: "Travel Memories",
      views: 1200
    },
    {
      id: "reel-2",
      title: "City Adventures",
      thumbnail: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
      authorName: "Urban Explorer",
      views: 850
    },
    {
      id: "reel-3",
      title: "Nature Walk",
      thumbnail: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      authorName: "Nature Lover",
      views: 2300
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Reels</h1>
          {user && (
            <Button>
              <Video className="h-4 w-4 mr-2" />
              Create Reel
            </Button>
          )}
        </div>
        
        {!user && (
          <div className="p-4 bg-secondary rounded mb-6 text-center">
            <span className="mr-2">Sign in to create and share your own reels.</span>
            <Link to="/auth" className="text-primary underline ml-1">
              Go to Sign In / Sign Up
            </Link>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderReels.map((reel) => (
            <div 
              key={reel.id} 
              className="bg-card rounded-lg overflow-hidden shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-video bg-muted">
                <img 
                  src={reel.thumbnail} 
                  alt={reel.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-white opacity-80 hover:opacity-100 hover:scale-105 transition-all cursor-pointer" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-foreground mb-1">{reel.title}</h3>
                <p className="text-sm text-muted-foreground">{reel.authorName}</p>
                <p className="text-xs text-muted-foreground mt-1">{reel.views} views</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 p-8 bg-secondary/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Coming Soon: Enhanced Reels Features</h2>
          <p className="text-muted-foreground mb-4">We're working on bringing you the ability to create, share, and discover more immersive memory reels.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="h-5 w-5 text-primary" />
              <span>Automatic 1-minute video summaries</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PlayCircle className="h-5 w-5 text-primary" />
              <span>Enhanced viewing experience</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReelsPage;
