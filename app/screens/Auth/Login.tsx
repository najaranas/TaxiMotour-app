import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  TouchableHighlight,
  Text,
} from "react-native";
import PhoneSelector from "@/components/common/PhoneSelector";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Typo from "@/components/common/Typo";
import THEME, { COLORS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Button from "@/components/common/Button";
import {
  AppleIcon,
  FacebookIcon,
  GoolgeIcon,
} from "@/components/common/SvgIcons";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://adjxlxetifrtxfygomse.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkanhseGV0aWZydHhmeWdvbXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDA3MjcsImV4cCI6MjA2ODUxNjcyN30.QSJBRz5VEJkVydmX6n6sEV5ntO6p9H2gudmvvv-NXSc";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Complete the WebBrowser auth session
WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const { startSSOFlow } = useSSO();

  // Warm up browser for better performance
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const onSocialPress = async (
    type: "oauth_google" | "oauth_apple" | "oauth_facebook"
  ) => {
    // Prevent multiple simultaneous requests
    if (googleLoading || facebookLoading || appleLoading) return;

    if (type === "oauth_apple") {
      setAppleLoading(true);
    } else if (type === "oauth_facebook") {
      setFacebookLoading(true);
    } else {
      setGoogleLoading(true);
    }

    const providerName = type.replace("oauth_", "");
    console.log(`Starting ${providerName} OAuth...`);
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: type,
          redirectUrl: Linking.createURL("/(tabs)/Home", {
            scheme: "taximotour",
          }),
        });

      console.log("OAuth result:", {
        createdSessionId,
        signInStatus: signIn?.status,
        signUpStatus: signUp?.status,
      });

      // Check if OAuth was successful
      if (createdSessionId) {
        console.log("New session created successfully");
        if (setActive) {
          await setActive({ session: createdSessionId });
          console.log("Session activated, navigating to home");
          router.replace("/(tabs)/Home");
        }
      } else if (signIn?.status === "complete") {
        console.log("Existing user signed in successfully");
        router.replace("/(tabs)/Home");
      } else if (signUp?.status === "complete") {
        console.log("New user signed up successfully");
        router.replace("/(tabs)/Home");
      } else {
        // OAuth was cancelled or incomplete
        console.log("OAuth cancelled or incomplete - no navigation");
        // Don't navigate anywhere, just stop loading
      }
    } catch (err: any) {
      console.error(
        `${providerName} OAuth error:`,
        JSON.stringify(err, null, 2)
      );

      // Check if error is due to user cancellation
      const errorMessage = err?.message || "";
      const isUserCancellation =
        errorMessage.includes("cancelled") ||
        errorMessage.includes("dismissed") ||
        errorMessage.includes("closed");

      if (!isUserCancellation) {
        Alert.alert(
          "Error",
          `${providerName} sign-in failed. Please try again.`
        );
      } else {
        console.log(`User cancelled ${providerName} OAuth`);
      }
    } finally {
      if (type === "oauth_apple") {
        setAppleLoading(false);
      } else if (type === "oauth_facebook") {
        setFacebookLoading(false);
      } else {
        setGoogleLoading(false);
      }
    }
  };

  return (
    <ScreenWrapper
      safeArea
      padding={horizontalScale(15)}
      scroll
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.loginContaienr}>
        <Typo color={THEME.text.primary} variant="h3" style={styles.centerText}>
          Enter your number
        </Typo>

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Typo
            color={THEME.text.muted}
            variant="body"
            style={styles.separatorText}>
            Or
          </Typo>
          <View style={styles.separatorLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <Button
            onPress={() => onSocialPress("oauth_google")}
            style={styles.socialButtons}
            loading={googleLoading}>
            <GoolgeIcon size={verticalScale(30)} />
            <Typo variant="body">Sign in with Google</Typo>
          </Button>
          <Button
            onPress={() => onSocialPress("oauth_apple")}
            style={styles.socialButtons}
            loading={appleLoading}>
            <AppleIcon size={verticalScale(30)} />
            <Typo variant="body">Sign in with Apple</Typo>
          </Button>
          <Button
            onPress={() => onSocialPress("oauth_facebook")}
            style={styles.socialButtons}
            loading={facebookLoading}>
            <FacebookIcon size={verticalScale(30)} />
            <Typo variant="body">Sign in with Facebook</Typo>
          </Button>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Typo
          variant="caption"
          color={THEME.text.secondary}
          style={styles.centerText}>
          By continuing, you agree to our secure service.
        </Typo>
        <Typo
          variant="body"
          color={THEME.text.muted}
          style={styles.centerText}
          size={moderateScale(15)}>
          Taximotour - Safe rides across Tunisia
        </Typo>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  loginContaienr: {
    gap: verticalScale(15),
    flex: 1,
    justifyContent: "center",
  },
  centerText: { textAlign: "center" },

  separator: {
    flexDirection: "row",
    alignItems: "center",
  },
  separatorLine: {
    height: 1,
    flex: 1,
    backgroundColor: COLORS.gray[200],
  },
  separatorText: {
    paddingHorizontal: horizontalScale(10),
  },
  socialButtonsContainer: {
    gap: horizontalScale(10),
  },
  socialButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(30),
    borderRadius: THEME.borderRadius.pill,
    padding: horizontalScale(15),
    borderWidth: THEME.borderWidth.thin,
    borderColor: COLORS.gray[200],
    minHeight: verticalScale(65),
  },
  footerContainer: {
    alignItems: "center",
    paddingTop: verticalScale(15),
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
});
