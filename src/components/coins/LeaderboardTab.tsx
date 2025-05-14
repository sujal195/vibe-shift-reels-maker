
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Trophy, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserCoins {
  id: string;
  username: string;
  avatar?: string;
  coins: number;
  rank?: number;
}

interface LeaderboardTabProps {
  topUsers: UserCoins[];
  topReferrers: UserCoins[];
}

export const LeaderboardTab = ({ topUsers, topReferrers }: LeaderboardTabProps) => {
  return (
    <div className="space-y-6">
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
                <Coins className="h-4 w-4 text-amber-400 mr-1" />
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
                <Coins className="h-4 w-4 text-amber-400 mr-1" />
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
    </div>
  );
};
