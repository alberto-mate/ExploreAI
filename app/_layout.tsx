import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import "react-native-reanimated";
import { tokenCache } from "@/utils/auth";
import { ignoreWarnings } from "@/utils/ignoreWarnings";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

const queryClient = new QueryClient();

ignoreWarnings();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(root)" options={{ headerShown: false }} />
          </Stack>
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
