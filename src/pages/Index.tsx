
import Layout from "@/components/layout/Layout";
import CreatePost from "@/components/post/CreatePost";
import PostFeed from "@/components/post/PostFeed";
import { Link } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";

const Index = () => {
  const { user, isLoading } = useAuthSession();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-primary">Your Feed</h1>
          {!isLoading && !user && (
            <div className="p-4 bg-secondary rounded mb-6 text-center">
              <span className="mr-2">You must be signed in to use MEMORIA.</span>
              <Link to="/auth" className="text-primary underline ml-1">
                Go to Sign In / Sign Up
              </Link>
            </div>
          )}
          <CreatePost />
          <PostFeed />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
