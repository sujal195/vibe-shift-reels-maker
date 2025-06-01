
import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { useAuthSession } from "@/hooks/useAuthSession";
import { fetchUserPosts } from "@/utils/supabaseUtils";

export interface Post {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  privacy: string;
  likes_count: number | null;
  comments_count: number | null;
  created_at: string;
  updated_at: string;
}

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthSession();

  useEffect(() => {
    const loadPosts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userPosts = await fetchUserPosts(user.id);
        setPosts(userPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-secondary rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to view posts.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No memories yet. Create your first post to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
