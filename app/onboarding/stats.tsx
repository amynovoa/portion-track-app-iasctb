
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Goal, Sex } from '@/types';
import { IconSymbol } from '@/components/IconSymbol';

const sexOptions: { value: Sex; label: string }[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
];

export default function StatsScreen() {
  const params = useLocalSearchParams();
  const goal = params.goal as Goal;
  const [currentWeight, setCurrentWeight] = useState('');
  const [sex, setSex] = useState<Sex>('Prefer not to say');

  const handleContinue = () => {
    const weightValue = parseFloat(currentWeight);
    if (!currentWeight || isNaN(weightValue) || weightValue <= 0) {
      Alert.alert('Weight Required', 'Please enter your current weight to continue.');
      return;
    }

    router.push({
      pathname: '/onboarding/target',
      params: {
        goal,
        currentWeight: currentWeight,
        sex,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Current Stats</Text>
          <Text style={styles.subtitle}>
            Help us personalize your portion plan
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Current Weight (required)</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter weight"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={currentWeight}
                  onChangeText={setCurrentWeight}
                  returnKeyType="done"
                />
                <Text style={styles.unit}>lbs</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Sex</Text>
            <View style={styles.optionsContainer}>
              {sexOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.optionCard, sex === option.value && styles.optionCardSelected]}
                  onPress={() => setSex(option.value)}
                >
                  <Text style={[styles.optionText, sex === option.value && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                  {sex === option.value && (
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check_circle"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[buttonStyles.primary, !currentWeight && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!currentWeight}
          >
            <Text style={buttonStyles.text}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
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
  content: {
    flex: 1,
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  inputRow: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  unit: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  optionsContainer: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  buttonContainer: {
    width: '100%',
    paddingTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
