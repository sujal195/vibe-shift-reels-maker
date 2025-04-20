
import Layout from "@/components/layout/Layout";
import FriendList from "@/components/friends/FriendList";

const FriendsPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-primary">Friends</h1>
          <FriendList />
        </div>
      </div>
    </Layout>
  );
};

export default FriendsPage;
