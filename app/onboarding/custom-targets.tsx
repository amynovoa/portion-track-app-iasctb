
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Goal, DietStyle } from '@/types';
import { getDefaultTargets } from '@/utils/targetUtils';
import { IconSymbol } from '@/components/IconSymbol';

interface CustomTargets {
  protein: number;
  veggies: number;
  fruit: number;
  wholeGrains: number;
  legumes: number;
  nutsSeeds: number;
  fats: number;
  alcohol: number;
  water: number;
}

const targetLabels: { key: keyof CustomTargets; label: string }[] = [
  { key: 'protein', label: 'Protein' },
  { key: 'veggies', label: 'Veggies' },
  { key: 'fruit', label: 'Fruit' },
  { key: 'wholeGrains', label: 'Whole Grains' },
  { key: 'legumes', label: 'Legumes' },
  { key: 'nutsSeeds', label: 'Nuts & Seeds' },
  { key: 'fats', label: 'Healthy Fats' },
  { key: 'alcohol', label: 'Alcohol' },
  { key: 'water', label: 'Water' },
];

export default function CustomTargetsScreen() {
  const params = useLocalSearchParams();
  const goal = params.goal as Goal;
  const dietStyle = (params.dietStyle as DietStyle) || 'omnivore';

  // Initialize with default targets based on goal
  const defaultTargets = getDefaultTargets(goal);
  const [targets, setTargets] = useState<CustomTargets>({
    protein: defaultTargets.protein,
    veggies: defaultTargets.veggies,
    fruit: defaultTargets.fruit,
    wholeGrains: defaultTargets.wholeGrains,
    legumes: defaultTargets.legumes,
    nutsSeeds: defaultTargets.nutsSeeds,
    fats: defaultTargets.fats,
    alcohol: defaultTargets.alcohol,
    water: defaultTargets.water,
  });

  const handleTargetChange = (key: keyof CustomTargets, delta: number) => {
    setTargets((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const handleContinue = () => {
    // Navigate to weight screen with custom targets
    router.push({
      pathname: '/onboarding/weight',
      params: {
        goal,
        dietStyle,
        customTargets: JSON.stringify(targets),
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Set your daily targets</Text>
        <Text style={styles.subtitle}>
          Customize your portion goals for each food group
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.targetsContainer}>
          {targetLabels.map((item, index) => (
            <View key={index} style={styles.targetRow}>
              <Text style={styles.targetLabel}>{item.label}</Text>
              <View style={styles.targetControls}>
                <TouchableOpacity
                  style={styles.targetButton}
                  onPress={() => handleTargetChange(item.key, -1)}
                >
                  <Text style={styles.targetButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.targetValue}>{targets[item.key]}</Text>
                <TouchableOpacity
                  style={styles.targetButton}
                  onPress={() => handleTargetChange(item.key, 1)}
                >
                  <Text style={styles.targetButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.tipBox}>
          <IconSymbol
            ios_icon_name="lightbulb.fill"
            android_material_icon_name="lightbulb"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.tipText}>
            These are starting values based on your goal. You can adjust them anytime in Settings.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={buttonStyles.primary} onPress={handleContinue}>
          <Text style={buttonStyles.text}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  targetsContainer: {
    gap: 10,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
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
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingTop: 20,
  },
});
