
import Layout from "@/components/layout/Layout";
import CreatePost from "@/components/post/CreatePost";
import PostFeed from "@/components/post/PostFeed";

const Index = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-primary">Your Feed</h1>
          <CreatePost />
          <PostFeed />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
