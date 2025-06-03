
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MemoryCard from "@/components/MemoryCard";

interface Memory {
  id: string;
  title: string;
  description: string;
  emotion: string;
  created_at: string;
  image_url?: string;
  user_id: string;
}

const TimelinePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthSession();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmotion, setFilterEmotion] = useState("");

  const emotions = [
    { value: '', label: 'All Emotions' },
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'excited', label: 'Excited', emoji: '🤩' },
    { value: 'calm', label: 'Calm', emoji: '😌' },
    { value: 'angry', label: 'Angry', emoji: '😠' },
    { value: 'love', label: 'Love', emoji: '❤️' },
    { value: 'grateful', label: 'Grateful', emoji: '🙏' },
    { value: 'anxious', label: 'Anxious', emoji: '😰' }
  ];

  useEffect(() => {
    if (user) {
      loadMemories();
    }
  }, [user]);

  const loadMemories = async () => {
    try {
      let query = supabase
        .from('memories')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (filterEmotion) {
        query = query.eq('emotion', filterEmotion);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMemories(data || []);
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [filterEmotion]);

  const filteredMemories = memories.filter(memory =>
    memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-semibold">Timeline</h1>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {emotions.map((emotion) => (
              <button
                key={emotion.value}
                onClick={() => setFilterEmotion(emotion.value)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-sm transition-all ${
                  filterEmotion === emotion.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {emotion.emoji && <span className="mr-1">{emotion.emoji}</span>}
                {emotion.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-6">
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
        ) : filteredMemories.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || filterEmotion ? 'No matching memories' : 'No memories yet'}
            </h3>
            <p className="text-gray-400">
              {searchTerm || filterEmotion 
                ? 'Try adjusting your search or filter'
                : 'Start creating memories to see them here'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
