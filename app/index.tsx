
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { storage } from '@/utils/storage';
import { colors } from '@/styles/commonStyles';

export default function Index() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkOnboarding() {
      const complete = await storage.isOnboardingComplete();
      console.log('Onboarding complete:', complete);
      setIsOnboardingComplete(complete);
    }
    
    checkOnboarding();
  }, []);

  if (isOnboardingComplete === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isOnboardingComplete) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <Redirect href="/(tabs)/today" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
