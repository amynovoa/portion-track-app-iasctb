
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
      pathname: '/onboarding/settings',
      params: { goal, dietStyle: selectedDiet },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose your diet style</Text>
        <Text style={styles.subtitle}>
          This helps us show you relevant food options (optional)
        </Text>

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
                  size={32}
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
});
