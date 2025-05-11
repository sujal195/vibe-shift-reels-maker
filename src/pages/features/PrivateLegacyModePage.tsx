
import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { User2, Users, UserPlus, Clock, Lock, Key, Calendar, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const PrivateLegacyModePage = () => {
  const { user } = useAuthSession();
  const [isLegacyModeEnabled, setIsLegacyModeEnabled] = useState(false);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const contactList = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Michael Chen", email: "mchen@example.com", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Emily Williams", email: "emily.w@example.com", avatar: "https://i.pravatar.cc/150?img=3" },
  ];

  const handleEnableLegacyMode = () => {
    setIsLegacyModeEnabled(!isLegacyModeEnabled);
    toast({
      title: isLegacyModeEnabled ? "Legacy Mode Disabled" : "Legacy Mode Enabled",
      description: isLegacyModeEnabled 
        ? "Your memories will no longer be shared automatically."
        : "Your selected memories will be shared with your trusted contacts based on your settings.",
    });
  };

  const handleContactSelect = (contactId: number) => {
    setSelectedContact(contactId);
    const contact = contactList.find(c => c.id === contactId);
    
    toast({
      title: "Contact Selected",
      description: `${contact?.name} will receive your legacy memories.`,
    });
  };

  const handleAddContact = () => {
    toast({
      title: "Add Contact",
      description: "Contact invitation feature coming soon.",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <User2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Private Legacy Mode</h1>
        </div>
        
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Memory Legacy Settings</h2>
                  <p className="text-muted-foreground">
                    Configure when and how your memories will be shared with loved ones.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="legacy-mode">Legacy Mode</Label>
                  <Switch id="legacy-mode" checked={isLegacyModeEnabled} onCheckedChange={handleEnableLegacyMode} />
                </div>
              </div>
              
              {isLegacyModeEnabled && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Inactivity Period</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your memories will be shared after this period of account inactivity
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">3 months</Button>
                        <Button variant="outline" className="flex-1">6 months</Button>
                        <Button className="flex-1">1 year</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Specific Date</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Or set a specific date when your memories will be shared
                      </p>
                      <Input type="date" />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Trusted Contacts</h3>
                      </div>
                      <Button size="sm" variant="outline" onClick={handleAddContact}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {contactList.map(contact => (
                        <div 
                          key={contact.id}
                          className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer ${
                            selectedContact === contact.id ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                          onClick={() => handleContactSelect(contact.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={contact.avatar} alt={contact.name} />
                              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.email}</p>
                            </div>
                          </div>
                          <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
                            {selectedContact === contact.id && (
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Privacy Protected</h3>
                <p className="text-muted-foreground text-sm">
                  Your memories remain completely private until the conditions you set are met.
                  You have full control over what is shared and with whom.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Verification System</h3>
                <p className="text-muted-foreground text-sm">
                  Trusted contacts must verify their identity before accessing your memories,
                  ensuring your legacy is only shared with your intended recipients.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Memory Selection</h3>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
          <p className="text-muted-foreground mb-4">
            Select which memories will be included in your legacy:
          </p>
          
          <div className="space-y-3">
            {["All memories", "Only memories tagged as 'Legacy'", "Custom selection"].map((option) => (
              <div key={option} className="flex items-center justify-between">
                <span>{option}</span>
                <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
                  {option === "All memories" && (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground italic">
              "The greatest legacy one can pass on to one's children and grandchildren is not money or material things accumulated in one's life, but rather a legacy of character and faith." — Billy Graham
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivateLegacyModePage;
