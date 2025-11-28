
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { User, Goal, DietStyle } from '@/types';
import { createDailyTargets } from '@/utils/targetUtils';
import { IconSymbol } from '@/components/IconSymbol';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SettingsScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const userData = await storage.getUser();
    setUser(userData);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    await storage.setUser(updatedUser);
    setUser(updatedUser);
  };

  const handleGoalChange = async (goal: Goal) => {
    if (!user) return;
    await updateUser({ goal });
    const newTargets = createDailyTargets(goal);
    await storage.setDailyTargets(newTargets);
    Alert.alert('Goal Updated', 'Your daily targets have been updated based on your new goal.');
  };

  const handleExportData = async () => {
    const logs = await storage.getDailyLogs();
    const metrics = await storage.getWeightMetrics();
    
    if (logs.length === 0 && metrics.length === 0) {
      Alert.alert('No Data', 'There is no data to export yet.');
      return;
    }

    Alert.alert(
      'Export Data',
      'Data export feature will be available in a future update. Your data is safely stored on your device.',
      [{ text: 'OK' }]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to delete all your data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAll();
            router.replace('/onboarding/welcome');
          },
        },
      ]
    );
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate && user) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      updateUser({ resetTime: `${hours}:${minutes}` });
    }
  };

  const getTimeDate = () => {
    if (!user) return new Date();
    const [hours, minutes] = user.resetTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date;
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Goal</Text>
        <View style={styles.settingCard}>
          {(['weight_loss', 'maintenance', 'heart_health'] as Goal[]).map((goal) => (
            <TouchableOpacity
              key={goal}
              style={styles.radioOption}
              onPress={() => handleGoalChange(goal)}
            >
              <View style={styles.radioContent}>
                <Text style={styles.radioLabel}>
                  {goal === 'weight_loss' ? 'Weight Loss' : goal === 'maintenance' ? 'Maintenance' : 'Heart Health'}
                </Text>
              </View>
              <View style={[styles.radio, user.goal === goal && styles.radioSelected]}>
                {user.goal === goal && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Diet Style</Text>
        <View style={styles.settingCard}>
          {(['omnivore', 'vegetarian', 'vegan'] as DietStyle[]).map((diet) => (
            <TouchableOpacity
              key={diet}
              style={styles.radioOption}
              onPress={() => updateUser({ dietStyle: diet })}
            >
              <View style={styles.radioContent}>
                <Text style={styles.radioLabel}>
                  {diet.charAt(0).toUpperCase() + diet.slice(1)}
                </Text>
              </View>
              <View style={[styles.radio, user.dietStyle === diet && styles.radioSelected]}>
                {user.dietStyle === diet && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Daily Reset</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Reset Time</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeText}>{user.resetTime}</Text>
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

        <Text style={styles.sectionTitle}>Reminders</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Daily Reminders</Text>
            <Switch
              value={user.remindersOn}
              onValueChange={(value) => updateUser({ remindersOn: value })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
          <IconSymbol
            ios_icon_name="square.and.arrow.up"
            android_material_icon_name="upload"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.actionButtonText}>Export Data as CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleResetData}>
          <IconSymbol
            ios_icon_name="trash"
            android_material_icon_name="delete"
            size={24}
            color={colors.error}
          />
          <Text style={[styles.actionButtonText, styles.dangerText]}>Reset All Data</Text>
        </TouchableOpacity>

        <View style={styles.privacyNote}>
          <IconSymbol
            ios_icon_name="lock.shield.fill"
            android_material_icon_name="security"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={styles.privacyText}>
            Data stays on your device unless you export it
          </Text>
        </View>
      </ScrollView>
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
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  timeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  radioOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  dangerText: {
    color: colors.error,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
});
