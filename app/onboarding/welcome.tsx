
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/c120b509-3f86-4f37-80ee-1220bafc3458.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>Portion Track</Text>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Track your daily food portions by food group, not calories
        </Text>
        <Text style={styles.description}>
          Build healthy eating habits with simple portion tracking designed for your wellness goals.
        </Text>
      </ScrollView>

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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  logoContainer: {
    marginBottom: 24,
    height: 400,
    width: '100%',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
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
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingTop: 20,
  },
});
