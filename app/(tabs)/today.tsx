
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, commonStyles } from '@/styles/commonStyles';
import HealthyOptionsSheet from '@/components/HealthyOptionsSheet';
import { FoodGroup } from '@/types';
import { useAppContext } from '@/contexts/AppContext';

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
  const { user, targets, todayLog, isLoading, updateTodayLog, refreshData } = useAppContext();
  const [selectedGroup, setSelectedGroup] = useState<FoodGroup | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('TodayScreen: Screen focused, refreshing data');
      refreshData();
    }, [refreshData])
  );

  const handleIncrement = useCallback(async (group: FoodGroup) => {
    if (!todayLog || !targets) {
      console.log('Cannot increment: todayLog or targets is null');
      return;
    }

    // Hard cap alcohol at 2 portions per day
    if (group === 'alcohol' && todayLog.alcohol >= 2) {
      Alert.alert(
        'Daily Limit Reached',
        'Daily alcohol limit reached (2/2). Adjust in Settings if needed.',
        [{ text: 'OK' }]
      );
      return;
    }

    const newValue = todayLog[group] + 1;
    console.log(`Incrementing ${group} from ${todayLog[group]} to ${newValue}`);
    
    try {
      await updateTodayLog(group, newValue);
    } catch (error) {
      console.error('Error incrementing:', error);
      Alert.alert('Error', 'Failed to save your progress. Please try again.');
    }
  }, [todayLog, targets, updateTodayLog]);

  const handleDecrement = useCallback(async (group: FoodGroup) => {
    if (!todayLog) {
      console.log('Cannot decrement: todayLog is null');
      return;
    }
    
    if (todayLog[group] > 0) {
      const newValue = todayLog[group] - 1;
      console.log(`Decrementing ${group} from ${todayLog[group]} to ${newValue}`);
      
      try {
        await updateTodayLog(group, newValue);
      } catch (error) {
        console.error('Error decrementing:', error);
        Alert.alert('Error', 'Failed to save your progress. Please try again.');
      }
    }
  }, [todayLog, updateTodayLog]);

  const handleInfo = useCallback((group: FoodGroup) => {
    setSelectedGroup(group);
    setSheetVisible(true);
  }, []);

  if (isLoading || !user || !targets || !todayLog) {
    return (
      <View style={[commonStyles.container, styles.loadingContainer]}>
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  console.log('TodayScreen: Rendering with todayLog:', todayLog);

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
          const current = todayLog[group.key];
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
