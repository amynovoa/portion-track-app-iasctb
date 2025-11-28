
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, commonStyles } from '@/styles/commonStyles';
import FoodGroupCard from '@/components/FoodGroupCard';
import HealthyOptionsSheet from '@/components/HealthyOptionsSheet';
import { storage } from '@/utils/storage';
import { DailyLog, DailyTargets, FoodGroup, User } from '@/types';
import { getTodayDate, shouldResetLog } from '@/utils/dateUtils';

const foodGroups: { key: FoodGroup; label: string }[] = [
  { key: 'protein', label: 'Protein' },
  { key: 'veggies', label: 'Veggies' },
  { key: 'fruit', label: 'Fruit' },
  { key: 'wholeGrains', label: 'Whole Grains' },
  { key: 'fats', label: 'Healthy Fats' },
  { key: 'nutsSeeds', label: 'Nuts & Seeds' },
  { key: 'legumes', label: 'Legumes' },
  { key: 'water', label: 'Water' },
  { key: 'alcohol', label: 'Alcohol' },
];

export default function TodayScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [targets, setTargets] = useState<DailyTargets | null>(null);
  const [log, setLog] = useState<DailyLog | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<FoodGroup | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const loadData = async () => {
    const userData = await storage.getUser();
    const targetsData = await storage.getDailyTargets();
    const logs = await storage.getDailyLogs();

    setUser(userData);
    setTargets(targetsData);

    const today = getTodayDate();
    let todayLog = logs.find((l) => l.date === today);

    if (!todayLog) {
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
      };
      await storage.setDailyLogs([...logs, todayLog]);
    } else if (userData && shouldResetLog(todayLog.date, userData.resetTime)) {
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
      };
      const updatedLogs = logs.filter((l) => l.date !== today);
      await storage.setDailyLogs([...updatedLogs, todayLog]);
    }

    setLog(todayLog);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const updateLog = async (group: FoodGroup, value: number) => {
    if (!log || !targets) return;

    const updatedLog = { ...log, [group]: value };
    setLog(updatedLog);

    const logs = await storage.getDailyLogs();
    const updatedLogs = logs.map((l) => (l.date === log.date ? updatedLog : l));
    await storage.setDailyLogs(updatedLogs);
  };

  const handleIncrement = (group: FoodGroup) => {
    if (!log || !targets) return;

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
        <Image
          source={require('@/assets/images/natively-dark.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Today&apos;s Portions</Text>
        <Text style={styles.headerDate}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {foodGroups.map((group) => (
            <View key={group.key} style={styles.gridItem}>
              <FoodGroupCard
                group={group.key}
                label={group.label}
                current={log[group.key]}
                target={targets[group.key]}
                onIncrement={() => handleIncrement(group.key)}
                onDecrement={() => handleDecrement(group.key)}
                onInfo={() => handleInfo(group.key)}
              />
            </View>
          ))}
        </View>
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
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: '31%',
    minWidth: 100,
  },
});
