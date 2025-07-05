import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View, ScrollView } from "react-native";
import Button from "@/components/common/Button";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { TunisiaFlag, WhatsappIcon } from "@/components/common/SvgIcons";
import Typo from "@/components/common/Typo";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import BackButton from "@/components/common/BackButton";
import { useRouter, useFocusEffect } from "expo-router";

export default function PhoneVerification() {
  const inputRef = useRef<TextInput>(null);
  const [isInputOnFocus, setIsInputOnFocus] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRouter();

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
    route.push("/screens/Auth/ConfirmVerfication");
    console.log("Phone number:", phoneNumber);
  };

  return (
    <ScreenWrapper safeArea padding={horizontalScale(15)}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <BackButton />

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Typo color={THEME.text.primary} variant="h3">
              Enter your number
            </Typo>

            <View style={styles.whatsappInfo}>
              <WhatsappIcon
                width={horizontalScale(40)}
                height={verticalScale(40)}
              />
              <Typo
                color={THEME.text.muted}
                variant="body"
                style={styles.whatsappText}>
                We&apos;ll send a verification code to your WhatsApp number.
              </Typo>
            </View>
          </View>

          <View style={styles.phoneInputContainer}>
            <View style={styles.countrySection}>
              <TunisiaFlag
                width={horizontalScale(30)}
                height={verticalScale(30)}
              />
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
                placeholder="9X XXX XXX"
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
              Continue
            </Typo>
          </Button>
        </KeyboardStickyView>
      </ScrollView>
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
