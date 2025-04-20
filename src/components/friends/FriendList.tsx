
import { useState, useMemo } from "react";
import FriendCard, { Friend } from "./FriendCard";

// Mock data - in a real app this would come from API/backend
const initialFriends: Friend[] = [
  {
    id: "1",
    name: "Jamie Smith",
    status: "none",
  },
  {
    id: "2",
    name: "Alex Johnson",
    status: "requested",
  },
  {
    id: "3",
    name: "Morgan Lee",
    status: "friends",
  },
  {
    id: "4",
    name: "Taylor Kim",
    status: "pending",
  },
  {
    id: "5",
    name: "Jordan Roberts",
    status: "none",
  },
  {
    id: "6",
    name: "Casey Brown",
    status: "none",
  },
  {
    id: "7",
    name: "Riley Wilson",
    status: "none",
  },
  {
    id: "8",
    name: "Avery Garcia",
    status: "requested",
  }
];

interface FriendListProps {
  searchQuery?: string;
}

const FriendList = ({ searchQuery = "" }: FriendListProps) => {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);

  // Filter friends based on search query
  const filteredFriends = useMemo(() => {
    if (!searchQuery) return friends;
    return friends.filter(friend => 
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  const handleSendRequest = (id: string) => {
    // In a real app, this would make an API call
    console.log(`Friend request sent to user with id: ${id}`);
    // Update local state to reflect changes
    setFriends(friends.map(f => 
      f.id === id ? { ...f, status: "pending" } : f
    ));
  };

  const handleAcceptRequest = (id: string) => {
    // In a real app, this would make an API call
    console.log(`Friend request accepted for user with id: ${id}`);
    // Update local state to reflect changes
    setFriends(friends.map(f => 
      f.id === id ? { ...f, status: "friends" } : f
    ));
  };

  const handleRejectRequest = (id: string) => {
    // In a real app, this would make an API call
    console.log(`Friend request rejected for user with id: ${id}`);
    // Update local state to reflect changes
    setFriends(friends.map(f => 
      f.id === id ? { ...f, status: "none" } : f
    ));
  };

  // Filter friends by those who have sent requests
  const friendRequests = filteredFriends.filter(f => f.status === "requested");
  
  // Filter friends by existing friends
  const existingFriends = filteredFriends.filter(f => f.status === "friends");
  
  // Filter friends by those who are neither friends nor have sent requests
  const suggestedFriends = filteredFriends.filter(f => f.status === "none");

  // Pending sent requests
  const pendingRequests = filteredFriends.filter(f => f.status === "pending");

  return (
    <div className="space-y-6">
      {friendRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Friend Requests</h2>
          <div className="space-y-3">
            {friendRequests.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onSendRequest={handleSendRequest}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
              />
            ))}
          </div>
        </div>
      )}

      {existingFriends.length > 0 && searchQuery && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Friends</h2>
          <div className="space-y-3">
            {existingFriends.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onSendRequest={handleSendRequest}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
              />
            ))}
          </div>
        </div>
      )}

      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Requests</h2>
          <div className="space-y-3">
            {pendingRequests.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onSendRequest={handleSendRequest}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
              />
            ))}
          </div>
        </div>
      )}

      {suggestedFriends.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">People You May Know</h2>
          <div className="space-y-3">
            {suggestedFriends.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onSendRequest={handleSendRequest}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
              />
            ))}
          </div>
        </div>
      )}

      {filteredFriends.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default FriendList;
