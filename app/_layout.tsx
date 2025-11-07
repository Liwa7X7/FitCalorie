import "@rork/polyfills";
import { BundleInspector } from '@rork/inspector';
import { RorkSafeInsets } from '@rork/safe-insets';
import { RorkErrorBoundary } from '@rork/rork-error-boundary';
// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FoodProvider } from "@/contexts/FoodContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = React.useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsNavigationReady(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'sign-up';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isNavigationReady, router]);

  useEffect(() => {
    if (isNavigationReady) {
      SplashScreen.hideAsync();
    }
  }, [isNavigationReady]);

  if (!isNavigationReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "Back", animation: "fade" }}>
      <Stack.Screen name="login" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "fade" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <FoodProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BundleInspector><RorkSafeInsets><RorkErrorBoundary><RootLayoutNav /></RorkErrorBoundary></RorkSafeInsets></BundleInspector>
            </GestureHandlerRootView>
          </FoodProvider>
        </UserProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
