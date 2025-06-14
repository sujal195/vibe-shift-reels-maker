
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share, Play, Pause } from "lucide-react";
import { useState } from "react";

interface Memory {
  id: string;
  title: string;
  description: string;
  emotion: string;
  created_at: string;
  image_url?: string;
  user_id: string;
}

interface MemoryCardProps {
  memory: Memory;
}

const MemoryCard = ({ memory }: MemoryCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: 'from-yellow-400 to-orange-400',
      sad: 'from-blue-400 to-blue-600',
      excited: 'from-purple-400 to-pink-500',
      calm: 'from-green-400 to-blue-400',
      angry: 'from-red-400 to-red-600',
      love: 'from-pink-400 to-red-400',
      grateful: 'from-purple-400 to-purple-600',
      anxious: 'from-gray-400 to-gray-600'
    };
    return colors[emotion] || 'from-blue-400 to-pink-400';
  };

  const timeAgo = formatDistanceToNow(new Date(memory.created_at), { addSuffix: true });

  return (
    <div className="glass-card rounded-2xl p-6 hover-scale group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-r ${getEmotionColor(memory.emotion)} rounded-full flex items-center justify-center text-lg`}>
            {getEmotionIcon(memory.emotion)}
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
              {memory.title}
            </h3>
            <p className="text-sm text-gray-400">{timeAgo}</p>
          </div>
        </div>
        <div className="text-xs text-gray-500 capitalize bg-gray-800 px-2 py-1 rounded-full">
          {memory.emotion}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-300 leading-relaxed">{memory.description}</p>
      </div>

      {/* Media */}
      {memory.image_url && (
        <div className="mb-4">
          <div className="rounded-xl overflow-hidden">
            <img
              src={memory.image_url}
              alt="Memory"
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">0</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">0</span>
          </button>
        </div>
        
        <button className="text-gray-400 hover:text-white transition-colors">
          <Share className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MemoryCard;
