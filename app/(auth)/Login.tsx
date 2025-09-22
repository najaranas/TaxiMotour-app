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
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import PhoneNumberField from "@/components/common/PhoneNumberField";
import Seperator from "@/components/common/Seperator";
import { getSupabaseClient } from "@/services/supabaseClient";
import { useUserData } from "@/store/userStore";
import StorageManager from "@/utils/storage";

// Complete the WebBrowser auth session
WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const [loginLoading, setLoginLoading] = useState<
    "google" | "facebook" | "apple" | null
  >(null);

  const { startSSOFlow } = useSSO();
  const { session: clerkSession } = useSession();
  const supabase = getSupabaseClient(clerkSession);

  const { user } = useUser();
  const { setUserData } = useUserData();

  // Track if we need to handle post-OAuth navigation
  const pendingNavigation = useRef(false);

  // Warm up browser for better performance
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  // Handle navigation after OAuth when session and user become available
  useEffect(() => {
    if (pendingNavigation.current && clerkSession && user) {
      pendingNavigation.current = false; // Reset flag
      handlePostOAuthNavigation();
    }
  }, [clerkSession, user]);

  const handlePostOAuthNavigation = async () => {
    try {
      console.log("Handling post-OAuth navigation...");
      console.log("clerkSession", clerkSession);
      console.log("user", user);

      const [driversResponse, passengersResponse] = await Promise.all([
        supabase.from("drivers").select("*").eq("user_id", user?.id).single(),
        supabase
          .from("passengers")
          .select("*")
          .eq("user_id", user?.id)
          .single(),
      ]);
      console.log("User ID:", user?.id);
      console.log("Drivers response:", driversResponse);
      console.log("Passengers response:", passengersResponse);

      const userData = driversResponse?.data || passengersResponse?.data;
      if (userData) {
        const mappedUserData = {
          id: userData?.id,
          email_address: userData?.email_address,
          phone_number: userData?.phone_number,
          full_name: userData?.full_name,
          first_name: userData?.first_name,
          last_name: userData?.last_name,
          experience_years: userData?.experience_years,
          moto_type: userData?.moto_type,
          user_type: userData?.user_type,
          profile_image_url: user?.imageUrl,
        };

        setUserData(mappedUserData);
        StorageManager.storeObject("userData", mappedUserData);
        console.log("Existing user found, navigating directly to Home");
        router.replace("/(tabs)/Home");
      } else {
        // New user - needs to select user type
        console.log("New user detected, navigating to UserTypeSelection");
        router.replace("/(auth)/UserTypeSelection");
      }
    } catch (error) {
      console.error("Error in post-OAuth navigation:", error);
    } finally {
      setLoginLoading(null);
    }
  };

  const onSocialPress = async (
    type: "oauth_google" | "oauth_apple" | "oauth_facebook"
  ) => {
    if (loginLoading) return;

    setLoginLoading(
      type === "oauth_google"
        ? "google"
        : type === "oauth_facebook"
        ? "facebook"
        : "apple"
    );

    const providerName = type.replace("oauth_", "");
    console.log(`Starting ${providerName} OAuth...`);

    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "taximotour",
        path: "/(auth)/Login",
      });

      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: type,
          redirectUrl,
        });

      console.log("OAuth result:", {
        createdSessionId,
        signInStatus: signIn?.status,
        signUpStatus: signUp?.status,
      });

      let oauthSuccessful = false;

      if (createdSessionId) {
        console.log("New session created successfully");
        if (setActive) {
          await setActive({ session: createdSessionId });
          console.log("Session activated");
          oauthSuccessful = true;
        }
      } else if (signIn?.status === "complete") {
        console.log("Existing user signed in successfully");
        oauthSuccessful = true;
      } else if (signUp?.status === "complete") {
        console.log("New user signed up successfully");
        oauthSuccessful = true;
      } else {
        console.log("OAuth cancelled or incomplete");
        setLoginLoading(null);
      }

      if (oauthSuccessful) {
        // Don't navigate immediately - wait for session and user to be available
        console.log("OAuth successful, waiting for session and user data...");
        pendingNavigation.current = true;

        // If session and user are already available, handle navigation immediately
        if (clerkSession && user) {
          pendingNavigation.current = false;
          await handlePostOAuthNavigation();
        }
        // Otherwise, the useEffect will handle it when they become available
      }
    } catch (err: any) {
      console.error(
        `${providerName} OAuth error:`,
        JSON.stringify(err, null, 2)
      );

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
        setLoginLoading(null);
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
            loading={loginLoading === "apple"}>
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
