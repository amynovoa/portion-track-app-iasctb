
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
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
import { AppProvider } from "@/contexts/AppContext";
import { setupNotificationResponseHandler, getLastNotificationResponse } from "@/utils/notifications";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Setup notification handlers
  useEffect(() => {
    console.log('Setting up notification handlers in root layout');
    
    // Handle notification taps when app is running
    const subscription = setupNotificationResponseHandler((screen) => {
      console.log('Notification handler: navigating to', screen);
      if (screen === 'today') {
        router.push('/(tabs)/today');
      }
    });

    // Check if app was opened from a notification (when app was killed)
    const checkLastNotification = async () => {
      const lastResponse = await getLastNotificationResponse();
      if (lastResponse) {
        const screen = lastResponse.notification.request.content.data?.screen;
        console.log('App opened from notification, screen:', screen);
        if (screen === 'today') {
          // Small delay to ensure navigation is ready
          setTimeout(() => {
            router.push('/(tabs)/today');
          }, 500);
        }
      }
    };

    checkLastNotification();

    return () => {
      subscription.remove();
    };
  }, [router]);

  if (!loaded) {
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
        <AppProvider>
          <GestureHandlerRootView>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <SystemBars style={"auto"} />
          </GestureHandlerRootView>
        </AppProvider>
      </ThemeProvider>
    </>
  );
}
