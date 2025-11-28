
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { storage } from "@/utils/storage";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkOnboarding() {
      const complete = await storage.isOnboardingComplete();
      setIsOnboardingComplete(complete);
      
      if (loaded) {
        SplashScreen.hideAsync();
        
        if (!complete) {
          router.replace('/onboarding/welcome');
        }
      }
    }
    
    checkOnboarding();
  }, [loaded]);

  if (!loaded || isOnboardingComplete === null) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(185, 56, 34)",
      background: "rgb(255, 255, 255)",
      card: "rgb(245, 245, 245)",
      text: "rgb(0, 0, 0)",
      border: "rgb(224, 224, 224)",
      notification: "rgb(185, 56, 34)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(185, 56, 34)",
      background: "rgb(0, 0, 0)",
      card: "rgb(28, 28, 30)",
      text: "rgb(255, 255, 255)",
      border: "rgb(44, 44, 46)",
      notification: "rgb(185, 56, 34)",
    },
  };

  return (
    <>
      <StatusBar style="auto" animated />
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <GestureHandlerRootView>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <SystemBars style={"auto"} />
        </GestureHandlerRootView>
      </ThemeProvider>
    </>
  );
}
