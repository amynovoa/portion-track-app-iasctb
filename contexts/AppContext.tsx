
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { storage } from '@/utils/storage';
import { User, DailyTargets, DailyLog } from '@/types';
import { getTodayDate } from '@/utils/dateUtils';
import { initializeNotifications } from '@/utils/notifications';

interface AppContextType {
  user: User | null;
  targets: DailyTargets | null;
  todayLog: DailyLog | null;
  allLogs: DailyLog[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateTodayLog: (group: keyof DailyLog, value: number) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  setTargets: (targets: DailyTargets) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to deduplicate logs by date, keeping the most recent entry
function deduplicateLogs(logs: DailyLog[]): DailyLog[] {
  console.log('=== Deduplicating logs ===');
  console.log('Input logs count:', logs.length);
  
  const logMap = new Map<string, DailyLog>();
  
  // Process logs in order, later entries will overwrite earlier ones with the same date
  logs.forEach(log => {
    if (logMap.has(log.date)) {
      console.log(`Found duplicate for date ${log.date}, keeping latest`);
    }
    logMap.set(log.date, log);
  });
  
  const deduplicated = Array.from(logMap.values());
  console.log('Output logs count:', deduplicated.length);
  
  return deduplicated;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [targets, setTargetsState] = useState<DailyTargets | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [allLogs, setAllLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    console.log('=== AppContext: Refreshing data ===');
    setIsLoading(true);
    
    try {
      const [userData, targetsData, logsData] = await Promise.all([
        storage.getUser(),
        storage.getDailyTargets(),
        storage.getDailyLogs(),
      ]);

      console.log('AppContext: User loaded:', userData);
      console.log('AppContext: Targets loaded:', targetsData);
      console.log('AppContext: Logs loaded:', logsData.length, 'logs');

      setUserState(userData);
      setTargetsState(targetsData);

      // Deduplicate logs to fix any existing duplicates
      const deduplicatedLogs = deduplicateLogs(logsData);
      
      // If we found duplicates, save the cleaned data back to storage
      if (deduplicatedLogs.length !== logsData.length) {
        console.log('AppContext: Found duplicates, saving cleaned logs to storage');
        await storage.setDailyLogs(deduplicatedLogs);
      }

      const today = getTodayDate();
      console.log('AppContext: Today date:', today);
      
      let todayLogData = deduplicatedLogs.find((l) => l.date === today);
      console.log('AppContext: Found today log:', todayLogData);

      if (!todayLogData) {
        console.log('AppContext: Creating new log for today');
        todayLogData = {
          date: today,
          protein: 0,
          veggies: 0,
          fruit: 0,
          wholeGrains: 0,
          fats: 0,
          nutsSeeds: 0,
          legumes: 0,
          water: 0,
          alcohol: 0,
          dairy: 0,
        };
        const updatedLogs = [...deduplicatedLogs, todayLogData];
        await storage.setDailyLogs(updatedLogs);
        setAllLogs(updatedLogs);
      } else {
        setAllLogs(deduplicatedLogs);
      }

      console.log('AppContext: Setting today log to:', todayLogData);
      setTodayLog(todayLogData);
    } catch (error) {
      console.error('AppContext: Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTodayLog = useCallback(async (group: keyof DailyLog, value: number) => {
    console.log(`=== AppContext: updateTodayLog called ===`);
    console.log(`Group: ${String(group)}, Value: ${value}`);
    
    if (!todayLog) {
      console.error('AppContext: Cannot update log - todayLog is null');
      return;
    }

    // Skip if it's the date field
    if (group === 'date') {
      console.log('AppContext: Skipping date field update');
      return;
    }

    const today = getTodayDate();
    console.log(`AppContext: Today date: ${today}`);
    
    // Create updated log with new value
    const updatedLog: DailyLog = { 
      ...todayLog, 
      [group]: value 
    };
    console.log('AppContext: Updated log object:', updatedLog);
    
    // Update todayLog state immediately for responsive UI
    setTodayLog(updatedLog);

    // Save to storage and update allLogs
    try {
      // Get current logs from state (not storage) to avoid race conditions
      const currentLogs = [...allLogs];
      console.log('AppContext: Current logs from state:', currentLogs.length);
      
      // Remove ALL logs with today's date (in case there are duplicates)
      const logsWithoutToday = currentLogs.filter((l) => l.date !== today);
      console.log(`AppContext: Removed ${currentLogs.length - logsWithoutToday.length} log(s) for today`);
      
      // Add the updated log
      const updatedLogs = [...logsWithoutToday, updatedLog];
      console.log('AppContext: New logs array length:', updatedLogs.length);
      
      // Deduplicate just to be safe
      const deduplicatedLogs = deduplicateLogs(updatedLogs);
      
      console.log('AppContext: Saving to AsyncStorage...');
      await storage.setDailyLogs(deduplicatedLogs);
      console.log('AppContext: Saved to AsyncStorage successfully');
      
      // Update allLogs state - this will trigger re-renders in all components
      console.log('AppContext: Updating allLogs state...');
      setAllLogs(deduplicatedLogs);
      console.log('AppContext: allLogs state updated');
      
      // Verify the save
      const verifyLogs = await storage.getDailyLogs();
      const verifyTodayLog = verifyLogs.find(l => l.date === today);
      console.log('AppContext: Verification - Today log after save:', verifyTodayLog);
      
      if (verifyTodayLog && verifyTodayLog[group] === value) {
        console.log('AppContext: ✓ Save verified successfully');
      } else {
        console.error('AppContext: ✗ Save verification failed!');
        console.error(`Expected ${String(group)} to be ${value}, but got ${verifyTodayLog ? verifyTodayLog[group] : 'undefined'}`);
      }
    } catch (error) {
      console.error('AppContext: Error saving log:', error);
      // Revert todayLog state on error
      setTodayLog(todayLog);
      throw error;
    }
  }, [todayLog, allLogs]);

  const setUser = useCallback(async (newUser: User) => {
    console.log('AppContext: Setting user:', newUser);
    await storage.setUser(newUser);
    setUserState(newUser);
    
    // Re-initialize notifications when user settings change
    await initializeNotifications();
  }, []);

  const setTargets = useCallback(async (newTargets: DailyTargets) => {
    console.log('AppContext: Setting targets:', newTargets);
    await storage.setDailyTargets(newTargets);
    setTargetsState(newTargets);
  }, []);

  // Load data on mount
  useEffect(() => {
    console.log('AppContext: Initial mount, loading data');
    refreshData();
  }, [refreshData]);

  // Initialize notifications after user data is loaded
  useEffect(() => {
    if (user) {
      console.log('AppContext: User loaded, initializing notifications');
      initializeNotifications();
    }
  }, [user]);

  // Check for daily reset every minute
  useEffect(() => {
    const checkDailyReset = async () => {
      if (!user || !todayLog) return;
      
      const today = getTodayDate();
      console.log('AppContext: Checking daily reset - today:', today, 'todayLog.date:', todayLog.date);
      
      // If the date has changed, refresh data to create a new log
      if (todayLog.date !== today) {
        console.log('AppContext: Date changed! Refreshing data to create new log');
        await refreshData();
      }
    };

    // Check immediately
    checkDailyReset();

    // Check every minute
    const interval = setInterval(checkDailyReset, 60000);

    return () => clearInterval(interval);
  }, [user, todayLog, refreshData]);

  const value: AppContextType = {
    user,
    targets,
    todayLog,
    allLogs,
    isLoading,
    refreshData,
    updateTodayLog,
    setUser,
    setTargets,
  };

  console.log('AppContext: Rendering with allLogs.length =', allLogs.length);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
