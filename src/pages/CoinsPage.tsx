
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins } from "lucide-react";
import { useCoinsData } from "@/hooks/useCoinsData";
import { WalletTab } from "@/components/coins/WalletTab";
import { LeaderboardTab } from "@/components/coins/LeaderboardTab";
import { AchievementsTab } from "@/components/coins/AchievementsTab";
import { FloatingCoinMenu } from "@/components/coins/FloatingCoinMenu";

const CoinsPage = () => {
  const [activeTab, setActiveTab] = useState("wallet");
  const { userCoins, achievements, topUsers, topReferrers, referralCode, dailyStreak } = useCoinsData();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Coin Center</h1>
          <div className="flex items-center bg-secondary/50 px-4 py-2 rounded-full">
            <Coins className="h-5 w-5 text-amber-400 mr-2" />
            <span className="font-semibold text-xl">{userCoins.toLocaleString()}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="wallet">
            <WalletTab 
              userCoins={userCoins} 
              dailyStreak={dailyStreak} 
              referralCode={referralCode} 
            />
          </TabsContent>

          <TabsContent value="leaderboard">
            <LeaderboardTab 
              topUsers={topUsers} 
              topReferrers={topReferrers} 
            />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsTab 
              achievements={achievements} 
            />
          </TabsContent>
        </Tabs>
      </div>

      <FloatingCoinMenu setActiveTab={setActiveTab} />
    </Layout>
  );
};

export default CoinsPage;
