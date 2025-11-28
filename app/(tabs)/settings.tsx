
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform, TextInput, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { User, Goal, DietStyle, DailyTargets, FoodGroup } from '@/types';
import { createDailyTargets } from '@/utils/targetUtils';
import { IconSymbol } from '@/components/IconSymbol';
import DateTimePicker from '@react-native-community/datetimepicker';

const foodGroupLabels: { key: FoodGroup; label: string; max?: number }[] = [
  { key: 'protein', label: 'Protein' },
  { key: 'veggies', label: 'Veggies' },
  { key: 'fruit', label: 'Fruit' },
  { key: 'wholeGrains', label: 'Whole Grains' },
  { key: 'fats', label: 'Healthy Fats' },
  { key: 'nutsSeeds', label: 'Nuts & Seeds' },
  { key: 'legumes', label: 'Legumes' },
  { key: 'water', label: 'Water' },
  { key: 'alcohol', label: 'Alcohol', max: 2 },
  { key: 'dairy', label: 'Dairy', max: 1 },
];

export default function SettingsScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [targets, setTargets] = useState<DailyTargets | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingTargets, setEditingTargets] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const userData = await storage.getUser();
    const targetsData = await storage.getDailyTargets();
    setUser(userData);
    setTargets(targetsData);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    await storage.setUser(updatedUser);
    setUser(updatedUser);
  };

  const updateTargets = async (updates: Partial<DailyTargets>) => {
    if (!targets) return;
    const updatedTargets = { ...targets, ...updates };
    await storage.setDailyTargets(updatedTargets);
    setTargets(updatedTargets);
  };

  const handleGoalChange = async (goal: Goal) => {
    if (!user) return;
    
    Alert.alert(
      'Change Goal',
      'Changing your goal will reset your daily targets to the recommended values for this goal. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            await updateUser({ goal });
            const newTargets = createDailyTargets(goal);
            await storage.setDailyTargets(newTargets);
            setTargets(newTargets);
            Alert.alert('Goal Updated', 'Your daily targets have been updated based on your new goal.');
          },
        },
      ]
    );
  };

  const handleTargetChange = (group: FoodGroup, value: string) => {
    if (!targets) return;
    
    const numValue = parseInt(value) || 0;
    
    // Apply max limit for alcohol
    if (group === 'alcohol' && numValue > 2) {
      Alert.alert('Maximum Limit', 'Alcohol target cannot exceed 2 portions per day.');
      return;
    }
    
    // Apply max limit for dairy
    if (group === 'dairy' && numValue > 1) {
      Alert.alert('Maximum Limit', 'Dairy target cannot exceed 1 portion per day.');
      return;
    }
    
    // Ensure non-negative values
    if (numValue < 0) return;
    
    updateTargets({ [group]: numValue });
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

  if (!user || !targets) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.text}>Loading...</Text>
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Targets</Text>
          <TouchableOpacity onPress={() => setEditingTargets(!editingTargets)}>
            <Text style={styles.editButton}>{editingTargets ? 'Done' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.settingCard}>
          {foodGroupLabels.map((group, index) => (
            <View key={index} style={styles.targetRow}>
              <Text style={styles.targetLabel}>{group.label}</Text>
              {editingTargets ? (
                <View style={styles.targetInputContainer}>
                  <TextInput
                    style={styles.targetInput}
                    value={targets[group.key].toString()}
                    onChangeText={(value) => handleTargetChange(group.key, value)}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  {group.max && (
                    <Text style={styles.targetMaxLabel}>max {group.max}</Text>
                  )}
                </View>
              ) : (
                <View style={styles.targetValueContainer}>
                  <Text style={styles.targetValue}>{targets[group.key]}</Text>
                  {group.max && (
                    <Text style={styles.targetMaxLabel}>max {group.max}</Text>
                  )}
                </View>
              )}
            </View>
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
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    marginBottom: 12,
    height: 60,
    width: '100%',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 24,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  editButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
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
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  targetLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  targetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minWidth: 50,
    textAlign: 'center',
  },
  targetValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minWidth: 30,
    textAlign: 'right',
  },
  targetMaxLabel: {
    fontSize: 12,
    color: colors.textSecondary,
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
