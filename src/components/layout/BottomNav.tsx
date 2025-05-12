
import { Home, Users, Bell, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background py-2 md:hidden">
      <div className="flex items-center justify-around">
        <Link 
          to="/home" 
          className={cn(
            "flex flex-col items-center gap-1", 
            isActive("/home") ? "text-primary" : "text-foreground"
          )}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link 
          to="/friends" 
          className={cn(
            "flex flex-col items-center gap-1", 
            isActive("/friends") ? "text-primary" : "text-foreground"
          )}
        >
          <Users size={24} />
          <span className="text-xs">Friends</span>
        </Link>
        <Link 
          to="/notifications" 
          className={cn(
            "flex flex-col items-center gap-1", 
            isActive("/notifications") ? "text-primary" : "text-foreground"
          )}
        >
          <Bell size={24} />
          <span className="text-xs">Alerts</span>
        </Link>
        <Link 
          to="/messages" 
          className={cn(
            "flex flex-col items-center gap-1", 
            isActive("/messages") ? "text-primary" : "text-foreground"
          )}
        >
          <MessageCircle size={24} />
          <span className="text-xs">Messages</span>
        </Link>
        <Link 
          to="/profile" 
          className={cn(
            "flex flex-col items-center gap-1", 
            isActive("/profile") ? "text-primary" : "text-foreground"
          )}
        >
          <User size={24} />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
