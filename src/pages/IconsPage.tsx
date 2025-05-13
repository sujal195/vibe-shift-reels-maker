
import Layout from "@/components/layout/Layout";
import { 
  CirclePlay, 
  Film, 
  Video, 
  Sparkles, 
  MessageCircle, 
  User, 
  Bookmark, 
  Search, 
  MessageSquare, 
  Sticker, 
  Share2, 
  Heart,
  Users,
  Camera,
  Zap,
  Mic,
  Bell,
  Play,
  Compass
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

type IconCategory = {
  name: string;
  description: string;
  icons: {
    name: string;
    icon: React.ElementType;
    feature: string;
    inspiration: string;
  }[];
};

const IconsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const copyToClipboard = (iconName: string) => {
    navigator.clipboard.writeText(`<${iconName} />`);
    toast({
      title: "Copied to clipboard",
      description: `<${iconName} /> has been copied to your clipboard.`,
    });
  };

  const iconCategories: IconCategory[] = [
    {
      name: "Content & Media",
      description: "Icons for visual content like stories, videos, and images",
      icons: [
        { name: "Camera", icon: Camera, feature: "Stories", inspiration: "Instagram/Snapchat" },
        { name: "Film", icon: Film, feature: "Short Video Feed", inspiration: "TikTok" },
        { name: "Video", icon: Video, feature: "Reels", inspiration: "Instagram" },
        { name: "CirclePlay", icon: CirclePlay, feature: "Live Streaming", inspiration: "Instagram/TikTok" },
      ],
    },
    {
      name: "Creative Tools",
      description: "Icons for creative features and filters",
      icons: [
        { name: "Sparkles", icon: Sparkles, feature: "AR Filters & Lenses", inspiration: "Snapchat" },
        { name: "Zap", icon: Zap, feature: "Effects", inspiration: "TikTok" },
        { name: "Sticker", icon: Sticker, feature: "Stickers and GIFs", inspiration: "Instagram/Snapchat" },
      ],
    },
    {
      name: "Communication",
      description: "Icons for messaging and engagement",
      icons: [
        { name: "MessageSquare", icon: MessageSquare, feature: "Direct Messaging", inspiration: "Instagram" },
        { name: "MessageCircle", icon: MessageCircle, feature: "Comments", inspiration: "All platforms" },
        { name: "Users", icon: Users, feature: "Duet/React", inspiration: "TikTok" },
      ],
    },
    {
      name: "Engagement",
      description: "Icons for user interaction",
      icons: [
        { name: "Heart", icon: Heart, feature: "Like", inspiration: "All platforms" },
        { name: "Share2", icon: Share2, feature: "Share", inspiration: "All platforms" },
        { name: "Bookmark", icon: Bookmark, feature: "Saved Content", inspiration: "Instagram" },
      ],
    },
    {
      name: "Discovery",
      description: "Icons for exploring content",
      icons: [
        { name: "Search", icon: Search, feature: "Explore/Discover", inspiration: "Instagram/TikTok" },
        { name: "Compass", icon: Compass, feature: "Trending", inspiration: "TikTok" },
        { name: "Bell", icon: Bell, feature: "Notifications", inspiration: "All platforms" },
      ],
    },
    {
      name: "Profile",
      description: "Icons for user profiles",
      icons: [
        { name: "User", icon: User, feature: "Profile Customization", inspiration: "All platforms" },
        { name: "Mic", icon: Mic, feature: "Voice Notes", inspiration: "Snapchat" },
        { name: "Play", icon: Play, feature: "Audio/Video Playback", inspiration: "All platforms" },
      ],
    },
  ];

  const allIcons = iconCategories.flatMap(category => category.icons);
  
  const displayIcons = selectedCategory === "all" 
    ? allIcons 
    : iconCategories.find(c => c.name === selectedCategory)?.icons || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Icon Library</h1>
          <div className="text-muted-foreground text-sm">
            Total Icons: {allIcons.length}
          </div>
        </div>
        
        <p className="text-muted-foreground mb-6">
          A collection of modern icons for social media features inspired by platforms like Snapchat, TikTok, and Instagram.
          Click on any icon to copy its component name to your clipboard.
        </p>
        
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2">
            <Button 
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="whitespace-nowrap"
            >
              All Categories
            </Button>
            {iconCategories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {selectedCategory !== "all" && (
          <div className="mb-8 bg-secondary/50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              {selectedCategory}
            </h2>
            <p className="text-muted-foreground">
              {iconCategories.find(c => c.name === selectedCategory)?.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayIcons.map((item) => (
            <div
              key={item.name}
              onClick={() => copyToClipboard(item.name)}
              className="bg-card border border-border p-4 rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 flex items-center justify-center text-primary mb-4">
                <item.icon size={32} />
              </div>
              <div className="text-center">
                <p className="font-medium mb-1">{item.name}</p>
                <p className="text-sm text-muted-foreground mb-1">{item.feature}</p>
                <p className="text-xs text-muted-foreground">{item.inspiration}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-secondary p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Design Guidelines</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-medium">Consistency:</span> Maintain the same design language across all icons</li>
            <li><span className="font-medium">Color Palette:</span> Use the app's color system, with white/light icons on dark backgrounds</li>
            <li><span className="font-medium">Modern & Simple:</span> Clean lines and simple shapes for better recognition</li>
            <li><span className="font-medium">Responsive:</span> Icons should look good at different sizes</li>
          </ul>
        </div>

        <div className="mt-8 p-6 bg-primary/10 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Feature Integration Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Content Features</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Stories (24-hour temporary posts)</li>
                <li>Short-Form Videos (15-60 seconds)</li>
                <li>AR Filters and Effects</li>
                <li>Live Streaming</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Social Features</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Duets/Reaction Videos</li>
                <li>Direct Messaging</li>
                <li>Enhanced Post Engagement</li>
                <li>Discover/Explore Section</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IconsPage;
