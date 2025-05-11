
import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Heart, Calendar, SmilePlus, Search, Filter, ScanFace, HeartHandshake, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const emotions = [
  { name: "Joy", color: "bg-amber-500", icon: "😊" },
  { name: "Love", color: "bg-red-500", icon: "❤️" },
  { name: "Excitement", color: "bg-orange-500", icon: "🤩" },
  { name: "Nostalgia", color: "bg-blue-400", icon: "🥹" },
  { name: "Gratitude", color: "bg-green-500", icon: "🙏" },
  { name: "Hope", color: "bg-teal-500", icon: "✨" },
  { name: "Calm", color: "bg-cyan-400", icon: "😌" },
  { name: "Sadness", color: "bg-indigo-400", icon: "😢" },
];

const memories = [
  {
    id: 1,
    title: "Beach Day with Friends",
    date: "2023-06-15",
    emotion: "Joy",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    excerpt: "One of the most beautiful days at the beach with my closest friends."
  },
  {
    id: 2,
    title: "Mom's Birthday",
    date: "2023-05-10",
    emotion: "Love",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
    excerpt: "Celebrated mom's 60th birthday with the whole family. So grateful for her."
  },
  {
    id: 3,
    title: "First Marathon",
    date: "2023-04-02",
    emotion: "Excitement",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3",
    excerpt: "Finally completed my first marathon! All those months of training paid off."
  },
  {
    id: 4,
    title: "Old School Reunion",
    date: "2023-03-18",
    emotion: "Nostalgia",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1",
    excerpt: "Meeting my school friends after 15 years brought back so many memories."
  }
];

const EmotionTimelinePage = () => {
  const { user } = useAuthSession();
  const [activeTab, setActiveTab] = useState("timeline");
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleScanMemory = () => {
    toast({
      title: "Emotion Scan",
      description: "Scanning your memories to detect emotions...",
    });
  };

  const filteredMemories = selectedEmotion 
    ? memories.filter(memory => memory.emotion === selectedEmotion)
    : memories;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Emotion Timeline</h1>
        </div>
        
        <div className="bg-secondary/30 p-8 rounded-lg mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Experience Your Memories Through Feelings</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Our AI automatically detects emotions in your photos, videos, and posts, 
              organizing them into a timeline that helps you relive how you felt.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {emotions.map((emotion) => (
              <Button 
                key={emotion.name}
                variant={selectedEmotion === emotion.name ? "default" : "outline"} 
                className="gap-2"
                onClick={() => setSelectedEmotion(
                  selectedEmotion === emotion.name ? null : emotion.name
                )}
              >
                <span>{emotion.icon}</span>
                <span>{emotion.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" className="mr-3" onClick={() => setSelectedEmotion(null)}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
            <Button onClick={handleScanMemory}>
              <ScanFace className="h-4 w-4 mr-2" />
              Scan New Memories
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Mood Insights
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Collections
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            <div className="space-y-6">
              {filteredMemories.length > 0 ? (
                filteredMemories.map((memory) => (
                  <div 
                    key={memory.id}
                    className="bg-card border border-border rounded-lg overflow-hidden flex flex-col md:flex-row"
                  >
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img 
                        src={memory.image} 
                        alt={memory.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                        {new Date(memory.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-1 rounded text-lg">
                        {emotions.find(e => e.name === memory.emotion)?.icon}
                      </div>
                    </div>
                    <div className="p-6 flex-1">
                      <h3 className="text-xl font-semibold mb-2">{memory.title}</h3>
                      <div className="mb-3 flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${emotions.find(e => e.name === memory.emotion)?.color}`}></span>
                        <span className="text-sm text-muted-foreground">{memory.emotion}</span>
                      </div>
                      <p className="text-muted-foreground mb-4">{memory.excerpt}</p>
                      <Button variant="outline" size="sm">View Memory</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No memories found</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedEmotion 
                      ? `We couldn't find any memories with the emotion "${selectedEmotion}".` 
                      : "You haven't added any memories yet."}
                  </p>
                  <Button onClick={handleScanMemory}>Scan Existing Memories</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="insights">
            <div className="bg-card border border-border p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Your Emotional Journey</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Track how your emotions have evolved over time. Gain insights into patterns and trends in your emotional wellbeing.
                </p>
                
                <div className="h-60 w-full bg-secondary/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Mood insights visualization will appear here</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-secondary/30 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Most Common Emotion</p>
                    <div className="text-lg font-medium">Joy 😊</div>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Recent Trend</p>
                    <div className="text-lg font-medium">Positive ↗️</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="collections">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {emotions.map((emotion) => (
                <div 
                  key={emotion.name}
                  className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedEmotion(emotion.name)}
                >
                  <div className={`h-2 ${emotion.color}`}></div>
                  <div className="p-4 flex items-center">
                    <div className="text-2xl mr-3">{emotion.icon}</div>
                    <div>
                      <h3 className="font-medium">{emotion.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {memories.filter(m => m.emotion === emotion.name).length} memories
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-full min-h-[120px] border-dashed"
              >
                <SmilePlus className="h-8 w-8 mb-2" />
                <span>Create Custom Emotion</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-card border border-border p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <HeartHandshake className="h-10 w-10 text-primary" />
            <div>
              <h3 className="text-lg font-medium">Share Emotional Journeys</h3>
              <p className="text-muted-foreground">
                Create shared emotional timelines with friends and family for vacations, celebrations, and other special moments.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2">
                Create Shared Timeline
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmotionTimelinePage;
