
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { DailyLog, DailyTargets } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { IconSymbol } from '@/components/IconSymbol';

export default function HistoryScreen() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [targets, setTargets] = useState<DailyTargets | null>(null);
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const logsData = await storage.getDailyLogs();
    const targetsData = await storage.getDailyTargets();
    
    const sortedLogs = logsData.sort((a, b) => b.date.localeCompare(a.date));
    setLogs(sortedLogs);
    setTargets(targetsData);
  };

  const renderLogDetail = () => {
    if (!selectedLog || !targets) return null;

    const fields: { key: keyof DailyLog; label: string }[] = [
      { key: 'protein', label: 'Protein' },
      { key: 'veggies', label: 'Veggies' },
      { key: 'fruit', label: 'Fruit' },
      { key: 'wholeGrains', label: 'Whole Grains' },
      { key: 'fats', label: 'Healthy Fats' },
      { key: 'nutsSeeds', label: 'Nuts & Seeds' },
      { key: 'legumes', label: 'Legumes' },
      { key: 'water', label: 'Water' },
      { key: 'alcohol', label: 'Alcohol' },
      { key: 'dairy', label: 'Dairy' },
    ];

    return (
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>{formatDate(selectedLog.date)}</Text>
          <TouchableOpacity onPress={() => setSelectedLog(null)}>
            <IconSymbol
              ios_icon_name="xmark.circle.fill"
              android_material_icon_name="cancel"
              size={28}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
          {fields.map((field) => (
            <View key={field.key} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{field.label}</Text>
              <Text style={styles.detailValue}>
                {selectedLog[field.key]} / {targets[field.key]}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
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
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {selectedLog ? (
        renderLogDetail()
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {logs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol
                ios_icon_name="calendar"
                android_material_icon_name="calendar_today"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No history yet</Text>
              <Text style={styles.emptySubtext}>Start tracking your portions today!</Text>
            </View>
          ) : (
            logs.map((log, index) => (
              <TouchableOpacity
                key={index}
                style={styles.logCard}
                onPress={() => setSelectedLog(log)}
              >
                <View style={styles.logContent}>
                  <Text style={styles.logDate}>{formatDate(log.date)}</Text>
                  <Text style={styles.logSummary}>
                    {log.protein + log.veggies + log.fruit + log.wholeGrains + log.fats + log.nutsSeeds + log.legumes + log.water + log.dairy} portions logged
                  </Text>
                </View>
                <IconSymbol
                  ios_icon_name="chevron.right"
                  android_material_icon_name="chevron_right"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
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
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  logContent: {
    flex: 1,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  logSummary: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailContainer: {
    flex: 1,
    padding: 24,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  detailScroll: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
