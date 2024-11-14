import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { View } from "react-native";
import "react-native-reanimated";

import useLocation from "@/hooks/useLocation";
import { useLocationStore } from "@/store/locationStore";
import { tokenCache } from "@/utils/auth";
import { ignoreWarnings } from "@/utils/ignoreWarnings";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

const queryClient = new QueryClient();

ignoreWarnings();

export default function RootLayout() {
  useLocation();
  const { userAddress } = useLocationStore();

  const onLayoutRootView = useCallback(async () => {
    if (userAddress) {
      await SplashScreen.hideAsync();
    }
  }, [userAddress]);

  if (!userAddress) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(root)" options={{ headerShown: false }} />
            </Stack>
          </View>
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
