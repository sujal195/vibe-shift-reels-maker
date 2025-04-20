
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Check, X } from "lucide-react";

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: "none" | "pending" | "requested" | "friends";
}

interface FriendCardProps {
  friend: Friend;
  onSendRequest: (id: string) => void;
  onAcceptRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
}

const FriendCard = ({ 
  friend, 
  onSendRequest, 
  onAcceptRequest, 
  onRejectRequest 
}: FriendCardProps) => {
  const [status, setStatus] = useState<Friend["status"]>(friend.status);

  const handleSendRequest = () => {
    setStatus("pending");
    onSendRequest(friend.id);
  };

  const handleAcceptRequest = () => {
    setStatus("friends");
    onAcceptRequest(friend.id);
  };

  const handleRejectRequest = () => {
    setStatus("none");
    onRejectRequest(friend.id);
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
          {friend.avatar ? (
            <img 
              src={friend.avatar} 
              alt={friend.name} 
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-lg font-medium text-foreground">
              {friend.name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-medium text-foreground">{friend.name}</h3>
          {status === "friends" && (
            <p className="text-sm text-muted-foreground">Friends</p>
          )}
          {status === "pending" && (
            <p className="text-sm text-muted-foreground">Request sent</p>
          )}
          {status === "requested" && (
            <p className="text-sm text-muted-foreground">Wants to connect</p>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        {status === "none" && (
          <Button onClick={handleSendRequest} variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Friend
          </Button>
        )}

        {status === "requested" && (
          <>
            <Button 
              onClick={handleAcceptRequest} 
              variant="default" 
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Check className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button 
              onClick={handleRejectRequest} 
              variant="outline" 
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </>
        )}

        {status === "pending" && (
          <Button 
            variant="outline" 
            size="sm" 
            disabled
          >
            Pending
          </Button>
        )}
      </div>
    </div>
  );
};

export default FriendCard;
