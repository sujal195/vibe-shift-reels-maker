
import { useEffect, useState } from "react";
import PostCard, { Post } from "./PostCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/hooks/useAuthSession";
import { samplePosts } from "@/data/samplePosts";

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthSession();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      try {
        if (!user) {
          // For non-authenticated users, just show sample posts
          setPosts(samplePosts);
          setLoading(false);
          return;
        }
        
        // Fetch real posts from Supabase
        const { data: postsData, error } = await supabase
          .from('posts')
          .select(`
            id, 
            content, 
            created_at, 
            user_id, 
            likes_count, 
            comments_count, 
            media_url, 
            media_type,
            privacy,
            profiles:user_id(id, display_name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          throw error;
        }
        
        if (postsData && postsData.length > 0) {
          // Map Supabase data to Post type
          const formattedPosts: Post[] = postsData.map((post) => ({
            id: post.id,
            content: post.content,
            author: {
              id: post.profiles.id,
              name: post.profiles.display_name || 'User',
              avatar: post.profiles.avatar_url,
            },
            createdAt: post.created_at,
            likes: post.likes_count || 0,
            comments: post.comments_count || 0,
            mediaType: post.media_type as "photo" | "voice" | undefined,
            mediaUrl: post.media_url,
            privacy: post.privacy as "public" | "friends" | "private",
          }));
          
          // Combine real and sample posts, with real posts first
          const combinedPosts = [...formattedPosts];
          
          // Add sample posts only if there are fewer than 10 real posts
          if (formattedPosts.length < 10) {
            // Ensure each sample post has a unique ID (prepend "sample-" to avoid conflicts)
            const samplePostsWithUniqueIds = samplePosts.map(post => ({
              ...post,
              id: `sample-${post.id}`
            }));
            
            combinedPosts.push(...samplePostsWithUniqueIds.slice(0, 10 - formattedPosts.length));
          }
          
          setPosts(combinedPosts);
        } else {
          // If no real posts, show sample posts
          setPosts(samplePosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Fallback to sample posts
        setPosts(samplePosts);
      }
      
      setLoading(false);
    };

    fetchPosts();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-border rounded-lg animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-secondary rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-secondary rounded w-1/4"></div>
                <div className="h-3 bg-secondary rounded w-1/6"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-secondary rounded w-full"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
