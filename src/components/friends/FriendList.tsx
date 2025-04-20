
import { useState } from "react";
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
];

const FriendList = () => {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);

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
  const friendRequests = friends.filter(f => f.status === "requested");

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

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">People You May Know</h2>
        <div className="space-y-3">
          {friends
            .filter(f => f.status !== "requested")
            .map(friend => (
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
    </div>
  );
};

export default FriendList;
