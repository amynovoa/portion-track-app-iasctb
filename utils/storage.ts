
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, DailyTargets, DailyLog, MetricWeight } from '@/types';

const KEYS = {
  USER: '@portion_track_user',
  DAILY_TARGETS: '@portion_track_daily_targets',
  DAILY_LOGS: '@portion_track_daily_logs',
  WEIGHT_METRICS: '@portion_track_weight_metrics',
  ONBOARDING_COMPLETE: '@portion_track_onboarding_complete',
};

export const storage = {
  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
    }
  },

  async getDailyTargets(): Promise<DailyTargets | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DAILY_TARGETS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting daily targets:', error);
      return null;
    }
  },

  async setDailyTargets(targets: DailyTargets): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.DAILY_TARGETS, JSON.stringify(targets));
    } catch (error) {
      console.error('Error setting daily targets:', error);
    }
  },

  async getDailyLogs(): Promise<DailyLog[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DAILY_LOGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting daily logs:', error);
      return [];
    }
  },

  async setDailyLogs(logs: DailyLog[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.DAILY_LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Error setting daily logs:', error);
    }
  },

  async getWeightMetrics(): Promise<MetricWeight[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.WEIGHT_METRICS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting weight metrics:', error);
      return [];
    }
  },

  async setWeightMetrics(metrics: MetricWeight[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.WEIGHT_METRICS, JSON.stringify(metrics));
    } catch (error) {
      console.error('Error setting weight metrics:', error);
    }
  },

  async isOnboardingComplete(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
      return data === 'true';
    } catch (error) {
      console.error('Error checking onboarding:', error);
      return false;
    }
  },

  async setOnboardingComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, 'true');
    } catch (error) {
      console.error('Error setting onboarding complete:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
