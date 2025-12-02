
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Goal, Sex, DietStyle } from '@/types';
import { calculatePortionPlan, getSizeCategory } from '@/utils/targetUtils';
import { IconSymbol } from '@/components/IconSymbol';

const portionLabels: { [key: string]: { label: string; icon: { ios: string; android: string } } } = {
  protein: { label: 'Protein', icon: { ios: 'fork.knife', android: 'restaurant' } },
  veggies: { label: 'Veggies', icon: { ios: 'leaf.fill', android: 'eco' } },
  fruit: { label: 'Fruit', icon: { ios: 'apple.logo', android: 'apple' } },
  wholeGrains: { label: 'Whole Grains', icon: { ios: 'circle.grid.3x3.fill', android: 'grain' } },
  legumes: { label: 'Legumes', icon: { ios: 'circle.fill', android: 'circle' } },
  fats: { label: 'Fats', icon: { ios: 'drop.fill', android: 'water_drop' } },
  nutsSeeds: { label: 'Nuts & Seeds', icon: { ios: 'circle.hexagongrid.fill', android: 'hexagon' } },
  alcohol: { label: 'Alcohol (goal)', icon: { ios: 'wineglass', android: 'local_bar' } },
  water: { label: 'Water', icon: { ios: 'drop.fill', android: 'water_drop' } },
};

export default function SummaryScreen() {
  const params = useLocalSearchParams();
  const goal = params.goal as Goal;
  const currentWeight = parseFloat(params.currentWeight as string);
  const sex = params.sex as Sex;
  const targetWeightStr = params.targetWeight as string;
  const targetWeight = targetWeightStr ? parseFloat(targetWeightStr) : undefined;

  const portionPlan = useMemo(() => {
    return calculatePortionPlan(goal, sex, currentWeight, targetWeight);
  }, [goal, sex, currentWeight, targetWeight]);

  const sizeCategory = useMemo(() => {
    return getSizeCategory(sex, currentWeight);
  }, [sex, currentWeight]);

  const handleContinue = () => {
    router.push({
      pathname: '/onboarding/diet',
      params: {
        goal,
        currentWeight: currentWeight.toString(),
        sex,
        targetWeight: targetWeight?.toString() || '',
        portionPlan: JSON.stringify(portionPlan),
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Portion Plan</Text>
          <Text style={styles.subtitle}>
            Based on your {goal.toLowerCase()} goal
          </Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Size Category:</Text>
            <Text style={styles.statValue}>{sizeCategory}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Weight:</Text>
            <Text style={styles.statValue}>{currentWeight} lbs</Text>
          </View>
          {targetWeight && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Target Weight:</Text>
              <Text style={styles.statValue}>{targetWeight} lbs</Text>
            </View>
          )}
        </View>

        <View style={styles.planSection}>
          <Text style={styles.planTitle}>Daily Portion Targets</Text>
          <View style={styles.portionsGrid}>
            {Object.entries(portionPlan).map(([key, value]) => {
              const info = portionLabels[key];
              if (!info) return null;
              
              return (
                <View key={key} style={styles.portionCard}>
                  <View style={styles.portionIcon}>
                    <IconSymbol
                      ios_icon_name={info.icon.ios}
                      android_material_icon_name={info.icon.android}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.portionLabel}>{info.label}</Text>
                  <Text style={styles.portionValue}>{value}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.noteCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.noteText}>
            You can adjust these targets anytime in Settings
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
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
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
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  planSection: {
    marginBottom: 24,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  portionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  portionCard: {
    width: '31%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  portionIcon: {
    marginBottom: 4,
  },
  portionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  portionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
  },
});
