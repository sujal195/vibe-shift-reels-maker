
import { Home, Users, Bell, Film, User, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const BottomNav = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background py-3 md:hidden">
      <div className="flex items-center justify-around">
        <Link 
          to="/home" 
          className={cn(
            "flex flex-col items-center", 
            isActive("/home") ? "text-primary" : "text-foreground"
          )}
        >
          <Home size={24} />
        </Link>
        <Link 
          to="/friends" 
          className={cn(
            "flex flex-col items-center", 
            isActive("/friends") ? "text-primary" : "text-foreground"
          )}
        >
          <Users size={24} />
        </Link>
        <Link 
          to="/notifications" 
          className={cn(
            "flex flex-col items-center", 
            isActive("/notifications") ? "text-primary" : "text-foreground"
          )}
        >
          <Bell size={24} />
        </Link>
        <Link 
          to="/reels" 
          className={cn(
            "flex flex-col items-center", 
            isActive("/reels") ? "text-primary" : "text-foreground"
          )}
        >
          <Film size={24} />
        </Link>
        <Link 
          to="/profile" 
          className={cn(
            "flex flex-col items-center", 
            isActive("/profile") ? "text-primary" : "text-foreground"
          )}
        >
          <User size={24} />
        </Link>
        
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button 
              className={cn(
                "flex flex-col items-center", 
                isMenuOpen ? "text-primary" : "text-foreground"
              )}
              onClick={toggleMenu}
            >
              <Menu size={24} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mr-2">
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full cursor-pointer">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/coins" className="w-full cursor-pointer">Coins</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/memory-vault" className="w-full cursor-pointer">Memory Vault</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/private-legacy" className="w-full cursor-pointer">Private Legacy</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/collaboration" className="w-full cursor-pointer">Collaboration</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/offline-memories" className="w-full cursor-pointer">Offline Memories</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/marketplace" className="w-full cursor-pointer">Marketplace</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/memory-spaces" className="w-full cursor-pointer">Memory Spaces</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/global-wall" className="w-full cursor-pointer">Global Wall</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BottomNav;
