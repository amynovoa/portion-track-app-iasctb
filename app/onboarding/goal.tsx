
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Goal } from '@/types';
import { IconSymbol } from '@/components/IconSymbol';

const goals: { value: Goal; label: string; description: string; icon: { ios: string; android: string } }[] = [
  {
    value: 'weight_loss',
    label: 'Weight Loss',
    description: 'Balanced portions to support healthy weight management',
    icon: { ios: 'arrow.down.circle.fill', android: 'trending_down' },
  },
  {
    value: 'maintenance',
    label: 'Maintenance',
    description: 'Maintain your current weight with balanced nutrition',
    icon: { ios: 'equal.circle.fill', android: 'trending_flat' },
  },
  {
    value: 'heart_health',
    label: 'Heart Health',
    description: 'Focus on heart-healthy foods and portions',
    icon: { ios: 'heart.fill', android: 'favorite' },
  },
];

export default function GoalScreen() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleContinue = () => {
    if (selectedGoal) {
      router.push({
        pathname: '/onboarding/diet',
        params: { goal: selectedGoal },
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What&apos;s your goal?</Text>
        <Text style={styles.subtitle}>
          We&apos;ll customize your daily portion targets based on your goal
        </Text>

        <View style={styles.optionsContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.value}
              style={[styles.optionCard, selectedGoal === goal.value && styles.optionCardSelected]}
              onPress={() => setSelectedGoal(goal.value)}
            >
              <View style={styles.optionIcon}>
                <IconSymbol
                  ios_icon_name={goal.icon.ios}
                  android_material_icon_name={goal.icon.android}
                  size={32}
                  color={selectedGoal === goal.value ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{goal.label}</Text>
                <Text style={styles.optionDescription}>{goal.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[buttonStyles.primary, !selectedGoal && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selectedGoal}
        >
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
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
