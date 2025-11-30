
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useAppContext } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function DailyTargetsScreen() {
  const router = useRouter();
  const { targets, setTargets } = useAppContext();
  const [localTargets, setLocalTargets] = useState(targets);

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

  if (!localTargets) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Targets</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>
          Adjust your daily portion targets for each food group. These targets will help guide your daily tracking.
        </Text>

        <View style={styles.section}>
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

        <View style={styles.tipSection}>
          <IconSymbol
            ios_icon_name="lightbulb.fill"
            android_material_icon_name="lightbulb"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.tipText}>
            Tip: Your targets are based on your health goal. Adjust them to match your personal needs and preferences.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
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
  text: {
    color: colors.text,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
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
  tipSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
