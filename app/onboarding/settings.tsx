
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Goal, DietStyle, User, MetricWeight, DailyTargets } from '@/types';
import { storage } from '@/utils/storage';
import { createDailyTargets } from '@/utils/targetUtils';
import { getTodayDate } from '@/utils/dateUtils';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SettingsScreen() {
  const params = useLocalSearchParams();
  const goal = params.goal as Goal;
  const dietStyle = (params.dietStyle as DietStyle) || 'omnivore';
  const initialWeight = params.initialWeight as string;
  const customTargetsString = params.customTargets as string | undefined;

  const [resetTime, setResetTime] = useState('04:00');
  const [remindersOn, setRemindersOn] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setResetTime(`${hours}:${minutes}`);
    }
  };

  const handleComplete = async () => {
    const user: User = {
      goal,
      dietStyle,
      resetTime,
      remindersOn,
      reminderTimes: [],
    };

    // Determine which targets to use
    let targets: DailyTargets;
    if (customTargetsString) {
      // User set custom targets
      try {
        const customTargets = JSON.parse(customTargetsString);
        targets = {
          date: getTodayDate(),
          protein: customTargets.protein,
          veggies: customTargets.veggies,
          fruit: customTargets.fruit,
          wholeGrains: customTargets.wholeGrains,
          fats: customTargets.fats,
          nutsSeeds: customTargets.nutsSeeds,
          legumes: customTargets.legumes,
          water: customTargets.water,
          alcohol: customTargets.alcohol,
          dairy: 2, // Default dairy value
        };
      } catch (error) {
        console.error('Error parsing custom targets:', error);
        // Fallback to default targets
        targets = createDailyTargets(goal);
      }
    } else {
      // Use recommended targets based on goal
      targets = createDailyTargets(goal);
    }

    await storage.setUser(user);
    await storage.setDailyTargets(targets);

    // Save initial weight if provided
    if (initialWeight) {
      const weight = parseFloat(initialWeight);
      if (!isNaN(weight) && weight > 0) {
        const weightEntry: MetricWeight = {
          date: getTodayDate(),
          value: weight,
        };
        await storage.setWeightMetrics([weightEntry]);
      }
    }

    await storage.setOnboardingComplete();

    router.replace('/(tabs)/today');
  };

  const getTimeDate = () => {
    const [hours, minutes] = resetTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Reset Time</Text>
        <Text style={styles.subtitle}>
          Choose when your daily tracking should reset
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Reset Time</Text>
              <Text style={styles.settingDescription}>
                Your daily log will reset at this time
              </Text>
            </View>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeText}>{resetTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={getTimeDate()}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Daily Reminders</Text>
              <Text style={styles.settingDescription}>
                Enable to receive reminders (coming soon)
              </Text>
            </View>
            <Switch
              value={remindersOn}
              onValueChange={setRemindersOn}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            You can change these settings anytime in the Settings tab
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={buttonStyles.primary} onPress={handleComplete}>
          <Text style={buttonStyles.text}>Complete Setup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  settingCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginRight: 14,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  timeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.background,
  },
  infoBox: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    paddingTop: 20,
  },
});
