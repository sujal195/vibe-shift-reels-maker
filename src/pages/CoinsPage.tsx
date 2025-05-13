
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coin, Trophy, Users, Clock, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Type definitions
interface UserCoins {
  id: string;
  username: string;
  avatar?: string;
  coins: number;
  rank?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  max: number;
  completed: boolean;
}

const CoinsPage = () => {
  const { user } = useAuthSession();
  const [activeTab, setActiveTab] = useState("wallet");
  const [userCoins, setUserCoins] = useState<number>(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [topUsers, setTopUsers] = useState<UserCoins[]>([]);
  const [topReferrers, setTopReferrers] = useState<UserCoins[]>([]);
  const [referralCode, setReferralCode] = useState<string>("");
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  // Load demo data on component mount
  useEffect(() => {
    // Demo data
    setUserCoins(2500);
    setReferralCode(user?.id?.substring(0, 8) || "MEMORIA");
    setDailyStreak(3);

    // Demo achievements
    setAchievements([
      {
        id: "1",
        title: "Daily Login Streak",
        description: "Log in for 7 consecutive days",
        reward: 1000,
        progress: 3,
        max: 7,
        completed: false
      },
      {
        id: "2",
        title: "Share 5 Memories",
        description: "Post 5 new memories to your timeline",
        reward: 500,
        progress: 2,
        max: 5,
        completed: false
      },
      {
        id: "3",
        title: "First Comment",
        description: "Comment on another user's memory",
        reward: 200,
        progress: 1,
        max: 1,
        completed: true
      },
      {
        id: "4",
        title: "Profile Completed",
        description: "Complete your profile with photo and bio",
        reward: 300,
        progress: 1,
        max: 1,
        completed: true
      }
    ]);

    // Demo leaderboard data
    setTopUsers([
      { id: "1", username: "MemoryMaster", coins: 12500, rank: 1 },
      { id: "2", username: "Reminiscer", coins: 9800, rank: 2 },
      { id: "3", username: "ThoughtKeeper", coins: 7200, rank: 3 },
      { id: "4", username: "TimeTracker", coins: 6100, rank: 4 },
      { id: "5", username: "MindVault", coins: 5500, rank: 5 }
    ]);

    setTopReferrers([
      { id: "1", username: "ConnectKing", coins: 15000, rank: 1 },
      { id: "2", username: "NetworkQueen", coins: 12000, rank: 2 },
      { id: "3", username: "SocialButterfly", coins: 9000, rank: 3 },
      { id: "4", username: "FriendFinder", coins: 7500, rank: 4 },
      { id: "5", username: "LinkMaster", coins: 6000, rank: 5 }
    ]);
  }, [user]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Referral Code Copied!",
      description: "Share it with friends to earn coins when they join and use Memoria.",
    });
  };

  const redeemCoins = () => {
    if (userCoins < 30000) {
      toast({
        title: "Not Enough Coins",
        description: "You need at least 30,000 coins to redeem for cash ($3 minimum).",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Redemption Requested",
      description: "We'll review your request and process your payment soon!",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Coin Center</h1>
          <div className="flex items-center bg-secondary/50 px-4 py-2 rounded-full">
            <Coin className="h-5 w-5 text-amber-400 mr-2" />
            <span className="font-semibold text-xl">{userCoins.toLocaleString()}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coin className="h-6 w-6 text-amber-400 mr-2" />
                  Your Coin Wallet
                </CardTitle>
                <CardDescription>
                  Earn coins through daily activity and referrals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Daily Activity Streak</span>
                    <span className="text-sm font-semibold">{dailyStreak}/7 days</span>
                  </div>
                  <Progress value={(dailyStreak / 7) * 100} className="h-2 mb-1" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Use MEMORIA for 2 hours daily for 7 days to earn 1,000 coins!
                  </p>
                </div>

                <div className="bg-card p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">Your Referral Code</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyReferralCode}
                      className="h-8 text-xs"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="bg-background p-2 rounded border border-border font-mono text-center">
                    {referralCode}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Earn 2,000 coins for each new active user who joins with your code!
                  </p>
                </div>

                <div className="bg-card p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">Coin Value</span>
                    <span className="text-xs text-muted-foreground">10,000 coins = $1.00</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm">
                      Current Balance: <span className="font-semibold">${(userCoins / 10000).toFixed(2)}</span>
                    </span>
                    <Button 
                      variant={userCoins >= 30000 ? "default" : "outline"} 
                      size="sm" 
                      onClick={redeemCoins}
                      disabled={userCoins < 30000}
                      className="h-8"
                    >
                      Redeem
                    </Button>
                  </div>
                  {userCoins < 30000 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      You need {(30000 - userCoins).toLocaleString()} more coins to reach the minimum redemption of $3.00
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ways to Earn Coins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Daily Activity</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the app for 2+ hours daily for 7 consecutive days to earn 1,000 coins
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Referrals</h3>
                    <p className="text-sm text-muted-foreground">
                      Invite friends using your referral code to earn 2,000 coins per active user
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Leaderboard Rankings</h3>
                    <p className="text-sm text-muted-foreground">
                      Top 3 weekly users earn 5,000 / 3,000 / 1,000 bonus coins
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 text-amber-400 mr-2" />
                  Top Coin Earners This Week
                </CardTitle>
                <CardDescription>
                  Users who earned the most coins through app activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {topUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full font-semibold text-sm ${
                        index === 0 ? "bg-yellow-500 text-yellow-950" : 
                        index === 1 ? "bg-gray-300 text-gray-700" : 
                        index === 2 ? "bg-amber-700 text-amber-100" : "bg-primary/20"
                      }`}>
                        {user.rank}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <div className="flex items-center">
                      <Coin className="h-4 w-4 text-amber-400 mr-1" />
                      <span>{user.coins.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <Button variant="outline" className="w-full">
                  View Complete Rankings
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  Top Referrers This Week
                </CardTitle>
                <CardDescription>
                  Users who invited the most verified active users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {topReferrers.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full font-semibold text-sm ${
                        index === 0 ? "bg-yellow-500 text-yellow-950" : 
                        index === 1 ? "bg-gray-300 text-gray-700" : 
                        index === 2 ? "bg-amber-700 text-amber-100" : "bg-primary/20"
                      }`}>
                        {user.rank}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <div className="flex items-center">
                      <Coin className="h-4 w-4 text-amber-400 mr-1" />
                      <span>{user.coins.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <Button variant="outline" className="w-full">
                  Start Referring Friends
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`border ${achievement.completed ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{achievement.title}</span>
                      <span className="text-sm font-normal flex items-center">
                        <Coin className="h-4 w-4 text-amber-400 mr-1" />
                        {achievement.reward}
                      </span>
                    </CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>{achievement.progress} / {achievement.max}</span>
                      <span className={achievement.completed ? "text-primary" : "text-muted-foreground"}>
                        {achievement.completed ? "Completed!" : "In Progress"}
                      </span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.max) * 100} 
                      className={`h-2 ${achievement.completed ? "bg-primary/20" : "bg-secondary"}`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Coin Button */}
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
            <Coin className="h-6 w-6 text-background" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CoinsPage;
