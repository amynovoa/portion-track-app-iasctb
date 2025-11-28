
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { MetricWeight } from '@/types';
import { formatDate, getTodayDate } from '@/utils/dateUtils';
import { IconSymbol } from '@/components/IconSymbol';

export default function MetricsScreen() {
  const [metrics, setMetrics] = useState<MetricWeight[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const metricsData = await storage.getWeightMetrics();
    const sortedMetrics = metricsData.sort((a, b) => b.date.localeCompare(a.date));
    setMetrics(sortedMetrics);
  };

  const handleAddWeight = async () => {
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight value.');
      return;
    }

    const today = getTodayDate();
    const existingIndex = metrics.findIndex((m) => m.date === today);

    let updatedMetrics: MetricWeight[];
    if (existingIndex >= 0) {
      updatedMetrics = [...metrics];
      updatedMetrics[existingIndex] = { date: today, value: weight };
    } else {
      updatedMetrics = [...metrics, { date: today, value: weight }];
    }

    await storage.setWeightMetrics(updatedMetrics);
    setMetrics(updatedMetrics.sort((a, b) => b.date.localeCompare(a.date)));
    setNewWeight('');
    setShowAddForm(false);
  };

  const handleDeleteWeight = async (date: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this weight entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedMetrics = metrics.filter((m) => m.date !== date);
            await storage.setWeightMetrics(updatedMetrics);
            setMetrics(updatedMetrics);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Portion Track</Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Weight Metrics</Text>
          <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
            <IconSymbol
              ios_icon_name={showAddForm ? 'xmark.circle.fill' : 'plus.circle.fill'}
              android_material_icon_name={showAddForm ? 'cancel' : 'add_circle'}
              size={32}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Enter weight (lbs)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="decimal-pad"
            value={newWeight}
            onChangeText={setNewWeight}
          />
          <TouchableOpacity style={buttonStyles.primary} onPress={handleAddWeight}>
            <Text style={buttonStyles.text}>Add Weight</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {metrics.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol
              ios_icon_name="scalemass"
              android_material_icon_name="monitor_weight"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No weight entries yet</Text>
            <Text style={styles.emptySubtext}>Add your first weight entry above</Text>
          </View>
        ) : (
          metrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={styles.metricContent}>
                <Text style={styles.metricDate}>{formatDate(metric.date)}</Text>
                <Text style={styles.metricValue}>{metric.value} lbs</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteWeight(metric.date)}>
                <IconSymbol
                  ios_icon_name="trash"
                  android_material_icon_name="delete"
                  size={24}
                  color={colors.error}
                />
              </TouchableOpacity>
            </View>
          ))
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
    marginBottom: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  addForm: {
    padding: 24,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
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
  metricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
});
