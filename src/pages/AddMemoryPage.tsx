
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Mic, Image, Save } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AddMemoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emotion, setEmotion] = useState("happy");
  const [loading, setLoading] = useState(false);

  const emotions = [
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'from-yellow-400 to-orange-400' },
    { value: 'sad', label: 'Sad', emoji: '😢', color: 'from-blue-400 to-blue-600' },
    { value: 'excited', label: 'Excited', emoji: '🤩', color: 'from-purple-400 to-pink-500' },
    { value: 'calm', label: 'Calm', emoji: '😌', color: 'from-green-400 to-blue-400' },
    { value: 'angry', label: 'Angry', emoji: '😠', color: 'from-red-400 to-red-600' },
    { value: 'love', label: 'Love', emoji: '❤️', color: 'from-pink-400 to-red-400' },
    { value: 'grateful', label: 'Grateful', emoji: '🙏', color: 'from-purple-400 to-purple-600' },
    { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'from-gray-400 to-gray-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('memories')
        .insert({
          user_id: user?.id,
          title: title.trim(),
          content: content.trim(),
          emotion: emotion
        });

      if (error) throw error;

      toast({ title: "Memory saved! ✨" });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving memory:', error);
      toast({
        title: "Failed to save memory",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
          
          <h1 className="text-xl font-semibold">New Memory</h1>
          
          <div className="w-16"></div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">What happened?</label>
            <Input
              type="text"
              placeholder="Give your memory a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 text-lg py-3"
              maxLength={100}
            />
            <div className="text-right text-xs text-gray-500">{title.length}/100</div>
          </div>

          {/* Emotion Picker */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-300">How did you feel?</label>
            <div className="grid grid-cols-4 gap-3">
              {emotions.map((emo) => (
                <button
                  key={emo.value}
                  type="button"
                  onClick={() => setEmotion(emo.value)}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    emotion === emo.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${emo.color} rounded-full flex items-center justify-center mx-auto mb-2 text-lg`}>
                    {emo.emoji}
                  </div>
                  <div className="text-xs text-center text-gray-300">{emo.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Tell your story</label>
            <Textarea
              placeholder="What made this moment special? How did it make you feel? What do you want to remember?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 min-h-[120px] resize-none"
              maxLength={1000}
            />
            <div className="text-right text-xs text-gray-500">{content.length}/1000</div>
          </div>

          {/* Media Options */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-300">Add media (coming soon)</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                disabled
                className="glass-card p-4 rounded-xl text-center opacity-50 cursor-not-allowed"
              >
                <Camera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <div className="text-xs text-gray-400">Photo</div>
              </button>
              
              <button
                type="button"
                disabled
                className="glass-card p-4 rounded-xl text-center opacity-50 cursor-not-allowed"
              >
                <Mic className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <div className="text-xs text-gray-400">Voice</div>
              </button>
              
              <button
                type="button"
                disabled
                className="glass-card p-4 rounded-xl text-center opacity-50 cursor-not-allowed"
              >
                <Image className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <div className="text-xs text-gray-400">Gallery</div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !title.trim() || !content.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving Memory...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Memory
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryPage;
