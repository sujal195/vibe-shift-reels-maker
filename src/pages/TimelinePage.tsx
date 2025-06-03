
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/useAuthSession";
import { supabase } from "@/integrations/supabase/client";
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

const TimelinePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthSession();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");

  const emotions = [
    { value: '', label: 'All', emoji: '🌟' },
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'excited', label: 'Excited', emoji: '🤩' },
    { value: 'calm', label: 'Calm', emoji: '😌' },
    { value: 'angry', label: 'Angry', emoji: '😠' },
    { value: 'love', label: 'Love', emoji: '❤️' },
    { value: 'grateful', label: 'Grateful', emoji: '🙏' },
    { value: 'anxious', label: 'Anxious', emoji: '😰' },
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

      const { data, error } = await query;

      if (error) throw error;
      setMemories(data || []);
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmotion = selectedEmotion === "" || memory.emotion === selectedEmotion;
    return matchesSearch && matchesEmotion;
  });

  const groupedMemories = filteredMemories.reduce((groups, memory) => {
    const date = new Date(memory.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(memory);
    return groups;
  }, {} as Record<string, Memory[]>);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <h1 className="text-xl font-semibold">Your Timeline</h1>
          
          <div className="w-16"></div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search your memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
            />
          </div>

          {/* Emotion Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {emotions.map((emotion) => (
              <button
                key={emotion.value}
                onClick={() => setSelectedEmotion(emotion.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedEmotion === emotion.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{emotion.emoji}</span>
                <span className="text-sm">{emotion.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-800 rounded w-32 animate-pulse"></div>
                <div className="glass-card p-6 rounded-2xl animate-pulse">
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
              </div>
            ))}
          </div>
        ) : Object.keys(groupedMemories).length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchQuery || selectedEmotion ? "No memories found" : "No memories yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedEmotion 
                ? "Try adjusting your search or filter" 
                : "Start creating memories to see your timeline"}
            </p>
            {!searchQuery && !selectedEmotion && (
              <Button
                onClick={() => navigate('/add-memory')}
                className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600"
              >
                Create First Memory
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedMemories)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, dayMemories]) => (
                <div key={date} className="space-y-4">
                  <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-md py-2">
                    <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                  </div>
                  <div className="space-y-4 pl-6 border-l-2 border-gray-800">
                    {dayMemories.map((memory, index) => (
                      <div key={memory.id} className="relative">
                        <div className="absolute -left-8 top-6 w-3 h-3 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full"></div>
                        <MemoryCard memory={memory} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
