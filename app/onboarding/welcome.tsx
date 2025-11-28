
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Portion Track</Text>
        </View>
        <Text style={styles.title}>Welcome to Portion Track</Text>
        <Text style={styles.subtitle}>
          Track your daily food portions by food group, not calories
        </Text>
        <Text style={styles.description}>
          Build healthy eating habits with simple portion tracking designed for your wellness goals.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={buttonStyles.primary}
          onPress={() => router.push('/onboarding/goal')}
        >
          <Text style={buttonStyles.text}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
  },
});
