
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Goal, DietStyle } from '@/types';
import { IconSymbol } from '@/components/IconSymbol';

export default function WeightScreen() {
  const params = useLocalSearchParams();
  const goal = params.goal as Goal;
  const dietStyle = (params.dietStyle as DietStyle) || 'omnivore';
  const [weight, setWeight] = useState('');

  const handleContinue = () => {
    const weightValue = parseFloat(weight);
    if (weight && (isNaN(weightValue) || weightValue <= 0)) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight value or leave it empty to skip.');
      return;
    }

    router.push({
      pathname: '/onboarding/settings',
      params: { goal, dietStyle, initialWeight: weight || '' },
    });
  };

  const handleSkip = () => {
    router.push({
      pathname: '/onboarding/settings',
      params: { goal, dietStyle, initialWeight: '' },
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
          <Text style={styles.title}>What&apos;s your current weight?</Text>
          <Text style={styles.subtitle}>
            This helps us track your progress over time
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <IconSymbol
              ios_icon_name="scalemass.fill"
              android_material_icon_name="monitor_weight"
              size={80}
              color={colors.primary}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter weight"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
              <Text style={styles.unit}>lbs</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.enterButton} 
              onPress={handleContinue}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="arrow.right.circle.fill"
                android_material_icon_name="arrow_circle_right"
                size={56}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.note}>
            You can add or update your weight anytime in the Metrics tab
          </Text>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip for now</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  iconContainer: {
    marginBottom: 40,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
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
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  unit: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  enterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 64,
  },
  note: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  skipButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});
