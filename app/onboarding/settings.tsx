
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Goal, DietStyle, User } from '@/types';
import { storage } from '@/utils/storage';
import { createDailyTargets } from '@/utils/targetUtils';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SettingsScreen() {
  const params = useLocalSearchParams();
  const goal = params.goal as Goal;
  const dietStyle = (params.dietStyle as DietStyle) || 'omnivore';

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

    const targets = createDailyTargets(goal);

    await storage.setUser(user);
    await storage.setDailyTargets(targets);
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Daily Reset Time</Text>
        <Text style={styles.subtitle}>
          Choose when your daily tracking should reset
        </Text>

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
                Get reminded to log your portions
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
      </ScrollView>

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
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    lineHeight: 24,
  },
  settingCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  timeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  infoBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
