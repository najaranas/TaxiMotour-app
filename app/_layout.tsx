import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../i18n";
import { initializeLanguage } from "@/utils/translation/languageUtils";
import { useTranslation } from "react-i18next";

import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import StorageManager from "@/utils/storage";

SplashScreen.preventAutoHideAsync();

// Inner component that uses useAuth
function AppNavigator() {
  const { isSignedIn } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        animation: "ios_from_right",
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}>
      {/* Splash screen - always accessible */}
      <Stack.Screen name="index" options={{ title: "splashScreen" }} />

      {/* Shared verification screen - accessible from both auth and main flows */}
      <Stack.Screen
        name="(common)/ConfirmVerfication"
        options={{ title: "confirmVerification" }}
      />

      <Stack.Screen
        name="(auth)/UserTypeSelection"
        options={{ title: "userTypeSelection" }}
      />

      {/* Auth screens - only accessible when not signed in */}
      <Stack>
        <Stack.Screen name="(auth)/Login" options={{ title: "login" }} />
        <Stack.Screen
          name="(auth)/PhoneVerification"
          options={{ title: "phoneVerification" }}
        />
      </Stack>

      {/* Main app screens - only accessible when signed in */}
      <Stack>
        {/* Tab navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Profile screens */}
        <Stack.Screen
          name="(profile)/PersonalInfo"
          options={{ title: t("profile.personalInfo") }}
        />
        <Stack.Screen
          name="(profile)/EditPersonalInfo"
          options={{ title: t("profile.editPersonalInfo") }}
        />
        <Stack.Screen
          name="(profile)/Selfie"
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="(profile)/CheckSelfie"
          options={{ title: t("profile.checkSelfie") }}
        />
        <Stack.Screen
          name="(profile)/Languages"
          options={{ title: t("profile.language") }}
        />
        <Stack.Screen
          name="(profile)/Test"
          options={{
            title: "Test",
            headerShown: true,
          }}
        />

        {/* Drawer screens */}
        <Stack.Screen
          name="(drawer)/About"
          options={{ title: t("drawer.about") }}
        />

        {/* Ride screens */}
        <Stack.Screen
          name="(rides)/[rideId]/index"
          options={{ title: t("rides.rideDetails") }}
        />
        <Stack.Screen
          name="(rides)/[rideId]/RideMap"
          options={{
            title: t("rides.rideMap"),
            animation: "slide_from_bottom",
          }}
        />

        {/* About screen (root level) */}
        <Stack.Screen name="About" options={{ title: t("about.title") }} />
      </Stack>
    </Stack>
  );
}

export default function RootLayout() {
  const language = StorageManager.retrieveLanguagePreference() || "fr";

  const LTRFonts = {
    Regular: require("../assets/fonts/Roboto-Regular.ttf"),
    Bold: require("../assets/fonts/Roboto-Bold.ttf"),
    Medium: require("../assets/fonts/Roboto-Medium.ttf"),
    Light: require("../assets/fonts/Roboto-Light.ttf"),
    Thin: require("../assets/fonts/Roboto-Thin.ttf"),
    ExtraBold: require("../assets/fonts/Roboto-ExtraBold.ttf"),
  };

  const arabicFonts = {
    Regular: require("../assets/fonts/Tajawal-Regular.ttf"),
    Bold: require("../assets/fonts/Tajawal-Bold.ttf"),
    Medium: require("../assets/fonts/Tajawal-Medium.ttf"),
    Light: require("../assets/fonts/Tajawal-Light.ttf"),
    Thin: require("../assets/fonts/Tajawal-Light.ttf"),
    ExtraBold: require("../assets/fonts/Tajawal-ExtraBold.ttf"),
  };
  const [fontsLoaded] = useFonts(language === "ar" ? arabicFonts : LTRFonts);
  const { setTheme } = useTheme();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    setTheme(StorageManager.retrieveThemePreference() || "light");
    initializeLanguage();
  }, [setTheme]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <BottomSheetModalProvider>
          <KeyboardProvider>
            <ThemeProvider>
              <AppNavigator />
            </ThemeProvider>
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
