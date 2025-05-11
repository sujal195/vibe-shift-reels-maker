
import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { Users, Plus, UserPlus, Check, Clock, Settings, CalendarDays, Folder, FolderPlus, Image, Share2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const collaborativeMemories = [
  {
    id: 1,
    title: "Summer Beach Trip 2023",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    collaborators: 3,
    lastUpdated: "2 days ago",
    totalItems: 27
  },
  {
    id: 2,
    title: "Sarah's Wedding",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552",
    collaborators: 5,
    lastUpdated: "1 week ago",
    totalItems: 142
  },
  {
    id: 3,
    title: "Family Reunion 2023",
    coverImage: "https://images.unsplash.com/photo-1511994714008-b6d68a8b32a2",
    collaborators: 8,
    lastUpdated: "3 weeks ago",
    totalItems: 89
  }
];

const invitations = [
  {
    id: 1,
    title: "New York Trip",
    invitedBy: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=2",
    date: "2 days ago"
  },
  {
    id: 2,
    title: "Company Retreat",
    invitedBy: "Emily Williams",
    avatar: "https://i.pravatar.cc/150?img=3",
    date: "5 days ago"
  }
];

const contacts = [
  { id: 1, name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?img=1", email: "sarah.j@example.com" },
  { id: 2, name: "Michael Chen", avatar: "https://i.pravatar.cc/150?img=2", email: "mchen@example.com" },
  { id: 3, name: "Emily Williams", avatar: "https://i.pravatar.cc/150?img=3", email: "emily.w@example.com" },
  { id: 4, name: "David Garcia", avatar: "https://i.pravatar.cc/150?img=4", email: "dgarcia@example.com" }
];

const CollaborationPage = () => {
  const { user } = useAuthSession();
  const [activeTab, setActiveTab] = useState('memories');
  const [isCreatingMemory, setIsCreatingMemory] = useState(false);
  const [memoryTitle, setMemoryTitle] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleCreateMemory = () => {
    if (!memoryTitle.trim()) {
      toast({
        title: "Please enter a title",
        description: "Your collaborative memory needs a title.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Memory created",
      description: `"${memoryTitle}" has been created successfully.`,
    });
    
    setIsCreatingMemory(false);
    setMemoryTitle('');
    setSelectedContacts([]);
  };

  const toggleContactSelection = (contactId: number) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId) 
        : [...prev, contactId]
    );
  };

  const handleAcceptInvitation = (id: number) => {
    toast({
      title: "Invitation accepted",
      description: "You've joined the collaborative memory.",
    });
  };

  const handleDeclineInvitation = (id: number) => {
    toast({
      title: "Invitation declined",
      description: "You've declined the collaborative memory invitation.",
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Memory Collaboration</h1>
        </div>
        
        <div className="mb-8">
          {!isCreatingMemory ? (
            <div className="bg-secondary/30 p-8 rounded-lg text-center">
              <Users className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Create Collaborative Memories</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Invite friends and family to contribute to shared memories.
                Everyone can add photos, videos, and stories to create a complete picture.
              </p>
              <Button onClick={() => setIsCreatingMemory(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Collaborative Memory
              </Button>
            </div>
          ) : (
            <div className="bg-card border border-border p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Create New Collaborative Memory</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="memory-title" className="block text-sm font-medium mb-2">
                    Memory Title
                  </label>
                  <Input 
                    id="memory-title" 
                    placeholder="e.g., Summer Beach Trip 2023"
                    value={memoryTitle}
                    onChange={(e) => setMemoryTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Invite Collaborators
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-md p-2">
                    {contacts.map((contact) => (
                      <div 
                        key={contact.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-secondary/50 cursor-pointer"
                        onClick={() => toggleContactSelection(contact.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.email}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                          selectedContacts.includes(contact.id) ? 'bg-primary border-primary' : 'border-muted-foreground'
                        }`}>
                          {selectedContacts.includes(contact.id) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreatingMemory(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateMemory}>
                    Create Memory
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="memories" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              My Collaborative Memories
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invitations
              {invitations.length > 0 && (
                <Badge variant="secondary">{invitations.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="memories">
            {collaborativeMemories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaborativeMemories.map((memory) => (
                  <Card key={memory.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img 
                        src={memory.coverImage} 
                        alt={memory.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {memory.collaborators}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{memory.title}</h3>
                      <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Image className="h-3 w-3" />
                          <span>{memory.totalItems} items</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{memory.lastUpdated}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0 gap-2">
                      <Button variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                      <Button className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              
                <Card className="border-dashed flex flex-col items-center justify-center h-full min-h-[220px]">
                  <Button 
                    variant="ghost" 
                    className="h-full w-full flex flex-col gap-3"
                    onClick={() => setIsCreatingMemory(true)}
                  >
                    <FolderPlus className="h-12 w-12 text-muted-foreground" />
                    <span>Create New Collaborative Memory</span>
                  </Button>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No collaborative memories yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first collaborative memory to start collecting memories with friends and family.
                </p>
                <Button onClick={() => setIsCreatingMemory(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Collaborative Memory
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="invitations">
            {invitations.length > 0 ? (
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={invitation.avatar} alt={invitation.invitedBy} />
                        <AvatarFallback>{invitation.invitedBy.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-lg">{invitation.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          <span>{invitation.invitedBy}</span> invited you {invitation.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleDeclineInvitation(invitation.id)}>
                        Decline
                      </Button>
                      <Button onClick={() => handleAcceptInvitation(invitation.id)}>
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No pending invitations</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  When someone invites you to collaborate on a memory, you'll see their invitation here.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Recent Activity</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { 
                    user: "Michael Chen", 
                    avatar: "https://i.pravatar.cc/150?img=2",
                    action: "added 5 photos to",
                    memory: "Summer Beach Trip 2023",
                    time: "2 hours ago"
                  },
                  { 
                    user: "You", 
                    avatar: user.user_metadata?.avatar_url || "",
                    action: "commented on a photo in",
                    memory: "Sarah's Wedding",
                    time: "Yesterday"
                  },
                  { 
                    user: "Emily Williams", 
                    avatar: "https://i.pravatar.cc/150?img=3",
                    action: "shared a memory in",
                    memory: "Family Reunion 2023",
                    time: "2 days ago"
                  }
                ].map((activity, index) => (
                  <div key={index} className="p-4 flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={activity.avatar} alt={activity.user} />
                      <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-muted-foreground"> {activity.action} </span>
                        <span className="font-medium">{activity.memory}</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <CalendarDays className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Empty state if no activities */}
                {/* Replace the above map with this if there are no activities */}
                {/*
                <div className="p-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Activity from your collaborative memories will appear here.
                  </p>
                </div>
                */}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-card border border-border p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Collaborate in Real Time</h3>
              <p className="text-muted-foreground">
                Invite friends and family to contribute to your memories. Everyone can add photos, videos, and stories in real time.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2" onClick={() => setIsCreatingMemory(true)}>
                Start a new collaborative memory
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollaborationPage;
