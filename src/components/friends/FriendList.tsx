
import { useState, useEffect } from "react";
import FriendCard, { Friend } from "./FriendCard";
import { useAuthSession } from "@/hooks/useAuthSession";

interface FriendListProps {
  searchQuery: string;
}

const FriendList = ({ searchQuery }: FriendListProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const { user } = useAuthSession();

  // Mock friends data for now - replace with actual Supabase query when friend system is implemented
  const mockFriends: Friend[] = [
    {
      id: "1",
      name: "John Doe",
      status: "friends",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      id: "2",
      name: "Jane Smith",
      status: "requested",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
      id: "3",
      name: "Mike Johnson",
      status: "none",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
      id: "4",
      name: "Sarah Wilson",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?img=4"
    }
  ];

  useEffect(() => {
    // Filter friends based on search query
    const filteredFriends = mockFriends.filter(friend =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFriends(filteredFriends);
  }, [searchQuery]);

  const handleSendRequest = (friendId: string) => {
    setFriends(friends.map(friend =>
      friend.id === friendId ? { ...friend, status: "pending" } : friend
    ));
  };

  const handleAcceptRequest = (friendId: string) => {
    setFriends(friends.map(friend =>
      friend.id === friendId ? { ...friend, status: "friends" } : friend
    ));
  };

  const handleRejectRequest = (friendId: string) => {
    setFriends(friends.map(friend =>
      friend.id === friendId ? { ...friend, status: "none" } : friend
    ));
  };

  if (!user) {
    return <div>Please sign in to view friends.</div>;
  }

  return (
    <div className="space-y-4">
      {friends.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No friends found.</p>
        </div>
      ) : (
        friends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            onSendRequest={handleSendRequest}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
          />
        ))
      )}
    </div>
  );
};

export default FriendList;
