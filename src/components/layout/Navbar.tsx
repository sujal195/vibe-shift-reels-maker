
import { Link, useNavigate } from "react-router-dom";
import { Bell, Home, User, MessageCircle, Search, Diamond, Settings, Users, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthSession } from "@/hooks/useAuthSession";
import { toast } from "@/components/ui/use-toast";
import usePremiumAccess from "@/hooks/usePremiumAccess";
import BlueTickBadge from "@/components/BlueTickBadge";
import { useVerifiedStatus } from "@/hooks/useVerifiedStatus";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, signOut } = useAuthSession();
  const { isSubscribed, isTrial } = usePremiumAccess();
  const { isVerified } = useVerifiedStatus(user?.id);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/friends?q=${encodeURIComponent(searchQuery)}`);
      toast({
        title: "Search Results",
        description: `Showing results for "${searchQuery}"`,
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Function to render premium indicator
  const renderPremiumIndicator = () => {
    if (isSubscribed) {
      return <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>;
    }
    
    if (isTrial) {
      return <span className="absolute -top-1 -right-1 h-3 w-3 bg-amber-400 rounded-full animate-pulse"></span>;
    }
    
    return null;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">MEMORIA</span>
            </Link>
          </div>

          {/* Center section - Navigation Icons (desktop only) */}
          <div className="hidden md:flex items-center justify-center space-x-1 flex-1">
            <Link to="/home" className="text-foreground hover:text-primary hover:bg-secondary p-3 rounded-lg">
              <Home className="h-6 w-6" />
            </Link>
            <Link to="/friends" className="text-foreground hover:text-primary hover:bg-secondary p-3 rounded-lg">
              <Users className="h-6 w-6" />
            </Link>
            <Link to="/messages" className="text-foreground hover:text-primary hover:bg-secondary p-3 rounded-lg">
              <MessageCircle className="h-6 w-6" />
            </Link>
            <Link to="/notifications" className="text-foreground hover:text-primary hover:bg-secondary p-3 rounded-lg">
              <Bell className="h-6 w-6" />
            </Link>
            <Link to="/reels" className="text-foreground hover:text-primary hover:bg-secondary p-3 rounded-lg">
              <Film className="h-6 w-6" />
            </Link>
            <Link to="/premium" className="text-primary hover:text-primary/90 hover:bg-secondary p-3 rounded-lg relative">
              <Diamond className="h-6 w-6" />
              {renderPremiumIndicator()}
            </Link>
            <Link to="/settings" className="text-foreground hover:text-primary hover:bg-secondary p-3 rounded-lg">
              <Settings className="h-6 w-6" />
            </Link>
          </div>

          {/* Right section - Search, Upgrade and Profile */}
          <div className="flex items-center">
            <form onSubmit={handleSearch} className="relative mr-2 md:mr-4">
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-900 border-zinc-800 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
            
            <Link to="/premium" className="mr-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex items-center border-primary text-primary hover:bg-primary/10"
              >
                <Diamond className="h-4 w-4 mr-2" /> 
                Upgrade
              </Button>
            </Link>
            
            {user ? (
              <Link to="/profile" className="flex items-center">
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.user_metadata?.display_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {isVerified && <BlueTickBadge className="ml-1" size="sm" />}
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
