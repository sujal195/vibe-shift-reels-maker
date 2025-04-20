
import { Link } from "react-router-dom";
import { Bell, Home, User, MessageCircle, Menu, X, Search, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would navigate to search results
      navigate(`/friends?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">MEMORIA</span>
            </Link>
          </div>

          {/* Center section - Navigation Icons */}
          <div className="hidden md:flex items-center justify-center space-x-1 flex-1">
            <Link to="/" className="text-foreground hover:text-primary hover:bg-secondary p-3 rounded-lg">
              <Home className="h-6 w-6" />
            </Link>
            <Link to="/friends" className="text-foreground hover:text-primary hover:bg-secondary p-3 rounded-lg">
              <User className="h-6 w-6" />
            </Link>
            <Link to="/reels" className="text-foreground hover:text-primary hover:bg-secondary p-3 rounded-lg">
              <Video className="h-6 w-6" />
            </Link>
            <Link to="/messages" className="text-foreground hover:text-primary hover:bg-secondary p-3 rounded-lg">
              <MessageCircle className="h-6 w-6" />
            </Link>
            <Link to="/notifications" className="text-foreground hover:text-primary hover:bg-secondary p-3 rounded-lg">
              <Bell className="h-6 w-6" />
            </Link>
            <div className="relative group">
              <Button variant="ghost" className="p-3 rounded-lg">
                <MoreVertical className="h-6 w-6" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg hidden group-hover:block">
                <div className="py-1">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">
                    Profile
                  </Link>
                  <Link to="/reels" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">
                    Reels
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right section - Search and Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search friends..."
                className="w-full pl-10 pr-4 py-2 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
            <Link to="/profile">
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
              </Avatar>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <form onSubmit={handleSearch} className="relative mr-2">
              <Input
                type="search"
                placeholder="Search..."
                className="w-32 pl-8 pr-2 py-1 rounded-full text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            </form>
            <Button variant="ghost" onClick={toggleMenu} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home className="mr-3 h-5 w-5" />
                Home
              </div>
            </Link>
            <Link 
              to="/friends" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <User className="mr-3 h-5 w-5" />
                Friends
              </div>
            </Link>
            <Link 
              to="/reels" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Video className="mr-3 h-5 w-5" />
                Reels
              </div>
            </Link>
            <Link 
              to="/notifications" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Bell className="mr-3 h-5 w-5" />
                Notifications
              </div>
            </Link>
            <Link 
              to="/messages" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <MessageCircle className="mr-3 h-5 w-5" />
                Messages
              </div>
            </Link>
            <Link 
              to="/profile" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Avatar className="h-5 w-5 mr-3">
                  <AvatarFallback className="bg-primary rounded-full text-xs text-primary-foreground">U</AvatarFallback>
                </Avatar>
                Profile
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
