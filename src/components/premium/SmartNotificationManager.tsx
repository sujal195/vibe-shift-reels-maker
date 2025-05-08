
import { useState, useEffect, useRef } from 'react';
import { useAuthSession } from "@/hooks/useAuthSession";
import { fetchSmartNotifications, SmartNotification as SmartNotificationType } from "@/utils/premiumUtils";
import SmartNotification from './SmartNotification';

const SmartNotificationManager = () => {
  const { user } = useAuthSession();
  const [notifications, setNotifications] = useState<SmartNotificationType[]>([]);
  const [currentNotification, setCurrentNotification] = useState<SmartNotificationType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [lastNotificationTime, setLastNotificationTime] = useState<number | null>(null);
  const [notificationsShown, setNotificationsShown] = useState<Set<string>>(new Set());
  const notificationsRef = useRef<SmartNotificationType[]>([]);
  const dailyNotificationsShownRef = useRef<number>(0);

  // Load notifications when user is authenticated
  useEffect(() => {
    if (user) {
      fetchSmartNotifications().then(data => {
        setNotifications(data);
        notificationsRef.current = data;
      });
    }
  }, [user]);

  // Handle scroll events to count and potentially show notifications
  useEffect(() => {
    const handleScroll = () => {
      if (!user || notifications.length === 0 || currentNotification) return;

      // Increment scroll count
      setScrollCount(prev => {
        const newCount = prev + 1;
        
        // Check if we should show a notification after 4 scrolls
        if (newCount >= 4 && !isVisible) {
          // Check time since last notification (2-3 minutes or 120,000-180,000 ms)
          const now = Date.now();
          if (!lastNotificationTime || now - lastNotificationTime > 120000) {
            // Check if we've shown less than 3 notifications today
            if (dailyNotificationsShownRef.current < 3) {
              showRandomNotification();
            }
          }
        }
        
        return newCount;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, notifications, currentNotification, isVisible, lastNotificationTime]);

  // Show initial notification after 10-15 seconds
  useEffect(() => {
    if (user && notifications.length > 0 && !currentNotification && dailyNotificationsShownRef.current === 0) {
      const timer = setTimeout(() => {
        showRandomNotification();
      }, 10000 + Math.random() * 5000); // 10-15 seconds
      
      return () => clearTimeout(timer);
    }
  }, [user, notifications, currentNotification]);

  const showRandomNotification = () => {
    // Filter out notifications that have been shown already in this session
    const availableNotifications = notificationsRef.current.filter(
      n => !notificationsShown.has(n.id)
    );
    
    if (availableNotifications.length === 0) {
      // If all notifications have been shown, reset and use all of them
      setNotificationsShown(new Set());
      if (notificationsRef.current.length > 0) {
        const randomIndex = Math.floor(Math.random() * notificationsRef.current.length);
        setCurrentNotification(notificationsRef.current[randomIndex]);
        setIsVisible(true);
        setLastNotificationTime(Date.now());
        dailyNotificationsShownRef.current += 1;
      }
    } else {
      // Select a random notification that hasn't been shown yet
      const randomIndex = Math.floor(Math.random() * availableNotifications.length);
      setCurrentNotification(availableNotifications[randomIndex]);
      setIsVisible(true);
      setLastNotificationTime(Date.now());
      dailyNotificationsShownRef.current += 1;
    }
  };

  const handleDismiss = (id: string) => {
    setIsVisible(false);
    setCurrentNotification(null);
    setScrollCount(0);
    setNotificationsShown(prev => new Set([...prev, id]));
  };

  if (!isVisible || !currentNotification) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <SmartNotification 
        notification={currentNotification} 
        onDismiss={handleDismiss}
      />
    </div>
  );
};

export default SmartNotificationManager;
