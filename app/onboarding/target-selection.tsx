
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Goal, DietStyle } from '@/types';
import { IconSymbol } from '@/components/IconSymbol';

type TargetOption = 'recommended' | 'custom';

export default function TargetSelectionScreen() {
  const params = useLocalSearchParams();
  const goal = params.goal as Goal;
  const dietStyle = (params.dietStyle as DietStyle) || 'omnivore';
  const [selectedOption, setSelectedOption] = useState<TargetOption | null>(null);

  const handleContinue = () => {
    if (!selectedOption) return;

    if (selectedOption === 'recommended') {
      // Go directly to weight entry screen
      router.push({
        pathname: '/onboarding/weight',
        params: { goal, dietStyle },
      });
    } else {
      // Go to custom targets screen
      router.push({
        pathname: '/onboarding/custom-targets',
        params: { goal, dietStyle },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How do you want to set your daily portion targets?</Text>
        <Text style={styles.subtitle}>
          Choose the option that works best for you
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionCard, selectedOption === 'recommended' && styles.optionCardSelected]}
          onPress={() => setSelectedOption('recommended')}
        >
          <View style={styles.optionIcon}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={32}
              color={selectedOption === 'recommended' ? colors.primary : colors.textSecondary}
            />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Use recommended targets</Text>
            <Text style={styles.optionDescription}>Most users choose this option.</Text>
            <Text style={styles.optionSubtext}>
              We&apos;ll set balanced portion targets based on your goal
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, selectedOption === 'custom' && styles.optionCardSelected]}
          onPress={() => setSelectedOption('custom')}
        >
          <View style={styles.optionIcon}>
            <IconSymbol
              ios_icon_name="slider.horizontal.3"
              android_material_icon_name="tune"
              size={32}
              color={selectedOption === 'custom' ? colors.primary : colors.textSecondary}
            />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Set my own targets</Text>
            <Text style={styles.optionDescription}>Customize portions for each category.</Text>
            <Text style={styles.optionSubtext}>
              Perfect if you have specific dietary requirements
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <IconSymbol
          ios_icon_name="info.circle.fill"
          android_material_icon_name="info"
          size={18}
          color={colors.primary}
        />
        <Text style={styles.infoText}>
          You can always adjust your targets later in Settings
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[buttonStyles.primary, !selectedOption && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selectedOption}
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
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  optionSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
