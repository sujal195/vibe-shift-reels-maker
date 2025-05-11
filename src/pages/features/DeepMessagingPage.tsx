
import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Search, Phone, Video, MoreVertical, Send, Paperclip, Smile, Mic, Image, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Emotion reaction types
type Emotion = 'love' | 'joy' | 'surprise' | 'anger' | 'sadness' | 'fear' | 'anxiety' | 'excitement';

// Preset emotions with emojis
const emotions: Record<Emotion, { emoji: string; label: string }> = {
  love: { emoji: '❤️', label: 'Love' },
  joy: { emoji: '😊', label: 'Joy' },
  surprise: { emoji: '😮', label: 'Surprise' },
  anger: { emoji: '😡', label: 'Anger' },
  sadness: { emoji: '😢', label: 'Sadness' },
  fear: { emoji: '😨', label: 'Fear' },
  anxiety: { emoji: '😰', label: 'Anxiety' },
  excitement: { emoji: '🤩', label: 'Excitement' }
};

// Sample conversation data
const conversations = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Are you free this weekend?",
    time: "10:30 AM",
    unread: 2
  },
  { 
    id: 2, 
    name: "Michael Chen", 
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "I saw the photos from your trip!",
    time: "Yesterday",
    unread: 0
  },
  { 
    id: 3, 
    name: "Emily Williams", 
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Thanks for sharing that memory",
    time: "Tuesday",
    unread: 0
  },
  { 
    id: 4, 
    name: "David Garcia", 
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Let's meet up soon!",
    time: "Monday",
    unread: 0
  }
];

// Sample messages for the current conversation
const sampleMessages = [
  {
    id: 1,
    sender: 1, // conversation id
    content: "Hey! How's your day going?",
    time: "10:15 AM",
    reactions: []
  },
  {
    id: 2,
    sender: 0, // 0 means the current user
    content: "Pretty good! Just finished organizing the photos from our trip last month.",
    time: "10:20 AM",
    reactions: []
  },
  {
    id: 3,
    sender: 1,
    content: "Oh nice! Can you share some of them? I'd love to see how they turned out.",
    time: "10:22 AM",
    reactions: [{ emotion: 'excitement' as Emotion, count: 1 }]
  },
  {
    id: 4,
    sender: 0,
    content: "Sure thing! Here are a few of my favorites:",
    time: "10:25 AM",
    reactions: []
  },
  {
    id: 5,
    sender: 0,
    content: "🏞️ [Image: Mountain view]",
    time: "10:25 AM",
    reactions: [{ emotion: 'love' as Emotion, count: 1 }]
  },
  {
    id: 6,
    sender: 1,
    content: "These are amazing! That sunset shot is absolutely breathtaking. I'm feeling so nostalgic now.",
    time: "10:28 AM",
    reactions: [{ emotion: 'joy' as Emotion, count: 1 }]
  },
  {
    id: 7,
    sender: 1,
    content: "Are you free this weekend? We could plan another trip maybe?",
    time: "10:30 AM",
    reactions: []
  }
];

const DeepMessagingPage = () => {
  const { user } = useAuthSession();
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(sampleMessages);
  const [searchInput, setSearchInput] = useState("");
  const [reactionMessage, setReactionMessage] = useState<number | null>(null);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 0, // current user
      content: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
    
    setTimeout(() => {
      toast({
        description: "Message sent",
      });
    }, 500);
  };

  const handleReaction = (messageId: number, emotion: Emotion) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? {
            ...msg, 
            reactions: [...msg.reactions.filter(r => r.emotion !== emotion), { emotion, count: 1 }]
          }
        : msg
    ));
    
    setReactionMessage(null);
    
    toast({
      description: `Reacted with ${emotions[emotion].emoji}`,
    });
  };

  const filteredConversations = searchInput
    ? conversations.filter(c => 
        c.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(searchInput.toLowerCase())
      )
    : conversations;

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex h-full">
          {/* Conversation sidebar */}
          <div className="w-80 border-r border-border flex flex-col bg-card">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Messages</h2>
                <Button size="icon" variant="ghost">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-9"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map(conversation => (
                <div 
                  key={conversation.id}
                  className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-secondary/50 ${
                    activeConversation.id === conversation.id ? 'bg-secondary' : ''
                  }`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <Avatar>
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-medium">{conversation.unread}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="h-16 border-b border-border flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                  <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{activeConversation.name}</h3>
                  <p className="text-xs text-muted-foreground">Online now</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Video className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div key={message.id} className={message.sender === 0 ? "flex flex-col items-end" : "flex flex-col items-start"}>
                  <div className="relative group">
                    <div 
                      className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                        message.sender === 0 
                          ? "bg-primary text-primary-foreground rounded-tr-none" 
                          : "bg-secondary text-foreground rounded-tl-none"
                      }`}
                    >
                      {message.content}
                      <div className="text-xs opacity-70 mt-1">
                        {message.time}
                      </div>
                    </div>
                    
                    {/* Reaction button */}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ 
                        [message.sender === 0 ? 'left' : 'right']: '-10px'
                      }}
                      onClick={() => setReactionMessage(reactionMessage === message.id ? null : message.id)}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    
                    {/* Reactions shown */}
                    {message.reactions.length > 0 && (
                      <div className="absolute -bottom-2 flex">
                        {message.reactions.map((reaction, i) => (
                          <div key={i} className="h-6 w-6 flex items-center justify-center bg-secondary rounded-full -ml-1 first:ml-0">
                            <span>{emotions[reaction.emotion].emoji}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reaction picker */}
                    {reactionMessage === message.id && (
                      <div className="absolute z-10 bottom-full mb-2 bg-card border border-border rounded-full shadow-lg p-2 flex items-center">
                        {Object.entries(emotions).map(([key, { emoji }]) => (
                          <button
                            key={key}
                            className="h-8 w-8 flex items-center justify-center hover:bg-secondary rounded-full"
                            onClick={() => handleReaction(message.id, key as Emotion)}
                          >
                            <span className="text-lg">{emoji}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost">
                  <Paperclip className="h-5 w-5" />
                </Button>
                
                <div className="relative flex-1">
                  <Input 
                    placeholder="Type a message..." 
                    className="pr-24"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Image className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <Button onClick={handleSendMessage}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Message will be encrypted end-to-end</span>
                </div>
                <div>
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Emotional Analysis On
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info sidebar - hidden on mobile */}
          <div className="hidden lg:block w-64 border-l border-border bg-card">
            <div className="p-4 text-center">
              <Avatar className="h-20 w-20 mx-auto mb-3">
                <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-lg">{activeConversation.name}</h3>
              <p className="text-sm text-muted-foreground">Online now</p>
              
              <div className="flex justify-center gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4 mr-1" />
                  Video
                </Button>
              </div>
            </div>
            
            <div className="px-4 py-2 border-t border-border">
              <h4 className="text-sm font-medium mb-2">Emotional Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>Joy</span>
                  <div className="w-[60%] bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span>70%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Excitement</span>
                  <div className="w-[60%] bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <span>50%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Nostalgia</span>
                  <div className="w-[60%] bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span>40%</span>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-2 border-t border-border">
              <h4 className="text-sm font-medium mb-2">Shared Memories</h4>
              <div className="grid grid-cols-3 gap-1">
                <div className="aspect-square bg-secondary rounded-md"></div>
                <div className="aspect-square bg-secondary rounded-md"></div>
                <div className="aspect-square bg-secondary rounded-md"></div>
              </div>
              <Button variant="link" size="sm" className="w-full mt-2 p-0">
                View All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeepMessagingPage;
