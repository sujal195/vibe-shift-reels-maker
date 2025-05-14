
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Clock, Users, Trophy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface WalletTabProps {
  userCoins: number;
  dailyStreak: number;
  referralCode: string;
}

export const WalletTab = ({ userCoins, dailyStreak, referralCode }: WalletTabProps) => {
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
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="h-6 w-6 text-amber-400 mr-2" />
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
    </div>
  );
};
