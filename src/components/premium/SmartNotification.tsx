
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { SmartNotification as SmartNotificationType, recordNotificationShown } from "@/utils/premiumUtils";

interface SmartNotificationProps {
  notification: SmartNotificationType;
  onDismiss: (id: string) => void;
}

const SmartNotification = ({ notification, onDismiss }: SmartNotificationProps) => {
  const { user } = useAuthSession();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Record that this notification was shown to the user
    if (user && notification) {
      recordNotificationShown(user.id, notification.id);
    }
  }, [user, notification]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300); // Allow animation to complete
  }, [notification.id, onDismiss]);

  if (!isVisible) return null;

  return (
    <Card className="relative bg-secondary border-primary/20 shadow-md mb-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardContent className="pt-6 pb-4">
        <CardTitle className="text-md flex items-center gap-2">
          {notification.title}
        </CardTitle>
        <CardDescription className="mt-1">
          {notification.message}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end">
        <Button variant="link" size="sm" className="text-primary" onClick={handleDismiss}>
          Learn more
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SmartNotification;
