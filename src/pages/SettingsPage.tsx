
import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditProfileForm from "@/components/profile/EditProfileForm";
import { toast } from "@/components/ui/use-toast";

const SettingsPage = () => {
  const { user, signOut } = useAuthSession();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  
  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const initialProfileData = {
    name: user.user_metadata?.display_name || "",
    bio: user.user_metadata?.bio || "",
    avatar: user.user_metadata?.avatar_url,
    coverPhoto: user.user_metadata?.cover_url,
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <EditProfileForm 
                initialData={initialProfileData} 
                onSuccess={() => {
                  toast({
                    title: "Profile updated",
                    description: "Your profile has been updated successfully.",
                  });
                }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              <p className="text-muted-foreground mb-6">
                Configure how and when you receive notifications from MEMORIA.
              </p>
              <div className="space-y-4">
                {["New memories", "Comments", "Likes", "Friend requests", "Memory collaborations"].map((item) => (
                  <div key={item} className="flex justify-between items-center">
                    <span>{item}</span>
                    <Button variant="outline" size="sm" onClick={() => 
                      toast({
                        description: `${item} notifications toggled`,
                      })
                    }>
                      Enable
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
              <p className="text-muted-foreground mb-6">
                Control who can see your memories and how your data is used.
              </p>
              <div className="space-y-4">
                {["Profile visibility", "Memory visibility", "Tag permissions", "Search visibility"].map((item) => (
                  <div key={item} className="flex justify-between items-center">
                    <span>{item}</span>
                    <Button variant="outline" size="sm" onClick={() => 
                      toast({
                        description: `${item} setting updated`,
                      })
                    }>
                      Public
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <p className="text-muted-foreground mb-6">
                Manage your account preferences and sessions.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Email address</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Password</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => 
                      toast({
                        description: "Password change functionality coming soon",
                      })
                    }
                  >
                    Change password
                  </Button>
                </div>
                
                <div className="pt-6 border-t border-border">
                  <h3 className="font-medium text-destructive mb-4">Danger zone</h3>
                  <div className="space-y-4">
                    <Button 
                      variant="destructive" 
                      className="w-full sm:w-auto"
                      onClick={() => 
                        toast({
                          title: "Account deletion",
                          description: "Account deletion is not available yet",
                          variant: "destructive",
                        })
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete account
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
