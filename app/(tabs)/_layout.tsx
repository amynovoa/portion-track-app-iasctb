
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export const unstable_settings = {
  initialRouteName: "today",
};

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: 'today',
      route: '/(tabs)/today',
      icon: 'home',
      iosIcon: 'house.fill',
      label: 'Today',
    },
    {
      name: 'history',
      route: '/(tabs)/history',
      icon: 'history',
      iosIcon: 'clock.fill',
      label: 'History',
    },
    {
      name: 'progress',
      route: '/(tabs)/progress',
      icon: 'show-chart',
      iosIcon: 'chart.line.uptrend.xyaxis',
      label: 'Progress',
    },
    {
      name: 'metrics',
      route: '/(tabs)/metrics',
      icon: 'monitor_weight',
      iosIcon: 'scalemass.fill',
      label: 'Weight',
    },
    {
      name: 'settings',
      route: '/(tabs)/settings',
      icon: 'settings',
      iosIcon: 'gearshape.fill',
      label: 'Settings',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="today" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ headerShown: false }} />
        <Stack.Screen name="progress" options={{ headerShown: false }} />
        <Stack.Screen name="metrics" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
