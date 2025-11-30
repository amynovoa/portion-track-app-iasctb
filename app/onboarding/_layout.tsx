
import { Stack } from 'expo-router';
import React from 'react';

export const unstable_settings = {
  initialRouteName: "welcome",
};

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="goal" options={{ headerShown: false }} />
      <Stack.Screen name="diet" options={{ headerShown: false }} />
      <Stack.Screen name="target-selection" options={{ headerShown: false }} />
      <Stack.Screen name="custom-targets" options={{ headerShown: false }} />
      <Stack.Screen name="weight" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
}
