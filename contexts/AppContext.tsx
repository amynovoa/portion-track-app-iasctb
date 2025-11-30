
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { storage } from '@/utils/storage';
import { User, DailyTargets, DailyLog } from '@/types';
import { getTodayDate, shouldResetLog } from '@/utils/dateUtils';

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
      setAllLogs(logsData);

      const today = getTodayDate();
      console.log('AppContext: Today date:', today);
      
      let todayLogData = logsData.find((l) => l.date === today);
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
        const updatedLogs = [...logsData, todayLogData];
        await storage.setDailyLogs(updatedLogs);
        setAllLogs(updatedLogs);
      } else if (userData && shouldResetLog(todayLogData.date, userData.resetTime)) {
        console.log('AppContext: Resetting log for new day');
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
        const updatedLogs = logsData.filter((l) => l.date !== today);
        updatedLogs.push(todayLogData);
        await storage.setDailyLogs(updatedLogs);
        setAllLogs(updatedLogs);
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
    if (!todayLog) {
      console.error('AppContext: Cannot update log - todayLog is null');
      return;
    }

    // Skip if it's the date field
    if (group === 'date') {
      return;
    }

    const today = getTodayDate();
    console.log(`AppContext: Updating ${group} to ${value} for date ${today}`);
    
    const updatedLog: DailyLog = { ...todayLog, [group]: value };
    console.log('AppContext: Updated log object:', updatedLog);
    
    // Update state immediately for responsive UI
    setTodayLog(updatedLog);

    // Save to storage
    try {
      const currentLogs = await storage.getDailyLogs();
      console.log('AppContext: Current logs in storage:', currentLogs.length);
      
      const logIndex = currentLogs.findIndex((l) => l.date === today);
      
      let updatedLogs: DailyLog[];
      if (logIndex >= 0) {
        console.log(`AppContext: Updating existing log at index ${logIndex}`);
        updatedLogs = [...currentLogs];
        updatedLogs[logIndex] = updatedLog;
      } else {
        console.log('AppContext: Adding new log to array');
        updatedLogs = [...currentLogs, updatedLog];
      }
      
      console.log('AppContext: Saving updated logs');
      await storage.setDailyLogs(updatedLogs);
      
      // Create a new array reference to ensure React detects the change
      setAllLogs([...updatedLogs]);
      
      // Verify the save
      const verifyLogs = await storage.getDailyLogs();
      const verifyTodayLog = verifyLogs.find(l => l.date === today);
      console.log('AppContext: Verification - Today log after save:', verifyTodayLog);
      
      if (verifyTodayLog && verifyTodayLog[group] === value) {
        console.log('AppContext: ✓ Save verified successfully');
      } else {
        console.error('AppContext: ✗ Save verification failed!');
      }
    } catch (error) {
      console.error('AppContext: Error saving log:', error);
      throw error;
    }
  }, [todayLog]);

  const setUser = useCallback(async (newUser: User) => {
    console.log('AppContext: Setting user:', newUser);
    await storage.setUser(newUser);
    setUserState(newUser);
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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
