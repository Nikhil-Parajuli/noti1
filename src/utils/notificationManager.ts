import { storage } from './storage';
import { Notification } from '../types';

export const notificationManager = {
  async addNotification(notification: Partial<Notification>) {
    try {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: notification.type || 'governance',
        title: notification.title || '',
        description: notification.description || '',
        priority: notification.priority || 'medium'
      } as Notification;

      const existingNotifications = await storage.getLocal('notifications') || [];
      const updatedNotifications = [newNotification, ...existingNotifications];
      
      await storage.setLocal('notifications', updatedNotifications);

      // Show Chrome notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.description,
          icon: '/icons/icon128.png'
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.description,
              icon: '/icons/icon128.png'
            });
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Error adding notification:', error);
      return false;
    }
  }
};

export const addNewNotification = async (notification: Partial<Notification>) => {
  return notificationManager.addNotification(notification);
};