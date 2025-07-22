import React, { useEffect, useRef, useState } from "react";
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

export default function PhoneVerification() {
  const inputRef = useRef<TextInput>(null);
  const [isInputOnFocus, setIsInputOnFocus] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation();

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
    router.navigate("/(common)/ConfirmVerfication");
    console.log("Phone number:", phoneNumber);
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
      {/* Header */}
      <BackButton />
      {/* Content */}
      <View style={styles.content}>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Typo color={THEME.text.primary} variant="h3">
            {t("auth.phoneVerification")}
          </Typo>

          <View style={styles.whatsappInfo}>
            <WhatsappIcon size={horizontalScale(40)} />
            <Typo
              color={THEME.text.muted}
              variant="body"
              style={styles.whatsappText}>
              {t("auth.whatsappNotification")}
            </Typo>
          </View>
        </View>

        <View style={styles.phoneInputContainer}>
          <View style={styles.countrySection}>
            <TunisiaFlag size={horizontalScale(30)} />
            <Typo variant="body" color={THEME.text.primary}>
              +216
            </Typo>
          </View>

          <View
            style={[
              styles.inputContainer,
              {
                borderColor: isInputOnFocus
                  ? COLORS.secondary
                  : COLORS.gray["200"],
              },
            ]}>
            <TextInput
              ref={inputRef}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onFocus={() => setIsInputOnFocus(true)}
              onBlur={() => setIsInputOnFocus(false)}
              keyboardType="numeric"
              placeholder={t("auth.phonePlaceholder")}
              placeholderTextColor={THEME.text.secondary}
              maxLength={8}
              style={styles.textInput}
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
          style={[styles.button, { opacity: loading ? 0.3 : 1 }]}
          onPress={handleContinue}>
          <Typo
            variant="button"
            size={moderateScale(20)}
            fontFamily={FONTS.medium}
            color={COLORS.white}>
            {t("auth.sendCode")}
          </Typo>
        </Button>
      </KeyboardStickyView>
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
    borderRadius: THEME.borderRadius.medium,
    backgroundColor: COLORS.gray["100"],
    borderWidth: THEME.borderWidth.thin,
    borderColor: COLORS.gray["200"],
    height: "100%",
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: THEME.borderRadius.medium,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(7),
    borderWidth: THEME.borderWidth.regular,
  },
  textInput: {
    fontSize: moderateScale(16),
    fontFamily: "Roboto-Regular",
    color: THEME.text.primary,
  },

  button: {
    borderRadius: THEME.borderRadius.pill,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    paddingBlock: verticalScale(15),
    minHeight: verticalScale(60),
  },
});
