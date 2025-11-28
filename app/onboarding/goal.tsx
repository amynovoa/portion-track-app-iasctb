
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
      <View style={styles.header}>
        <Text style={styles.title}>What&apos;s your goal?</Text>
        <Text style={styles.subtitle}>
          We&apos;ll customize your daily portion targets
        </Text>
      </View>

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
                size={28}
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
    paddingHorizontal: 24,
    paddingBottom: 40,
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
  optionsContainer: {
    flex: 1,
    gap: 12,
    justifyContent: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  optionIcon: {
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 3,
  },
  optionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    paddingTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
