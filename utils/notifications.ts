
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { storage } from './storage';
import { getTodayDate } from './dateUtils';

// Set the notification handler to show notifications when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Notification identifier for the daily reminder
const DAILY_REMINDER_ID = 'daily-portion-reminder';

/**
 * Request notification permissions from the user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    console.log('Requesting notification permissions...');
    
    // On Android, we need to create a notification channel first
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminders', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#B93822',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions denied');
      return false;
    }

    console.log('Notification permissions granted');
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Check if user has logged any portions today
 */
async function hasLoggedToday(): Promise<boolean> {
  try {
    const logs = await storage.getDailyLogs();
    const today = getTodayDate();
    const todayLog = logs.find(log => log.date === today);
    
    if (!todayLog) return false;
    
    // Check if any food group has been logged (excluding date field)
    const hasAnyLog = Object.entries(todayLog).some(([key, value]) => {
      return key !== 'date' && typeof value === 'number' && value > 0;
    });
    
    console.log('Has logged today:', hasAnyLog);
    return hasAnyLog;
  } catch (error) {
    console.error('Error checking if logged today:', error);
    return false;
  }
}

/**
 * Schedule the daily 1 PM reminder notification
 */
export async function scheduleDailyReminder(): Promise<void> {
  try {
    console.log('Scheduling daily 1 PM reminder...');
    
    // Cancel any existing reminders first
    await cancelDailyReminder();
    
    // Get the next 1 PM
    const now = new Date();
    const trigger = new Date();
    trigger.setHours(13, 0, 0, 0); // 1 PM
    
    // If it's already past 1 PM today, schedule for tomorrow
    if (trigger.getTime() <= now.getTime()) {
      trigger.setDate(trigger.getDate() + 1);
    }
    
    console.log('Next reminder scheduled for:', trigger.toLocaleString());
    
    // Random message selection
    const messages = [
      'Time to check in with your portions today.',
      'A quick reminder: update your portions when you have a moment.',
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_REMINDER_ID,
      content: {
        title: 'Portion Track',
        body: randomMessage,
        data: { 
          screen: 'today',
          type: 'daily-reminder',
        },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 13,
        minute: 0,
        repeats: true,
      },
    });
    
    console.log('Daily reminder scheduled successfully');
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
    throw error;
  }
}

/**
 * Cancel the daily reminder notification
 */
export async function cancelDailyReminder(): Promise<void> {
  try {
    console.log('Canceling daily reminder...');
    
    // Get all scheduled notifications
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Found scheduled notifications:', scheduledNotifications.length);
    
    // Cancel the daily reminder if it exists
    const dailyReminder = scheduledNotifications.find(
      notif => notif.identifier === DAILY_REMINDER_ID
    );
    
    if (dailyReminder) {
      await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
      console.log('Daily reminder canceled');
    } else {
      console.log('No daily reminder found to cancel');
    }
  } catch (error) {
    console.error('Error canceling daily reminder:', error);
  }
}

/**
 * Check if reminders should be sent (only if nothing logged by 1 PM)
 * This is called by the notification handler to decide whether to show the notification
 */
export async function shouldShowReminder(): Promise<boolean> {
  try {
    const user = await storage.getUser();
    
    // Don't show if reminders are disabled
    if (!user || !user.remindersOn) {
      console.log('Reminders are disabled');
      return false;
    }
    
    // Check if user has already logged today
    const hasLogged = await hasLoggedToday();
    
    if (hasLogged) {
      console.log('User has already logged today, skipping reminder');
      return false;
    }
    
    console.log('User has not logged today, showing reminder');
    return true;
  } catch (error) {
    console.error('Error checking if should show reminder:', error);
    return false;
  }
}

/**
 * Setup notification response handler to navigate to Today screen when tapped
 */
export function setupNotificationResponseHandler(navigationCallback: (screen: string) => void) {
  console.log('Setting up notification response handler');
  
  // Handle notification tap when app is in foreground or background
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification tapped:', response);
    const screen = response.notification.request.content.data?.screen;
    
    if (screen) {
      console.log('Navigating to screen:', screen);
      navigationCallback(screen);
    }
  });
  
  return subscription;
}

/**
 * Get the last notification response (for when app is opened from killed state)
 */
export async function getLastNotificationResponse() {
  try {
    const response = await Notifications.getLastNotificationResponseAsync();
    console.log('Last notification response:', response);
    return response;
  } catch (error) {
    console.error('Error getting last notification response:', error);
    return null;
  }
}

/**
 * Initialize notifications - request permissions and schedule if enabled
 */
export async function initializeNotifications(): Promise<void> {
  try {
    console.log('Initializing notifications...');
    
    const user = await storage.getUser();
    
    if (!user) {
      console.log('No user found, skipping notification initialization');
      return;
    }
    
    if (user.remindersOn) {
      console.log('Reminders are enabled, requesting permissions...');
      const hasPermission = await requestNotificationPermissions();
      
      if (hasPermission) {
        console.log('Permissions granted, scheduling daily reminder...');
        await scheduleDailyReminder();
      } else {
        console.log('Permissions denied, cannot schedule reminders');
        // Update user settings to reflect that reminders couldn't be enabled
        await storage.setUser({ ...user, remindersOn: false });
      }
    } else {
      console.log('Reminders are disabled, ensuring no scheduled notifications');
      await cancelDailyReminder();
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
}
