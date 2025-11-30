
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { formatDate } from '@/utils/dateUtils';
import { useAppContext } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function HistoryScreen() {
  const { allLogs, targets, refreshData } = useAppContext();

  useFocusEffect(
    useCallback(() => {
      console.log('=== History screen focused ===');
      refreshData();
    }, [refreshData])
  );

  const sortedLogs = [...allLogs].sort((a, b) => b.date.localeCompare(a.date));

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
        {sortedLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol
              ios_icon_name="clock.fill"
              android_material_icon_name="history"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No history yet</Text>
            <Text style={styles.emptySubtext}>Start tracking to see your history!</Text>
          </View>
        ) : (
          sortedLogs.map((log, index) => {
            const totalPortions = log.protein + log.veggies + log.fruit + log.wholeGrains + log.fats + log.nutsSeeds + log.legumes + log.dairy + log.water;
            
            return (
              <View key={index} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>{formatDate(log.date)}</Text>
                  <Text style={styles.logTotal}>{totalPortions} portions</Text>
                </View>

                <View style={styles.logGrid}>
                  <View style={styles.logItem}>
                    <Text style={styles.logLabel}>Protein</Text>
                    <Text style={styles.logValue}>{log.protein}</Text>
                  </View>
                  <View style={styles.logItem}>
                    <Text style={styles.logLabel}>Veggies</Text>
                    <Text style={styles.logValue}>{log.veggies}</Text>
                  </View>
                  <View style={styles.logItem}>
                    <Text style={styles.logLabel}>Fruit</Text>
                    <Text style={styles.logValue}>{log.fruit}</Text>
                  </View>
                  <View style={styles.logItem}>
                    <Text style={styles.logLabel}>Grains</Text>
                    <Text style={styles.logValue}>{log.wholeGrains}</Text>
                  </View>
                  <View style={styles.logItem}>
                    <Text style={styles.logLabel}>Fats</Text>
                    <Text style={styles.logValue}>{log.fats}</Text>
                  </View>
                  <View style={styles.logItem}>
                    <Text style={styles.logLabel}>Nuts</Text>
                    <Text style={styles.logValue}>{log.nutsSeeds}</Text>
                  </View>
                  <View style={styles.logItem}>
                    <Text style={styles.logLabel}>Legumes</Text>
                    <Text style={styles.logValue}>{log.legumes}</Text>
                  </View>
                  <View style={styles.logItem}>
                    <Text style={styles.logLabel}>Dairy</Text>
                    <Text style={styles.logValue}>{log.dairy}</Text>
                  </View>
                  <View style={styles.logItem}>
                    <Text style={styles.logLabel}>Water</Text>
                    <Text style={styles.logValue}>{log.water}</Text>
                  </View>
                </View>
              </View>
            );
          })
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
  logCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  logTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  logGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  logItem: {
    width: '30%',
    alignItems: 'center',
  },
  logLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  logValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
});
