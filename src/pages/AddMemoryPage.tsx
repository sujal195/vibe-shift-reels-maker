
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const emotions = [
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'sad', label: 'Sad', emoji: '😢' },
  { value: 'excited', label: 'Excited', emoji: '🤩' },
  { value: 'calm', label: 'Calm', emoji: '😌' },
  { value: 'angry', label: 'Angry', emoji: '😠' },
  { value: 'love', label: 'Love', emoji: '❤️' },
  { value: 'grateful', label: 'Grateful', emoji: '🙏' },
  { value: 'anxious', label: 'Anxious', emoji: '😰' }
];

const AddMemoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emotion, setEmotion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('memories')
        .insert({
          title,
          description,
          emotion,
          user_id: user.id,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Memory saved! ✨",
        description: "Your precious moment has been captured."
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving memory:', error);
      toast({
        title: "Error saving memory",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">Add Memory</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What happened today?"
              required
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell your story..."
              rows={4}
              required
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label>How are you feeling?</Label>
            <div className="grid grid-cols-4 gap-3">
              {emotions.map((em) => (
                <button
                  key={em.value}
                  type="button"
                  onClick={() => setEmotion(em.value)}
                  className={`p-3 rounded-xl border transition-all ${
                    emotion === em.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{em.emoji}</div>
                  <div className="text-xs text-gray-300">{em.label}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !title.trim() || !description.trim() || !emotion}
            className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Memory
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryPage;
