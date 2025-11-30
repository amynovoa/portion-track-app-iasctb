
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, TouchableOpacity, Alert, Switch } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useAppContext } from '@/contexts/AppContext';
import { storage } from '@/utils/storage';
import { DailyLog } from '@/types';
import { IconSymbol } from '@/components/IconSymbol';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, targets, allLogs, refreshData, setUser, setTargets } = useAppContext();
  const [localTargets, setLocalTargets] = useState(targets);

  useFocusEffect(
    useCallback(() => {
      console.log('=== Settings screen focused ===');
      refreshData();
    }, [refreshData])
  );

  React.useEffect(() => {
    setLocalTargets(targets);
  }, [targets]);

  const handleTargetChange = async (key: keyof typeof targets, delta: number) => {
    if (!localTargets) return;

    const newValue = Math.max(0, localTargets[key] + delta);
    const updatedTargets = { ...localTargets, [key]: newValue };
    setLocalTargets(updatedTargets);
    
    try {
      await setTargets(updatedTargets);
    } catch (error) {
      console.error('Error updating targets:', error);
      Alert.alert('Error', 'Failed to save targets. Please try again.');
    }
  };

  const handleExportData = async () => {
    try {
      const csvHeader = 'Date,Protein,Veggies,Fruit,Whole Grains,Fats,Nuts & Seeds,Legumes,Dairy,Water,Alcohol\n';
      const csvRows = allLogs.map((log: DailyLog) => 
        `${log.date},${log.protein},${log.veggies},${log.fruit},${log.wholeGrains},${log.fats},${log.nutsSeeds},${log.legumes},${log.dairy},${log.water},${log.alcohol}`
      ).join('\n');
      
      const csvContent = csvHeader + csvRows;
      
      Alert.alert(
        'Export Data',
        'CSV data is ready. In a production app, this would be saved to a file or shared.',
        [
          { text: 'OK' }
        ]
      );
      
      console.log('CSV Export:\n', csvContent);
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.clearAll();
              router.replace('/');
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset data. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (!user || !localTargets) {
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
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Targets</Text>
          
          {[
            { key: 'protein', label: 'Protein' },
            { key: 'veggies', label: 'Veggies' },
            { key: 'fruit', label: 'Fruit' },
            { key: 'wholeGrains', label: 'Whole Grains' },
            { key: 'fats', label: 'Healthy Fats' },
            { key: 'nutsSeeds', label: 'Nuts & Seeds' },
            { key: 'legumes', label: 'Legumes' },
            { key: 'dairy', label: 'Dairy' },
            { key: 'water', label: 'Water' },
          ].map((item, index) => (
            <View key={index} style={styles.targetRow}>
              <Text style={styles.targetLabel}>{item.label}</Text>
              <View style={styles.targetControls}>
                <TouchableOpacity
                  style={styles.targetButton}
                  onPress={() => handleTargetChange(item.key as keyof typeof targets, -1)}
                >
                  <Text style={styles.targetButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.targetValue}>{localTargets[item.key as keyof typeof targets]}</Text>
                <TouchableOpacity
                  style={styles.targetButton}
                  onPress={() => handleTargetChange(item.key as keyof typeof targets, 1)}
                >
                  <Text style={styles.targetButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Goal</Text>
            <Text style={styles.infoValue}>{user.goal.replace('_', ' ')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Diet Style</Text>
            <Text style={styles.infoValue}>{user.dietStyle}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reset Time</Text>
            <Text style={styles.infoValue}>{user.resetTime}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <IconSymbol
              ios_icon_name="square.and.arrow.up"
              android_material_icon_name="file-upload"
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
              color={colors.warning}
            />
            <Text style={[styles.actionButtonText, styles.dangerText]}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.privacyNote}>
            🔒 Privacy Note: All your data stays on your device unless you export it.
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
  text: {
    color: colors.text,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  targetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  targetControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  targetButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  targetValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textSecondary,
    textTransform: 'capitalize',
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
    color: colors.primary,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: colors.warning,
  },
  dangerText: {
    color: colors.warning,
  },
  privacyNote: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
