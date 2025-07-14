import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

SplashScreen.preventAutoHideAsync();

// Inner component that uses useAuth
function AppNavigator() {
  const { isSignedIn } = useAuth();

  return (
    <Stack screenOptions={{ animation: "ios_from_right", headerShown: false }}>
      {/* Splash screen - always accessible */}
      <Stack.Screen name="index" options={{ title: "splashScreen" }} />

      {/* Auth screens - only accessible when not signed in */}
      <Stack.Protected guard={!Boolean(isSignedIn)}>
        <Stack.Screen name="screens/Auth/Login" options={{ title: "login" }} />
        <Stack.Screen
          name="screens/Auth/PhoneVerification"
          options={{ title: "phoneVerification" }}
        />
        <Stack.Screen
          name="screens/Auth/ConfirmVerfication"
          options={{ title: "confirmVerification" }}
        />
        <Stack.Screen
          name="screens/Auth/UserTypeSelection"
          options={{ title: "userTypeSelection" }}
        />
      </Stack.Protected>

      {/* Main app screens - only accessible when signed in */}
      <Stack.Protected guard={Boolean(isSignedIn)}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Thin": require("../assets/fonts/Roboto-Thin.ttf"),
    "Roboto-ExtraBold": require("../assets/fonts/Roboto-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <KeyboardProvider>
          <AppNavigator />
        </KeyboardProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
