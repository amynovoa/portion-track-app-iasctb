
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { DailyLog, DailyTargets } from '@/types';
import { IconSymbol } from '@/components/IconSymbol';
import { useAppContext } from '@/contexts/AppContext';

interface AdherenceStats {
  protein: number;
  veggies: number;
  fruit: number;
  wholeGrains: number;
  fats: number;
  nutsSeeds: number;
  legumes: number;
  water: number;
  dairy: number;
}

type TimeFrame = 'day' | 'week' | 'month';

export default function ProgressScreen() {
  const { allLogs, targets, refreshData } = useAppContext();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('week');

  useFocusEffect(
    useCallback(() => {
      console.log('=== Progress screen focused ===');
      refreshData();
    }, [refreshData])
  );

  const getTodayString = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDateDaysAgo = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate adherence using useMemo to ensure it recalculates when dependencies change
  const adherence = useMemo(() => {
    console.log('=== Calculating adherence (useMemo) ===');
    console.log('allLogs:', allLogs.length, 'logs');
    console.log('allLogs data:', JSON.stringify(allLogs, null, 2));
    console.log('targets:', targets);
    console.log('timeFrame:', timeFrame);

    if (!targets || allLogs.length === 0) {
      console.log('No targets or logs, returning 0 adherence');
      return {
        protein: 0,
        veggies: 0,
        fruit: 0,
        wholeGrains: 0,
        fats: 0,
        nutsSeeds: 0,
        legumes: 0,
        water: 0,
        dairy: 0,
      };
    }

    const todayString = getTodayString();
    console.log('Today:', todayString);

    let filteredLogs: DailyLog[] = [];

    switch (timeFrame) {
      case 'day':
        // Just today
        filteredLogs = allLogs.filter(log => log.date === todayString);
        console.log('Day logs found:', filteredLogs.length, filteredLogs);
        break;
        
      case 'week':
        // Last 7 days (including today)
        const weekCutoff = getDateDaysAgo(6); // 6 days ago + today = 7 days
        console.log('Week cutoff:', weekCutoff);
        filteredLogs = allLogs.filter(log => {
          const isInRange = log.date >= weekCutoff && log.date <= todayString;
          if (isInRange) {
            console.log('Week log included:', log.date, log);
          }
          return isInRange;
        });
        console.log('Week logs found:', filteredLogs.length);
        break;
        
      case 'month':
        // Last 30 days (including today)
        const monthCutoff = getDateDaysAgo(29); // 29 days ago + today = 30 days
        console.log('Month cutoff:', monthCutoff);
        filteredLogs = allLogs.filter(log => {
          const isInRange = log.date >= monthCutoff && log.date <= todayString;
          if (isInRange) {
            console.log('Month log included:', log.date, log);
          }
          return isInRange;
        });
        console.log('Month logs found:', filteredLogs.length);
        break;
        
      default:
        filteredLogs = allLogs;
    }

    if (filteredLogs.length === 0) {
      console.log('No filtered logs, returning 0 adherence');
      return {
        protein: 0,
        veggies: 0,
        fruit: 0,
        wholeGrains: 0,
        fats: 0,
        nutsSeeds: 0,
        legumes: 0,
        water: 0,
        dairy: 0,
      };
    }

    // Calculate total consumed across all filtered days
    const totalConsumed = {
      protein: 0,
      veggies: 0,
      fruit: 0,
      wholeGrains: 0,
      fats: 0,
      nutsSeeds: 0,
      legumes: 0,
      water: 0,
      dairy: 0,
    };

    filteredLogs.forEach(log => {
      totalConsumed.protein += log.protein || 0;
      totalConsumed.veggies += log.veggies || 0;
      totalConsumed.fruit += log.fruit || 0;
      totalConsumed.wholeGrains += log.wholeGrains || 0;
      totalConsumed.fats += log.fats || 0;
      totalConsumed.nutsSeeds += log.nutsSeeds || 0;
      totalConsumed.legumes += log.legumes || 0;
      totalConsumed.water += log.water || 0;
      totalConsumed.dairy += log.dairy || 0;
    });

    // Calculate total target (target per day * number of days)
    const numDays = filteredLogs.length;
    const totalTarget = {
      protein: targets.protein * numDays,
      veggies: targets.veggies * numDays,
      fruit: targets.fruit * numDays,
      wholeGrains: targets.wholeGrains * numDays,
      fats: targets.fats * numDays,
      nutsSeeds: targets.nutsSeeds * numDays,
      legumes: targets.legumes * numDays,
      water: targets.water * numDays,
      dairy: targets.dairy * numDays,
    };

    // Calculate percentage for each food group
    const calculatedAdherence = {
      protein: totalTarget.protein > 0 ? Math.round((totalConsumed.protein / totalTarget.protein) * 100) : 0,
      veggies: totalTarget.veggies > 0 ? Math.round((totalConsumed.veggies / totalTarget.veggies) * 100) : 0,
      fruit: totalTarget.fruit > 0 ? Math.round((totalConsumed.fruit / totalTarget.fruit) * 100) : 0,
      wholeGrains: totalTarget.wholeGrains > 0 ? Math.round((totalConsumed.wholeGrains / totalTarget.wholeGrains) * 100) : 0,
      fats: totalTarget.fats > 0 ? Math.round((totalConsumed.fats / totalTarget.fats) * 100) : 0,
      nutsSeeds: totalTarget.nutsSeeds > 0 ? Math.round((totalConsumed.nutsSeeds / totalTarget.nutsSeeds) * 100) : 0,
      legumes: totalTarget.legumes > 0 ? Math.round((totalConsumed.legumes / totalTarget.legumes) * 100) : 0,
      water: totalTarget.water > 0 ? Math.round((totalConsumed.water / totalTarget.water) * 100) : 0,
      dairy: totalTarget.dairy > 0 ? Math.round((totalConsumed.dairy / totalTarget.dairy) * 100) : 0,
    };

    console.log('Number of days:', numDays);
    console.log('Total consumed:', totalConsumed);
    console.log('Total target:', totalTarget);
    console.log('Adherence calculated:', calculatedAdherence);

    return calculatedAdherence;
  }, [allLogs, targets, timeFrame]);

  // Calculate stats using useMemo
  const stats = useMemo(() => {
    console.log('=== Calculating stats (useMemo) ===');
    
    if (allLogs.length === 0) {
      return {
        streak: 0,
        totalDays: 0,
      };
    }

    // Calculate streak from all logs (not filtered)
    const sortedLogs = [...allLogs].sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    for (const log of sortedLogs) {
      const totalPortions = log.protein + log.veggies + log.fruit + log.wholeGrains + log.fats + log.nutsSeeds + log.legumes + log.dairy;
      if (totalPortions > 0) {
        streak++;
      } else {
        break;
      }
    }

    console.log('Streak calculated:', streak);
    console.log('Total days:', allLogs.length);

    return {
      streak: streak,
      totalDays: allLogs.length,
    };
  }, [allLogs]);

  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    console.log('Changing timeframe to:', newTimeFrame);
    setTimeFrame(newTimeFrame);
  };

  const renderAdherenceCard = (label: string, percentage: number) => (
    <View style={styles.adherenceCard} key={label}>
      <View style={styles.adherenceHeader}>
        <Text style={styles.adherenceLabel}>{label}</Text>
        <Text style={styles.adherencePercent}>{percentage}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, percentage))}%` }]}
        />
      </View>
    </View>
  );

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case 'day':
        return 'Today';
      case 'week':
        return 'Last 7 Days';
      case 'month':
        return 'Last 30 Days';
      default:
        return 'All Time';
    }
  };

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
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {allLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol
              ios_icon_name="chart.bar.fill"
              android_material_icon_name="insert_chart"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No progress data yet</Text>
            <Text style={styles.emptySubtext}>Start tracking to see your progress!</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <IconSymbol
                    ios_icon_name="flame.fill"
                    android_material_icon_name="whatshot"
                    size={32}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.statValue}>{stats.streak || 0}</Text>
                <Text style={styles.statLabel}>Current Streak</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <IconSymbol
                    ios_icon_name="calendar"
                    android_material_icon_name="event"
                    size={32}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.statValue}>{stats.totalDays || 0}</Text>
                <Text style={styles.statLabel}>Total Days Tracked</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Target Adherence</Text>
              <Text style={styles.timeFrameLabel}>{getTimeFrameLabel()}</Text>
            </View>

            <View style={styles.timeFrameSelector}>
              <TouchableOpacity
                style={[styles.timeFrameButton, timeFrame === 'day' && styles.timeFrameButtonActive]}
                onPress={() => handleTimeFrameChange('day')}
              >
                <Text style={[styles.timeFrameButtonText, timeFrame === 'day' && styles.timeFrameButtonTextActive]}>
                  Day
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.timeFrameButton, timeFrame === 'week' && styles.timeFrameButtonActive]}
                onPress={() => handleTimeFrameChange('week')}
              >
                <Text style={[styles.timeFrameButtonText, timeFrame === 'week' && styles.timeFrameButtonTextActive]}>
                  Week
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.timeFrameButton, timeFrame === 'month' && styles.timeFrameButtonActive]}
                onPress={() => handleTimeFrameChange('month')}
              >
                <Text style={[styles.timeFrameButtonText, timeFrame === 'month' && styles.timeFrameButtonTextActive]}>
                  Month
                </Text>
              </TouchableOpacity>
            </View>

            {renderAdherenceCard('Protein', adherence.protein)}
            {renderAdherenceCard('Veggies', adherence.veggies)}
            {renderAdherenceCard('Fruit', adherence.fruit)}
            {renderAdherenceCard('Whole Grains', adherence.wholeGrains)}
            {renderAdherenceCard('Fats', adherence.fats)}
            {renderAdherenceCard('Nuts & Seeds', adherence.nutsSeeds)}
            {renderAdherenceCard('Legumes', adherence.legumes)}
            {renderAdherenceCard('Dairy', adherence.dairy)}
            {renderAdherenceCard('Water', adherence.water)}
          </>
        )}
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
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    height: 160,
    width: 160,
    alignSelf: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  timeFrameLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 4,
  },
  timeFrameSelector: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeFrameButtonActive: {
    backgroundColor: colors.primary,
  },
  timeFrameButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  timeFrameButtonTextActive: {
    color: '#FFFFFF',
  },
  adherenceCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  adherenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adherenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  adherencePercent: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});
