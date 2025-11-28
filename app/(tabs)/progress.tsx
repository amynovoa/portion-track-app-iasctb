
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { DailyLog, DailyTargets } from '@/types';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProgressScreen() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [targets, setTargets] = useState<DailyTargets | null>(null);
  const [stats, setStats] = useState({
    proteinAdherence: 0,
    veggiesAdherence: 0,
    streak: 0,
    totalDays: 0,
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
    }
  };

  const calculateStats = (logs: DailyLog[], targets: DailyTargets) => {
    const proteinHits = logs.filter((log) => log.protein >= targets.protein).length;
    const veggiesHits = logs.filter((log) => log.veggies >= targets.veggies).length;

    const proteinAdherence = logs.length > 0 ? Math.round((proteinHits / logs.length) * 100) : 0;
    const veggiesAdherence = logs.length > 0 ? Math.round((veggiesHits / logs.length) * 100) : 0;

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
      proteinAdherence,
      veggiesAdherence,
      streak,
      totalDays: logs.length,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/portiontracker_header_1600x400.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Progress</Text>
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
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <IconSymbol
                  ios_icon_name="flame.fill"
                  android_material_icon_name="local_fire_department"
                  size={32}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.statLabel}>Current Streak</Text>
              <Text style={styles.statValue}>{stats.streak} days</Text>
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
              <Text style={styles.statLabel}>Total Days Tracked</Text>
              <Text style={styles.statValue}>{stats.totalDays}</Text>
            </View>

            <Text style={styles.sectionTitle}>Target Adherence</Text>

            <View style={styles.adherenceCard}>
              <View style={styles.adherenceHeader}>
                <Text style={styles.adherenceLabel}>Protein Target</Text>
                <Text style={styles.adherencePercent}>{stats.proteinAdherence}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${stats.proteinAdherence}%` }]}
                />
              </View>
            </View>

            <View style={styles.adherenceCard}>
              <View style={styles.adherenceHeader}>
                <Text style={styles.adherenceLabel}>Veggies Target</Text>
                <Text style={styles.adherencePercent}>{stats.veggiesAdherence}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${stats.veggiesAdherence}%` }]}
                />
              </View>
            </View>
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
  logo: {
    width: 200,
    height: 50,
    marginBottom: 12,
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
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
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
