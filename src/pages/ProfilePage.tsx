
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Image } from "lucide-react";
import PostCard, { Post } from "@/components/post/PostCard";
import { useAuthSession } from "@/hooks/useAuthSession";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditProfileForm from "@/components/profile/EditProfileForm";
import { safeQuery } from "@/utils/supabaseUtils";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    avatar: "",
    coverPhoto: "",
    postsCount: 0,
    friendsCount: 0,
  });
  
  const { user, isLoading } = useAuthSession();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchProfileData();
      fetchUserPosts();
    }
  }, [user, isLoading, navigate]);

  const fetchProfileData = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      // Get post count
      let postsCount = 0;
      try {
        const postsApi = await safeQuery('posts');
        const { count } = await postsApi
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        postsCount = count || 0;
      } catch (e) {
        console.error("Error counting posts:", e);
      }

      setProfileData({
        name: data?.display_name || user.user_metadata?.display_name || "User",
        bio: data?.bio || "No bio available",
        avatar: data?.avatar_url || undefined,
        coverPhoto: data?.cover_url || undefined,
        postsCount,
        friendsCount: 0 // Placeholder for future friends feature
      });
    } catch (err) {
      console.error("Error in profile fetch:", err);
    }
  };

  const fetchUserPosts = async () => {
    try {
      if (!user) return;
      
      try {
        const postsApi = await safeQuery('posts');
        const { data: postsData, error } = await postsApi
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        if (!postsData) {
          setPosts([]);
          return;
        }

        // Transform posts data into Post type
        const formattedPosts: Post[] = postsData.map((post: any) => ({
          id: post.id || '',
          content: post.content || '',
          author: {
            id: user.id,
            name: profileData.name || user.email?.split('@')[0] || 'User',
            avatar: profileData.avatar,
          },
          createdAt: post.created_at || new Date().toISOString(),
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          mediaType: post.media_type as "photo" | "voice" | undefined,
          mediaUrl: post.media_url,
          privacy: post.privacy as "public" | "friends" | "private",
        }));

        setPosts(formattedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    } catch (err) {
      console.error("Error in posts fetch:", err);
    }
  };

  const handleProfileUpdate = () => {
    fetchProfileData();
    fetchUserPosts();
    setIsEditDialogOpen(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  // For rendering different media types in tabs
  const photosPosts = posts.filter(post => post.mediaType === "photo");
  const voicePosts = posts.filter(post => post.mediaType === "voice");

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Cover Photo */}
        <div 
          className="h-48 rounded-lg relative bg-gradient-to-r from-violet-500 to-purple-500"
          style={profileData.coverPhoto ? { backgroundImage: `url(${profileData.coverPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-3 right-3"
              >
                <Image className="h-4 w-4 mr-2" />
                Change Cover
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <EditProfileForm 
                onSuccess={handleProfileUpdate} 
                initialData={profileData}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Profile Info */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between relative -mt-16 px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={profileData.avatar} />
              <AvatarFallback className="text-4xl">{profileData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-4 md:mt-0 md:ml-4 mb-2">
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              <p className="text-muted-foreground">{profileData.bio}</p>
              <div className="flex gap-4 mt-2">
                <div>
                  <span className="font-semibold">{profileData.postsCount}</span>{" "}
                  <span className="text-muted-foreground">posts</span>
                </div>
                <div>
                  <span className="font-semibold">{profileData.friendsCount}</span>{" "}
                  <span className="text-muted-foreground">friends</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="posts">All Posts</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="voice">Voice Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6 space-y-4">
              {posts.length > 0 ? (
                posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No posts yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="photos" className="mt-6 space-y-4">
              {photosPosts.length > 0 ? (
                photosPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No photo posts yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="voice" className="mt-6 space-y-4">
              {voicePosts.length > 0 ? (
                voicePosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No voice posts yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
