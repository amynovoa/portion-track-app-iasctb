
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { DietStyle, Goal } from '@/types';
import { IconSymbol } from '@/components/IconSymbol';

const dietStyles: { value: DietStyle; label: string; description: string; icon: { ios: string; android: string } }[] = [
  {
    value: 'omnivore',
    label: 'Omnivore',
    description: 'Eat all food groups including meat, dairy, and plants',
    icon: { ios: 'fork.knife', android: 'restaurant' },
  },
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    description: 'Plant-based diet including dairy and eggs',
    icon: { ios: 'leaf.fill', android: 'eco' },
  },
  {
    value: 'vegan',
    label: 'Vegan',
    description: 'Fully plant-based diet',
    icon: { ios: 'leaf.circle.fill', android: 'spa' },
  },
];

export default function DietScreen() {
  const params = useLocalSearchParams();
  const goal = params.goal as Goal;
  const [selectedDiet, setSelectedDiet] = useState<DietStyle>('omnivore');

  const handleContinue = () => {
    router.push({
      pathname: '/onboarding/target-selection',
      params: { goal, dietStyle: selectedDiet },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose your diet style</Text>
        <Text style={styles.subtitle}>
          This helps us show you relevant food options
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {dietStyles.map((diet) => (
          <TouchableOpacity
            key={diet.value}
            style={[styles.optionCard, selectedDiet === diet.value && styles.optionCardSelected]}
            onPress={() => setSelectedDiet(diet.value)}
          >
            <View style={styles.optionIcon}>
              <IconSymbol
                ios_icon_name={diet.icon.ios}
                android_material_icon_name={diet.icon.android}
                size={28}
                color={selectedDiet === diet.value ? colors.primary : colors.textSecondary}
              />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{diet.label}</Text>
              <Text style={styles.optionDescription}>{diet.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

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
});
