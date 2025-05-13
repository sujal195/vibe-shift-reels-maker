
import Layout from "@/components/layout/Layout";
import { 
  Camera, 
  Film, 
  Video, 
  Sparkles, 
  MessageSquare, 
  Users, 
  Compass, 
  Play,
  CirclePlay,
  Bell,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthSession } from "@/hooks/useAuthSession";
import { toast } from "@/components/ui/use-toast";

type FeatureCard = {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  path: string;
  status: "available" | "coming-soon" | "beta";
};

const SocialFeaturesPage = () => {
  const { user } = useAuthSession();

  const handleFeatureClick = (feature: FeatureCard) => {
    if (feature.status === "available") {
      // Navigate to the feature page
    } else if (feature.status === "beta") {
      toast({
        title: "Beta Feature",
        description: `${feature.title} is currently in beta. Coming soon!`,
      });
    } else {
      toast({
        title: "Coming Soon",
        description: `${feature.title} will be available soon. Stay tuned!`,
      });
    }
  };

  const features: FeatureCard[] = [
    {
      title: "Stories",
      description: "Share 24-hour updates with your connections",
      icon: Camera,
      color: "bg-gradient-to-br from-purple-600 to-indigo-500",
      path: "/stories",
      status: "coming-soon"
    },
    {
      title: "Memory Reels",
      description: "Create and share short-form video memories",
      icon: Film,
      color: "bg-gradient-to-br from-pink-500 to-orange-400",
      path: "/reels",
      status: "available"
    },
    {
      title: "AR Filters",
      description: "Enhance your photos with augmented reality filters",
      icon: Sparkles,
      color: "bg-gradient-to-br from-yellow-400 to-amber-500",
      path: "/filters",
      status: "coming-soon"
    },
    {
      title: "Memory Duets",
      description: "Collaborate on memories with friends and family",
      icon: Users,
      color: "bg-gradient-to-br from-green-400 to-emerald-500",
      path: "/duets",
      status: "beta"
    },
    {
      title: "Direct Messages",
      description: "Private conversations with enhanced memory sharing",
      icon: MessageSquare,
      color: "bg-gradient-to-br from-blue-500 to-cyan-400",
      path: "/messages",
      status: "available"
    },
    {
      title: "Live Memories",
      description: "Stream your experiences in real-time",
      icon: CirclePlay,
      color: "bg-gradient-to-br from-red-500 to-rose-400",
      path: "/live",
      status: "coming-soon"
    },
    {
      title: "Explore",
      description: "Discover new memories and connect with others",
      icon: Compass,
      color: "bg-gradient-to-br from-violet-500 to-purple-400",
      path: "/explore",
      status: "beta"
    },
    {
      title: "Memory Wall",
      description: "Create and customize your personal memory space",
      icon: Video,
      color: "bg-gradient-to-br from-teal-400 to-cyan-500",
      path: "/memory-wall",
      status: "coming-soon"
    },
    {
      title: "Memory Timeline",
      description: "See your memories organized chronologically",
      icon: Play,
      color: "bg-gradient-to-br from-fuchsia-500 to-pink-400",
      path: "/timeline",
      status: "beta"
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Social Features</h1>
          <Link to="/icons">
            <Button variant="outline" size="sm">
              View Icon Library
            </Button>
          </Link>
        </div>
        
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Discover our modern social features inspired by platforms like Instagram, TikTok, and Snapchat. 
          Create and share your memories in new and exciting ways.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:shadow-primary/10"
              onClick={() => handleFeatureClick(feature)}
            >
              <div className={`p-6 flex items-center justify-center ${feature.color}`}>
                <feature.icon className="text-white h-12 w-12" />
              </div>
              <CardHeader className="pt-6">
                <CardTitle className="flex items-center gap-2">
                  {feature.title}
                  {feature.status === "beta" && (
                    <span className="text-xs font-normal bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded">Beta</span>
                  )}
                  {feature.status === "coming-soon" && (
                    <span className="text-xs font-normal bg-blue-400/20 text-blue-400 px-2 py-0.5 rounded">Coming Soon</span>
                  )}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button 
                  variant={feature.status === "available" ? "default" : "secondary"} 
                  className="w-full"
                  disabled={feature.status === "coming-soon"}
                >
                  {feature.status === "available" ? "Open" : feature.status === "beta" ? "Try Beta" : "Notify Me"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4 text-primary">Feature Roadmap</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-green-500/20 text-green-500">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Enhanced Engagement (Coming in June)</h3>
                <p className="text-muted-foreground">New like, comment, and reaction systems to better connect with memories</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-purple-500/20 text-purple-500">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI Memory Enhancement (Coming in July)</h3>
                <p className="text-muted-foreground">Smart filters and effects to automatically enhance your memories</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-amber-500/20 text-amber-500">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Smart Notifications (Coming in August)</h3>
                <p className="text-muted-foreground">Context-aware notifications based on your memory patterns and interests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SocialFeaturesPage;
