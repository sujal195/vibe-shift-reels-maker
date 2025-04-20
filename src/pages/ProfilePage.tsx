
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Image, Mic } from "lucide-react";
import PostCard, { Post } from "@/components/post/PostCard";

// Mock data
const userProfile = {
  id: "current-user",
  name: "Jordan Casey",
  bio: "Digital creator and social media enthusiast",
  avatar: undefined,
  postsCount: 24,
  friendsCount: 156,
};

const userPosts: Post[] = [
  {
    id: "p1",
    content: "Working on some new music today! Can't wait to share it with everyone.",
    author: {
      id: userProfile.id,
      name: userProfile.name,
      avatar: userProfile.avatar,
    },
    createdAt: "2025-04-18T16:30:00",
    likes: 28,
    comments: 7,
    mediaType: "voice",
    mediaUrl: "https://assets.mixkit.co/sfx/preview/mixkit-guitar-string-tone-2326.mp3",
    privacy: "public",
  },
  {
    id: "p2",
    content: "Beautiful day at the park!",
    author: {
      id: userProfile.id,
      name: userProfile.name,
      avatar: userProfile.avatar,
    },
    createdAt: "2025-04-16T12:45:00",
    likes: 42,
    comments: 5,
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=2070&auto=format&fit=crop",
    privacy: "friends",
  },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<Post[]>(userPosts);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 relative">
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-3 right-3"
            >
              <Image className="h-4 w-4 mr-2" />
              Change Cover
            </Button>
          </div>
          
          {/* Profile Info */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between relative -mt-16 px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback className="text-4xl">{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="mt-4 md:mt-0 md:ml-4 mb-2">
                <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                <p className="text-muted-foreground">{userProfile.bio}</p>
                <div className="flex gap-4 mt-2">
                  <div>
                    <span className="font-semibold">{userProfile.postsCount}</span>{" "}
                    <span className="text-muted-foreground">posts</span>
                  </div>
                  <div>
                    <span className="font-semibold">{userProfile.friendsCount}</span>{" "}
                    <span className="text-muted-foreground">friends</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
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
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
            <TabsContent value="photos" className="mt-6 space-y-4">
              {posts
                .filter(post => post.mediaType === "photo")
                .map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
            </TabsContent>
            <TabsContent value="voice" className="mt-6 space-y-4">
              {posts
                .filter(post => post.mediaType === "voice")
                .map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
