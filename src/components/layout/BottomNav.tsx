
import { Home, Users, Bell, MessageCircle, User, Film, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

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
          to="/reels" 
          className={cn(
            "flex flex-col items-center", 
            isActive("/reels") ? "text-primary" : "text-foreground"
          )}
        >
          <Film size={24} />
        </Link>
        <Link 
          to="/social-features" 
          className={cn(
            "flex flex-col items-center", 
            isActive("/social-features") ? "text-primary" : "text-foreground"
          )}
        >
          <Sparkles size={24} />
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
      </div>
    </div>
  );
};

export default BottomNav;
