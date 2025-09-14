import { StyleSheet, View, Alert } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Typo from "@/components/common/Typo";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Button from "@/components/common/Button";
import {
  AppleIcon,
  FacebookIcon,
  GoolgeIcon,
  TunisiaFlag,
} from "@/components/common/SvgIcons";
import { useSession, useSSO, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import PhoneNumberField from "@/components/common/PhoneNumberField";
import Seperator from "@/components/common/Seperator";
import { getSupabaseClient } from "@/services/supabaseClient";
import { useUserData } from "@/store/userStore";

// Complete the WebBrowser auth session
WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const [loginLoading, setLoginLoading] = useState<
    "google" | "facebook" | "appgle" | null
  >(null);

  const { startSSOFlow } = useSSO();
  const { session: clerkSession } = useSession();
  const { user } = useUser();
  const { setUserData } = useUserData();

  // Warm up browser for better performance
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const onSocialPress = async (
    type: "oauth_google" | "oauth_apple" | "oauth_facebook"
  ) => {
    // Prevent multiple simultaneous requests
    if (loginLoading) return;

    if (type === "oauth_apple") {
      setLoginLoading("appgle");
    } else if (type === "oauth_facebook") {
      setLoginLoading("facebook");
    } else {
      setLoginLoading("google");
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

      let shouldNavigate = false;

      // Check if OAuth was successful
      if (createdSessionId) {
        console.log("New session created successfully");
        if (setActive) {
          await setActive({ session: createdSessionId });
          console.log("Session activated");
          shouldNavigate = true;
        }
      } else if (signIn?.status === "complete") {
        console.log("Existing user signed in successfully");
        shouldNavigate = true;
      } else if (signUp?.status === "complete") {
        console.log("New user signed up successfully");
        shouldNavigate = true;
      } else {
        // OAuth was cancelled or incomplete
        console.log("OAuth cancelled or incomplete - no navigation");
        // Don't navigate anywhere, just stop loading
      }

      // If login was successful, navigate to home
      // Database sync will be handled by AuthWrapper automatically
      if (shouldNavigate) {
        try {
          const supabase = getSupabaseClient(clerkSession);

          // Check both drivers and passengers tables for existing user
          const [driversResponse, passengersResponse] = await Promise.all([
            supabase
              .from("drivers")
              .select("*")
              .eq("user_id", user?.id)
              .single(),
            supabase
              .from("passengers")
              .select("*")
              .eq("user_id", user?.id)
              .single(),
          ]);

          console.log("user id :", user?.id);
          console.log("Drivers response:", driversResponse);
          console.log("Passengers response:", passengersResponse);

          // Check if user exists in either table
          const driverData = driversResponse.data;
          const passengerData = passengersResponse.data;

          if (driverData || passengerData) {
            // User exists - store their data
            const userData = driverData || passengerData;

            setUserData({
              email_address: userData.email_address,
              phone_number: userData.phone_number,
              full_name: userData.full_name,
              first_name: userData.first_name,
              last_name: userData.last_name,
              experience_years: userData.experience_years,
              moto_type: userData.moto_type,
              user_type: userData.user_type,
            });

            console.log("Existing user found, navigating to Home");
            router.replace("/(tabs)/Home");
          } else {
            // New user - redirect to user type selection
            console.log("New user detected, navigating to user type selection");
            router.replace("/(auth)/UserTypeSelection");
          }
        } catch (error) {
          console.error("Error checking user in Supabase:", error);
          // On error, redirect to user type selection as fallback
          router.replace("/(auth)/UserTypeSelection");
        }
        // router.replace("/(tabs)/Home");
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
      setLoginLoading(null); // Reset loading state
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
        <Typo variant="h3" style={styles.centerText}>
          Enter your number
        </Typo>
        <PhoneNumberField
          placeholder="XX XXX XXX"
          countryCode="+216"
          countryIcon={<TunisiaFlag size={verticalScale(30)} />}
          onPress={() => router.navigate("/(auth)/PhoneVerification")}
        />
        <Seperator text="Or" />
        <View style={styles.socialButtonsContainer}>
          <Button
            onPress={() => onSocialPress("oauth_google")}
            style={[
              styles.socialButtons,
              {
                borderRadius: theme.borderRadius.pill,
                borderWidth: theme.borderWidth.regular,
                borderColor: theme.gray.border,
              },
            ]}
            loading={loginLoading === "google"}>
            <GoolgeIcon size={verticalScale(30)} />
            <Typo variant="body">Sign in with Google</Typo>
          </Button>
          <Button
            onPress={() => onSocialPress("oauth_apple")}
            style={[
              styles.socialButtons,
              {
                borderRadius: theme.borderRadius.pill,
                borderWidth: theme.borderWidth.regular,
                borderColor: theme.gray.border,
              },
            ]}
            loading={loginLoading === "appgle"}>
            <AppleIcon size={verticalScale(30)} color={theme.text.primary} />
            <Typo variant="body">Sign in with Apple</Typo>
          </Button>
          <Button
            onPress={() => onSocialPress("oauth_facebook")}
            style={[
              styles.socialButtons,
              {
                borderRadius: theme.borderRadius.pill,
                borderWidth: theme.borderWidth.regular,
                borderColor: theme.gray.border,
              },
            ]}
            loading={loginLoading === "facebook"}>
            <FacebookIcon size={verticalScale(30)} />
            <Typo variant="body">Sign in with Facebook</Typo>
          </Button>
        </View>
      </View>

      <View
        style={[
          styles.footerContainer,
          {
            borderTopWidth: theme.borderWidth.thin,
            borderTopColor: theme.gray.border,
          },
        ]}>
        <Typo
          variant="caption"
          color={theme.text.muted}
          style={styles.centerText}>
          By continuing, you agree to our secure service.
        </Typo>
        <Typo
          variant="body"
          color={theme.text.secondary}
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

  socialButtonsContainer: {
    gap: horizontalScale(10),
  },
  socialButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(30),
    padding: horizontalScale(15),
    minHeight: verticalScale(65),
  },
  footerContainer: {
    alignItems: "center",
    paddingTop: verticalScale(15),
    gap: verticalScale(6),
  },
});
