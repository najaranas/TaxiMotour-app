import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import Button from "@/components/common/Button";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { TunisiaFlag, WhatsappIcon } from "@/components/common/SvgIcons";
import Typo from "@/components/common/Typo";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import BackButton from "@/components/common/BackButton";
import { useRouter, useFocusEffect, Link } from "expo-router";
import { useSignUp, useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";

export default function PhoneVerification() {
  const inputRef = useRef<TextInput>(null);
  const [isInputOnFocus, setIsInputOnFocus] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = React.useState(
    "anas.najjartn@gmail.com"
  );
  const [password, setPassword] = React.useState("!Linlin123");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("391047");

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        // router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(() => {
        inputRef?.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }, [])
  );

  const handleContinue = () => {
    // setLoading(true);
    router.navigate("/(auth)/UserTypeSelection");
    console.log("Phone number:", phoneNumber);
  };

  // Create dynamic styles based on theme - memoized for performance
  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
        },
        scrollContent: {
          flexGrow: 1,
          justifyContent: "space-between",
        },
        content: {
          flex: 1,
          paddingTop: verticalScale(20),
        },
        titleContainer: {
          gap: verticalScale(20),
          marginBottom: verticalScale(40),
        },
        whatsappInfo: {
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(10),
        },
        whatsappText: {
          flex: 1,
          lineHeight: verticalScale(25),
        },
        phoneInputContainer: {
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(10),
        },
        countrySection: {
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(10),
          paddingHorizontal: horizontalScale(12),
          paddingVertical: verticalScale(7),
          borderRadius: theme.borderRadius.medium,
          backgroundColor: theme.gray.background,
          borderWidth: theme.borderWidth.thin,
          borderColor: theme.gray.border,
          height: "100%",
        },
        inputContainer: {
          flex: 1,
          backgroundColor: "transparent",
          borderRadius: theme.borderRadius.medium,
          paddingHorizontal: horizontalScale(12),
          paddingVertical: verticalScale(7),
          borderWidth: theme.borderWidth.regular,
          borderColor: isInputOnFocus ? COLORS.secondary : theme.gray.border,
        },
        textInput: {
          fontSize: moderateScale(16),
          fontFamily: "Roboto-Regular",
          color: theme.text.primary,
        },
        button: {
          borderRadius: theme.borderRadius.pill,
          backgroundColor: theme.button.primary,
          justifyContent: "center",
          alignItems: "center",
          paddingBlock: verticalScale(15),
          minHeight: verticalScale(60),
        },
      }),
    [theme, isInputOnFocus]
  );

  return (
    <ScreenWrapper
      safeArea
      padding={horizontalScale(15)}
      scroll
      style={dynamicStyles.container}
      contentContainerStyle={dynamicStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <BackButton />
      {/* Content */}
      <View style={dynamicStyles.content}>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor={theme.input.placeholder}
          onChangeText={(code) => setCode(code)}
          style={{ color: theme.text.primary }}
        />
        {/* <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity> */}
        <View style={dynamicStyles.titleContainer}>
          <Typo color={theme.text.primary} variant="h3">
            {t("auth.phoneVerification")}
          </Typo>

          <View style={dynamicStyles.whatsappInfo}>
            <WhatsappIcon size={horizontalScale(40)} />
            <Typo
              color={theme.text.muted}
              variant="body"
              style={dynamicStyles.whatsappText}>
              {t("auth.whatsappNotification")}
            </Typo>
          </View>
        </View>

        <View style={dynamicStyles.phoneInputContainer}>
          <View style={dynamicStyles.countrySection}>
            <TunisiaFlag size={horizontalScale(30)} />
            <Typo variant="body" color={theme.text.primary}>
              +216
            </Typo>
          </View>

          <View style={dynamicStyles.inputContainer}>
            <TextInput
              ref={inputRef}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onFocus={() => setIsInputOnFocus(true)}
              onBlur={() => setIsInputOnFocus(false)}
              keyboardType="numeric"
              placeholder={t("auth.phonePlaceholder")}
              placeholderTextColor={theme.input.placeholder}
              maxLength={8}
              style={dynamicStyles.textInput}
            />
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <KeyboardStickyView offset={{ closed: 0, opened: verticalScale(50) }}>
        <Button
          loading={loading}
          disabled={loading}
          indicatorStyle={{ size: moderateScale(25), color: COLORS.primary }}
          style={[dynamicStyles.button, { opacity: loading ? 0.3 : 1 }]}
          onPress={handleContinue}>
          <Typo
            variant="button"
            size={moderateScale(20)}
            fontFamily={FONTS.medium}
            color={theme.button.text}>
            {t("auth.sendCode")}
          </Typo>
        </Button>
      </KeyboardStickyView>
    </ScreenWrapper>
  );
}
