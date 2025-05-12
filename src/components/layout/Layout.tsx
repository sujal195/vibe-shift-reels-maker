
import { ReactNode } from "react";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import { cn } from "@/lib/utils";
import SmartNotificationManager from "../premium/SmartNotificationManager";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <Navbar />
      <main className={cn("pt-16 min-h-[calc(100vh-4rem)]", className)}>
        {children}
      </main>
      <div className="pb-16 md:pb-0">
        {/* Spacer for bottom nav on mobile */}
      </div>
      <BottomNav />
      <SmartNotificationManager />
    </div>
  );
};

export default Layout;
