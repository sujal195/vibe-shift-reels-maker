
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Heart, MessageCircle, Bell } from "lucide-react";

interface Notification {
  id: string;
  type: "friend_request" | "like" | "comment" | "mention";
  content: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "friend_request",
    content: "sent you a friend request",
    user: {
      id: "u1",
      name: "Alex Johnson",
    },
    timestamp: "2025-04-19T14:30:00",
    read: false,
  },
  {
    id: "n2",
    type: "like",
    content: "liked your post",
    user: {
      id: "u2",
      name: "Jamie Smith",
    },
    timestamp: "2025-04-19T12:15:00",
    read: false,
  },
  {
    id: "n3",
    type: "comment",
    content: "commented on your post: \"That's awesome!\"",
    user: {
      id: "u3",
      name: "Taylor Kim",
    },
    timestamp: "2025-04-18T18:45:00",
    read: true,
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "friend_request":
        return <UserPlus className="h-4 w-4" />;
      case "like":
        return <Heart className="h-4 w-4" />;
      case "comment":
      case "mention":
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    // Simple formatter - in a real app, use a library like date-fns
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">Notifications</h1>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read ? "border-border bg-card" : "border-primary bg-card shadow"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{notification.user.name}</span>
                        <span className="text-muted-foreground text-sm">{notification.content}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getIcon(notification.type)}
                          <span>{notification.type.replace("_", " ")}</span>
                        </div>
                        <span>•</span>
                        <span>{formatTimestamp(notification.timestamp)}</span>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
