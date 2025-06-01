
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export interface Friend {
  id: string;
  name: string;
  status: "none" | "requested" | "friends" | "pending";
  avatar?: string;
}

interface FriendCardProps {
  friend: Friend;
  onSendRequest: (id: string) => void;
  onAcceptRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
}

const FriendCard = ({ friend, onSendRequest, onAcceptRequest, onRejectRequest }: FriendCardProps) => {
  const renderActionButton = () => {
    switch (friend.status) {
      case "none":
        return (
          <Button 
            onClick={() => onSendRequest(friend.id)}
            variant="outline"
            size="sm"
          >
            Add Friend
          </Button>
        );
      case "pending":
        return (
          <Button variant="outline" size="sm" disabled>
            Request Sent
          </Button>
        );
      case "requested":
        return (
          <div className="flex space-x-2">
            <Button 
              onClick={() => onAcceptRequest(friend.id)}
              variant="default"
              size="sm"
            >
              Accept
            </Button>
            <Button 
              onClick={() => onRejectRequest(friend.id)}
              variant="outline"
              size="sm"
            >
              Decline
            </Button>
          </div>
        );
      case "friends":
        return (
          <Button variant="outline" size="sm" disabled>
            Friends
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={friend.avatar} />
            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{friend.name}</p>
          </div>
        </div>
        {renderActionButton()}
      </CardContent>
    </Card>
  );
};

export default FriendCard;
