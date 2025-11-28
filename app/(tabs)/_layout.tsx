
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
      label: 'Today',
    },
    {
      name: 'history',
      route: '/(tabs)/history',
      icon: 'history',
      label: 'History',
    },
    {
      name: 'progress',
      route: '/(tabs)/progress',
      icon: 'show_chart',
      label: 'Progress',
    },
    {
      name: 'metrics',
      route: '/(tabs)/metrics',
      icon: 'monitor_weight',
      label: 'Metrics',
    },
    {
      name: 'settings',
      route: '/(tabs)/settings',
      icon: 'settings',
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
