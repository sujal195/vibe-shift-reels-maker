
import { useState, useEffect } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";

// Type definitions
export interface UserCoins {
  id: string;
  username: string;
  avatar?: string;
  coins: number;
  rank?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  max: number;
  completed: boolean;
}

export const useCoinsData = () => {
  const { user } = useAuthSession();
  const [userCoins, setUserCoins] = useState<number>(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [topUsers, setTopUsers] = useState<UserCoins[]>([]);
  const [topReferrers, setTopReferrers] = useState<UserCoins[]>([]);
  const [referralCode, setReferralCode] = useState<string>("");
  const [dailyStreak, setDailyStreak] = useState<number>(0);

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

  return {
    userCoins,
    achievements,
    topUsers,
    topReferrers,
    referralCode,
    dailyStreak
  };
};
