
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, User, Heart, MessageCircle } from "lucide-react";

const NotificationsPage = () => {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "friend_request",
      message: "John Doe sent you a friend request",
      time: "2 hours ago",
      icon: User,
      unread: true,
    },
    {
      id: 2,
      type: "like",
      message: "Sarah liked your post",
      time: "5 hours ago",
      icon: Heart,
      unread: true,
    },
    {
      id: 3,
      type: "comment",
      message: "Mike commented on your memory",
      time: "1 day ago",
      icon: MessageCircle,
      unread: false,
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your MEMORIA activity</p>
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <Card key={notification.id} className={`cursor-pointer hover:bg-secondary/50 transition-colors ${notification.unread ? 'border-primary/50' : ''}`}>
                  <CardContent className="flex items-center space-x-4 p-4">
                    <div className={`p-2 rounded-full ${notification.unread ? 'bg-primary/10' : 'bg-secondary'}`}>
                      <IconComponent className={`h-5 w-5 ${notification.unread ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.message}
                      </p>
                      <p className="text-sm text-muted-foreground">{notification.time}</p>
                    </div>
                    {notification.unread && (
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  No notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">You're all caught up! Check back later for new notifications.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
