import { COLORS } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StatusBar, StyleSheet } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import * as NavigationBar from "expo-navigation-bar";
import { useTheme } from "@/contexts/ThemeContext";

export default function Index() {
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const changeNavigationBar = async () => {
      try {
        // Only set button style, avoid setBackgroundColorAsync
        await NavigationBar.setButtonStyleAsync(
          themeName === "dark" ? "light" : "dark" // Fix: should be "dark" for light theme
        );

        // Check if edge-to-edge is enabled before setting background
        const behavior = await NavigationBar.getBehaviorAsync();
        if (behavior !== "edge-to-edge") {
          // Only set background color if not in edge-to-edge mode
          await NavigationBar.setBackgroundColorAsync(
            themeName === "dark" ? COLORS.dark : COLORS.light
          );
        }
      } catch (error) {
        console.log("Error changing navigation bar style:", error);
      }
    };

    changeNavigationBar();
    // ... rest of your effect
  }, [isLoaded, isSignedIn, router, theme, themeName]);
  return (
    <ScreenWrapper style={styles.container}>
      <Image
        resizeMode="contain"
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />
      <StatusBar barStyle={"light-content"} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },

  logo: {
    height: verticalScale(250),
    aspectRatio: 1,
  },
});
