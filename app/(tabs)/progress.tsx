
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image } from 'react-native';
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

export default function ProgressScreen() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [targets, setTargets] = useState<DailyTargets | null>(null);
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
      calculateStats(logsData, targetsData);
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

  const calculateStats = (logs: DailyLog[], targets: DailyTargets) => {
    const proteinHits = logs.filter((log) => log.protein >= targets.protein).length;
    const veggiesHits = logs.filter((log) => log.veggies >= targets.veggies).length;
    const fruitHits = logs.filter((log) => log.fruit >= targets.fruit).length;
    const wholeGrainsHits = logs.filter((log) => log.wholeGrains >= targets.wholeGrains).length;
    const fatsHits = logs.filter((log) => log.fats >= targets.fats).length;
    const nutsSeedsHits = logs.filter((log) => log.nutsSeeds >= targets.nutsSeeds).length;
    const legumesHits = logs.filter((log) => log.legumes >= targets.legumes).length;
    const waterHits = logs.filter((log) => log.water >= targets.water).length;
    const dairyHits = logs.filter((log) => log.dairy >= targets.dairy).length;

    const totalLogs = logs.length;

    setAdherence({
      protein: totalLogs > 0 ? Math.round((proteinHits / totalLogs) * 100) : 0,
      veggies: totalLogs > 0 ? Math.round((veggiesHits / totalLogs) * 100) : 0,
      fruit: totalLogs > 0 ? Math.round((fruitHits / totalLogs) * 100) : 0,
      wholeGrains: totalLogs > 0 ? Math.round((wholeGrainsHits / totalLogs) * 100) : 0,
      fats: totalLogs > 0 ? Math.round((fatsHits / totalLogs) * 100) : 0,
      nutsSeeds: totalLogs > 0 ? Math.round((nutsSeedsHits / totalLogs) * 100) : 0,
      legumes: totalLogs > 0 ? Math.round((legumesHits / totalLogs) * 100) : 0,
      water: totalLogs > 0 ? Math.round((waterHits / totalLogs) * 100) : 0,
      dairy: totalLogs > 0 ? Math.round((dairyHits / totalLogs) * 100) : 0,
    });

    const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
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
      totalDays: logs.length,
    });
  };

  const renderAdherenceCard = (label: string, percentage: number) => (
    <View style={styles.adherenceCard}>
      <View style={styles.adherenceHeader}>
        <Text style={styles.adherenceLabel}>{label}</Text>
        <Text style={styles.adherencePercent}>{percentage}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${percentage}%` }]}
        />
      </View>
    </View>
  );

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
              ios_icon_name="chart.bar"
              android_material_icon_name="bar_chart"
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
                    android_material_icon_name="local_fire_department"
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
                    android_material_icon_name="calendar_today"
                    size={32}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.statValue}>{stats.totalDays || 0}</Text>
                <Text style={styles.statLabel}>Total Days Tracked</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Target Adherence</Text>

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
    height: 100,
    width: '100%',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 16,
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
