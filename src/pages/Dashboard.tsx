
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Timeline, User, Bell, LogOut, Heart, Camera, Music, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import MemoryCard from "@/components/MemoryCard";

interface Memory {
  id: string;
  title: string;
  content: string;
  emotion: string;
  created_at: string;
  media_url?: string;
  media_type?: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuthSession();
  const navigate = useNavigate();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMemories();
    }
  }, [user]);

  const loadMemories = async () => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setMemories(data || []);
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: "See you soon! 👋" });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

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
      {/* Top Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent font-display">
              MEMORIA
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/timeline')}
              className="text-gray-300 hover:text-white"
            >
              <Timeline className="w-4 h-4 mr-2" />
              Timeline
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              <Bell className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="text-gray-300 hover:text-white"
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-pink-500 text-white text-xs">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-300 hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Welcome back, 
            <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent ml-2">
              {displayName}
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Ready to capture today's memories?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Link
            to="/add-memory"
            className="glass-card p-6 rounded-2xl text-center hover-scale group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-white">New Memory</p>
          </Link>
          
          <div className="glass-card p-6 rounded-2xl text-center hover-scale group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-white">Photo Memory</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl text-center hover-scale group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Music className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-white">Voice Note</p>
          </div>
          
          <Link
            to="/timeline"
            className="glass-card p-6 rounded-2xl text-center hover-scale group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Timeline className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-white">Timeline</p>
          </Link>
        </div>

        {/* Recent Memories */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white">Recent Memories</h3>
            <Link
              to="/timeline"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/6"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : memories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">No memories yet</h4>
              <p className="text-gray-400 mb-6">Start capturing your first memory today!</p>
              <Link
                to="/add-memory"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl text-white font-medium hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Memory
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {memories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <Link
        to="/add-memory"
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
};

export default Dashboard;
