
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { DailyLog, DailyTargets } from '@/types';
import { IconSymbol } from '@/components/IconSymbol';

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
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [targets, setTargets] = useState<DailyTargets | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('week');
  const [stats, setStats] = useState({
    streak: 0,
    totalDays: 0,
  });
  const [adherence, setAdherence] = useState<AdherenceStats>({
    protein: 0,
    veggies: 0,
    fruit: 0,
    wholeGrains: 0,
    fats: 0,
    nutsSeeds: 0,
    legumes: 0,
    water: 0,
    dairy: 0,
  });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const logsData = await storage.getDailyLogs();
    const targetsData = await storage.getDailyTargets();

    setLogs(logsData);
    setTargets(targetsData);

    if (targetsData && logsData.length > 0) {
      calculateStats(logsData, targetsData, timeFrame);
    } else {
      setStats({
        streak: 0,
        totalDays: 0,
      });
      setAdherence({
        protein: 0,
        veggies: 0,
        fruit: 0,
        wholeGrains: 0,
        fats: 0,
        nutsSeeds: 0,
        legumes: 0,
        water: 0,
        dairy: 0,
      });
    }
  };

  const getFilteredLogs = (logs: DailyLog[], timeFrame: TimeFrame): DailyLog[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let cutoffDate: Date;
    
    switch (timeFrame) {
      case 'day':
        // Just today
        cutoffDate = today;
        break;
      case 'week':
        // Last 7 days
        cutoffDate = new Date(today);
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case 'month':
        // Last 30 days
        cutoffDate = new Date(today);
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        break;
      default:
        cutoffDate = new Date(0); // All time
    }

    return logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= cutoffDate;
    });
  };

  const calculateStats = (allLogs: DailyLog[], targets: DailyTargets, selectedTimeFrame: TimeFrame) => {
    // Filter logs based on timeframe
    const filteredLogs = getFilteredLogs(allLogs, selectedTimeFrame);
    
    console.log(`Calculating stats for ${selectedTimeFrame}: ${filteredLogs.length} logs`);

    if (filteredLogs.length === 0) {
      setAdherence({
        protein: 0,
        veggies: 0,
        fruit: 0,
        wholeGrains: 0,
        fats: 0,
        nutsSeeds: 0,
        legumes: 0,
        water: 0,
        dairy: 0,
      });
      setStats({
        streak: 0,
        totalDays: 0,
      });
      return;
    }

    const proteinHits = filteredLogs.filter((log) => log.protein >= targets.protein).length;
    const veggiesHits = filteredLogs.filter((log) => log.veggies >= targets.veggies).length;
    const fruitHits = filteredLogs.filter((log) => log.fruit >= targets.fruit).length;
    const wholeGrainsHits = filteredLogs.filter((log) => log.wholeGrains >= targets.wholeGrains).length;
    const fatsHits = filteredLogs.filter((log) => log.fats >= targets.fats).length;
    const nutsSeedsHits = filteredLogs.filter((log) => log.nutsSeeds >= targets.nutsSeeds).length;
    const legumesHits = filteredLogs.filter((log) => log.legumes >= targets.legumes).length;
    const waterHits = filteredLogs.filter((log) => log.water >= targets.water).length;
    const dairyHits = filteredLogs.filter((log) => log.dairy >= targets.dairy).length;

    const totalLogs = filteredLogs.length;

    const newAdherence = {
      protein: totalLogs > 0 ? Math.round((proteinHits / totalLogs) * 100) : 0,
      veggies: totalLogs > 0 ? Math.round((veggiesHits / totalLogs) * 100) : 0,
      fruit: totalLogs > 0 ? Math.round((fruitHits / totalLogs) * 100) : 0,
      wholeGrains: totalLogs > 0 ? Math.round((wholeGrainsHits / totalLogs) * 100) : 0,
      fats: totalLogs > 0 ? Math.round((fatsHits / totalLogs) * 100) : 0,
      nutsSeeds: totalLogs > 0 ? Math.round((nutsSeedsHits / totalLogs) * 100) : 0,
      legumes: totalLogs > 0 ? Math.round((legumesHits / totalLogs) * 100) : 0,
      water: totalLogs > 0 ? Math.round((waterHits / totalLogs) * 100) : 0,
      dairy: totalLogs > 0 ? Math.round((dairyHits / totalLogs) * 100) : 0,
    };

    console.log('Adherence calculated:', newAdherence);
    setAdherence(newAdherence);

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

    setStats({
      streak: streak,
      totalDays: allLogs.length,
    });
  };

  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
    if (targets && logs.length > 0) {
      calculateStats(logs, targets, newTimeFrame);
    }
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
        {logs.length === 0 ? (
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
