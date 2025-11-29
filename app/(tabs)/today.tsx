
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, commonStyles } from '@/styles/commonStyles';
import HealthyOptionsSheet from '@/components/HealthyOptionsSheet';
import { storage } from '@/utils/storage';
import { DailyLog, DailyTargets, FoodGroup, User } from '@/types';
import { getTodayDate, shouldResetLog } from '@/utils/dateUtils';

const foodGroups: { key: FoodGroup; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: 'protein', label: 'Protein', icon: 'food-drumstick' },
  { key: 'veggies', label: 'Veggies', icon: 'leaf' },
  { key: 'fruit', label: 'Fruit', icon: 'food-apple' },
  { key: 'wholeGrains', label: 'Whole Grains', icon: 'barley' },
  { key: 'fats', label: 'Healthy Fats', icon: 'water' },
  { key: 'nutsSeeds', label: 'Nuts & Seeds', icon: 'peanut' },
  { key: 'legumes', label: 'Legumes', icon: 'seed' },
  { key: 'dairy', label: 'Dairy', icon: 'cheese' },
  { key: 'water', label: 'Water', icon: 'cup-water' },
  { key: 'alcohol', label: 'Alcohol', icon: 'glass-wine' },
];

export default function TodayScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [targets, setTargets] = useState<DailyTargets | null>(null);
  const [log, setLog] = useState<DailyLog | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<FoodGroup | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const loadData = async () => {
    console.log('Loading data for Today screen...');
    const userData = await storage.getUser();
    const targetsData = await storage.getDailyTargets();
    const logs = await storage.getDailyLogs();

    setUser(userData);
    setTargets(targetsData);

    const today = getTodayDate();
    let todayLog = logs.find((l) => l.date === today);

    console.log('Today date:', today);
    console.log('Found today log:', todayLog);

    if (!todayLog) {
      console.log('Creating new log for today');
      todayLog = {
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
      await storage.setDailyLogs([...logs, todayLog]);
    } else if (userData && shouldResetLog(todayLog.date, userData.resetTime)) {
      console.log('Resetting log for new day');
      todayLog = {
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
      const updatedLogs = logs.filter((l) => l.date !== today);
      await storage.setDailyLogs([...updatedLogs, todayLog]);
    }

    console.log('Setting log state:', todayLog);
    setLog(todayLog);
  };

  useFocusEffect(
    useCallback(() => {
      console.log('Today screen focused, loading data...');
      loadData();
    }, [])
  );

  const updateLog = async (group: FoodGroup, value: number) => {
    if (!log || !targets) {
      console.log('Cannot update log: log or targets is null');
      return;
    }

    console.log(`Updating ${group} to ${value}`);
    const updatedLog = { ...log, [group]: value };
    
    // Update state immediately
    setLog(updatedLog);

    // Save to storage
    try {
      const logs = await storage.getDailyLogs();
      const today = getTodayDate();
      
      // Find and update today's log, or add it if it doesn't exist
      const logIndex = logs.findIndex((l) => l.date === today);
      
      if (logIndex >= 0) {
        logs[logIndex] = updatedLog;
      } else {
        logs.push(updatedLog);
      }
      
      await storage.setDailyLogs(logs);
      console.log('Log saved successfully:', updatedLog);
    } catch (error) {
      console.error('Error saving log:', error);
    }
  };

  const handleIncrement = (group: FoodGroup) => {
    if (!log || !targets) return;

    // Hard cap alcohol at 2 portions per day
    if (group === 'alcohol' && log.alcohol >= 2) {
      Alert.alert(
        'Daily Limit Reached',
        'Daily alcohol limit reached (2/2). Adjust in Settings if needed.',
        [{ text: 'OK' }]
      );
      return;
    }

    updateLog(group, log[group] + 1);
  };

  const handleDecrement = (group: FoodGroup) => {
    if (!log) return;
    if (log[group] > 0) {
      updateLog(group, log[group] - 1);
    }
  };

  const handleInfo = (group: FoodGroup) => {
    setSelectedGroup(group);
    setSheetVisible(true);
  };

  if (!user || !targets || !log) {
    return (
      <View style={[commonStyles.container, styles.loadingContainer]}>
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/c120b509-3f86-4f37-80ee-1220bafc3458.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.headerTitle}>Today&apos;s Portions</Text>
        <Text style={styles.headerDate}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {foodGroups.map((group, index) => {
          const current = log[group.key];
          // For alcohol, always show max of 2 regardless of target setting
          const target = group.key === 'alcohol' ? 2 : targets[group.key];
          const isOverTarget = current > target;
          const progress = target > 0 ? (current / target) * 100 : 0;

          return (
            <View key={index} style={[styles.row, isOverTarget && styles.rowOverTarget]}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={group.icon}
                  size={28}
                  color={colors.primary}
                />
              </View>

              <View style={styles.rowContent}>
                <View style={styles.rowHeader}>
                  <Text style={styles.rowLabel}>{group.label}</Text>
                  <TouchableOpacity onPress={() => handleInfo(group.key)} style={styles.infoButton}>
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: isOverTarget ? colors.warning : colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.countText}>
                    {current} / {target}
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => handleDecrement(group.key)}
                    style={[styles.button, styles.decrementButton]}
                    disabled={current === 0}
                  >
                    <Text style={styles.buttonText}>−</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleIncrement(group.key)}
                    style={[styles.button, styles.incrementButton]}
                  >
                    <Text style={[styles.buttonText, styles.incrementText]}>+1</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {selectedGroup && (
        <HealthyOptionsSheet
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          foodGroup={selectedGroup}
          dietStyle={user.dietStyle}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    marginBottom: 8,
    height: 160,
    width: 160,
    alignSelf: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  rowOverTarget: {
    backgroundColor: colors.highlight,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rowContent: {
    flex: 1,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoButton: {
    padding: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    minWidth: 50,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decrementButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  incrementButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  incrementText: {
    color: colors.background,
  },
});
