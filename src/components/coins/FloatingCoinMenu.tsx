
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

interface FloatingCoinMenuProps {
  setActiveTab: (tab: string) => void;
}

export const FloatingCoinMenu = ({ setActiveTab }: FloatingCoinMenuProps) => {
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-30">
      <div className="relative">
        {isFloatingMenuOpen && (
          <div className="absolute bottom-16 right-0 bg-card rounded-lg shadow-lg p-2 border border-border w-48">
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setActiveTab("wallet"); setIsFloatingMenuOpen(false); }}>
                Wallet
              </Button>
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setActiveTab("leaderboard"); setIsFloatingMenuOpen(false); }}>
                Leaderboard
              </Button>
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setActiveTab("achievements"); setIsFloatingMenuOpen(false); }}>
                Achievements
              </Button>
            </div>
          </div>
        )}
        
        <Button
          variant="default" 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600"
          onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
        >
          <Coins className="h-6 w-6 text-background" />
        </Button>
      </div>
    </div>
  );
};
