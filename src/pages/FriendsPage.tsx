
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import FriendList from "@/components/friends/FriendList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const FriendsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Friends</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for friends..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <FriendList searchQuery={searchQuery} />
      </div>
    </Layout>
  );
};

export default FriendsPage;
