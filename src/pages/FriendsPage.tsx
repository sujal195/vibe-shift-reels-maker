
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import FriendList from "@/components/friends/FriendList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const FriendsPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app with backend, this would trigger a search API call
    console.log("Searching for:", searchQuery);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-primary">Friends</h1>
          
          {/* Search within Friends Page */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for friends by name..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </form>
          
          <FriendList searchQuery={searchQuery} />
        </div>
      </div>
    </Layout>
  );
};

export default FriendsPage;
