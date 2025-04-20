
import { useState } from "react";
import PostCard, { Post } from "./PostCard";

// Mock data - in a real app this would come from API/backend
const initialPosts: Post[] = [
  {
    id: "1",
    content: "Just recorded a new song! Check out my latest voice post 🎵",
    author: {
      id: "u1",
      name: "Alex Johnson",
      avatar: undefined,
    },
    createdAt: "2025-04-19T10:30:00",
    likes: 24,
    comments: 5,
    mediaType: "voice",
    mediaUrl: "https://assets.mixkit.co/sfx/preview/mixkit-guitar-string-tone-2326.mp3",
    privacy: "public",
  },
  {
    id: "2",
    content: "Enjoying the sunset at the beach today!",
    author: {
      id: "u2",
      name: "Jamie Smith",
      avatar: undefined,
    },
    createdAt: "2025-04-19T18:15:00",
    likes: 42,
    comments: 8,
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    privacy: "friends",
  },
  {
    id: "3",
    content: "Just thinking about the future of social media and how we can make it more authentic. What do you all think?",
    author: {
      id: "u3",
      name: "Taylor Kim",
      avatar: undefined,
    },
    createdAt: "2025-04-19T14:45:00",
    likes: 12,
    comments: 7,
    privacy: "public",
  },
];

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
