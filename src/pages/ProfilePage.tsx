
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, MapPin, Calendar, Heart, Camera, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthSession } from "@/hooks/useAuthSession";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthSession();
  const [memories, setMemories] = useState([]);
  const [stats, setStats] = useState({
    totalMemories: 0,
    favoriteEmotion: 'happy',
    daysActive: 0
  });

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('emotion, created_at')
        .eq('user_id', user?.id);

      if (error) throw error;

      if (data) {
        const emotionCounts = data.reduce((acc: any, memory: any) => {
          acc[memory.emotion] = (acc[memory.emotion] || 0) + 1;
          return acc;
        }, {});

        const favoriteEmotion = Object.entries(emotionCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'happy';
        
        const uniqueDates = new Set(data.map(memory => new Date(memory.created_at).toDateString()));

        setStats({
          totalMemories: data.length,
          favoriteEmotion: favoriteEmotion as string,
          daysActive: uniqueDates.size
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  }) : '';

  const getEmotionIcon = (emotion: string) => {
    const emotions: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      excited: '🤩',
      calm: '😌',
      angry: '😠',
      love: '❤️',
      grateful: '🙏',
      anxious: '😰'
    };
    return emotions[emotion] || '😊';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <h1 className="text-xl font-semibold">Profile</h1>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="glass-card rounded-2xl p-8 mb-8 text-center">
          <div className="relative inline-block mb-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-pink-500 text-white text-2xl">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">{displayName}</h2>
          <p className="text-gray-400 mb-4">{email}</p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          <Button className="mt-6 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.totalMemories}</div>
            <div className="text-sm text-gray-400">Total Memories</div>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
              {getEmotionIcon(stats.favoriteEmotion)}
            </div>
            <div className="text-2xl font-bold text-white mb-1 capitalize">{stats.favoriteEmotion}</div>
            <div className="text-sm text-gray-400">Most Common Mood</div>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.daysActive}</div>
            <div className="text-sm text-gray-400">Days Active</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/timeline')}
              className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
            >
              View Timeline
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/add-memory')}
              className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
            >
              Add Memory
            </Button>
          </div>
        </div>

        {/* Memory Insights */}
        <div className="glass-card rounded-2xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Memory Insights</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">This Week</span>
              <span className="text-white font-medium">0 memories</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">This Month</span>
              <span className="text-white font-medium">{stats.totalMemories} memories</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Longest Streak</span>
              <span className="text-white font-medium">1 day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
