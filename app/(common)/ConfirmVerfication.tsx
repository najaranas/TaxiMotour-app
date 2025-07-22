import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import ConfirmationCodeField from "@/components/common/ConfirmationCodeField";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { EditIcon } from "@/components/common/SvgIcons";
import Typo from "@/components/common/Typo";
import { COLORS, FONTS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale, verticalScale } from "@/utils/styling";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useTranslation } from "react-i18next";

export default function ConfirmVerification() {
  const { contactType, contactValue } = useLocalSearchParams() as unknown as {
    contactType: "email" | "phone" | "whatsapp";
    contactValue: string;
  };
  const { theme } = useTheme();
  const { t } = useTranslation();

  console.log("segments");
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contactToVerify, setContactToVerify] = useState<any>(null);
  const resendTime = 20;
  const [timerId, setTimerId] = useState<number | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(resendTime);

  const startResendTimer = () => {
    setResendTimer(resendTime);
    if (timerId) clearInterval(timerId);
    const id = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    setTimerId(id as unknown as number);
  };

  useEffect(() => {
    // Find the contact to verify on mount
    if (contactType === "email") {
      const emailToVerify = user?.emailAddresses.find(
        (email) => email.emailAddress === contactValue
      );
      setContactToVerify(emailToVerify);
    } else {
      const phoneToVerify = user?.phoneNumbers.find(
        (phone) => phone.phoneNumber === contactValue
      );
      setContactToVerify(phoneToVerify);
    }
  }, [contactType, contactValue, user?.emailAddresses, user?.phoneNumbers]);

  useEffect(() => {
    startResendTimer();
    return () => {
      if (timerId) clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resendTimer === 0 && timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }, [resendTimer, timerId]);

  const handleEditNumber = () => {
    router.back();
  };

  const onCodeComplete = async (code: string) => {
    setIsLoading(true);
    try {
      if (!contactToVerify) {
        Alert.alert(t("errors.error"), t("errors.sessionExpired"));
        return;
      }

      if (contactType === "email") {
        // Verify email code
        const verificationResult = await contactToVerify.attemptVerification({
          code: code,
        });
        console.log("verificationResult", verificationResult);
        if (verificationResult.verification.status === "verified") {
          // Set as primary email after successful verification
          await user?.update({
            primaryEmailAddressId: contactToVerify.id,
          });
          console.log("Email verified and set as primary successfully");

          router.dismissTo("/(profile)/PersonalInfo");
        } else {
          Alert.alert(t("errors.error"), t("errors.invalidVerificationCode"));
        }
      } else if (contactType === "phone") {
        // Verify phone code
        const verification = await contactToVerify.attemptVerification({
          code,
        });
        if (verification.verification.status === "verified") {
          // Set as primary phone after successful verification
          await user?.update({
            primaryPhoneNumberId: contactToVerify.id,
          });
          console.log("Phone verified and set as primary successfully");

          router.dismissTo("/(profile)/PersonalInfo");
        } else {
          Alert.alert(t("errors.error"), t("errors.invalidVerificationCode"));
        }
      }
    } catch (error) {
      console.log("Error verifying code:", error);
      Alert.alert(t("errors.error"), t("errors.invalidVerificationCode"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      if (!contactToVerify) {
        Alert.alert(t("errors.error"), t("errors.sessionExpired"));
        return;
      }

      if (contactType === "email") {
        await contactToVerify.prepareVerification({ strategy: "email_code" });
        Alert.alert(t("errors.success"), t("errors.verificationCodeSentEmail"));
      } else if (contactType === "phone") {
        await contactToVerify.prepareVerification();
        Alert.alert(t("errors.success"), t("errors.verificationCodeSentPhone"));
      }

      startResendTimer();
    } catch (error) {
      console.log("Error resending code:", error);
      Alert.alert(t("errors.error"), t("errors.failedToResendCode"));
    }
  };

  return (
    <ScreenWrapper
      safeArea
      scroll
      padding={horizontalScale(15)}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <BackButton />
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Typo color={theme.text.primary} variant="h3">
            {contactType === "whatsapp" || contactType === "phone"
              ? t("auth.confirmVerification")
              : t("auth.confirmVerification")}
          </Typo>
          <View style={{ gap: verticalScale(5) }}>
            <Typo
              color={theme.text.muted}
              variant="body"
              style={styles.infoText}>
              {t("auth.enterCode")}
            </Typo>
            <Typo
              variant="body"
              fontFamily={FONTS.bold}
              color={theme.text.secondary}
              style={styles.infoText}>
              {contactValue}
            </Typo>
          </View>
        </View>

        <ConfirmationCodeField
          digitCount={6}
          autoFocus
          onCodeComplete={onCodeComplete}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <Typo variant="body" color={theme.text.muted}>
              {t("common.loading")}
            </Typo>
          </View>
        )}

        <View style={styles.resendContainer}>
          {resendTimer === 0 ? (
            <Button onPress={handleResendCode} disabled={isLoading}>
              <Typo variant="button" color={COLORS.secondary}>
                {isLoading ? t("common.loading") : t("auth.resendCode")}
              </Typo>
            </Button>
          ) : (
            <Typo variant="body" color={theme.text.muted}>
              {t("auth.resendCodeIn", { seconds: resendTimer })}
            </Typo>
          )}
        </View>

        <Button onPress={handleEditNumber} disabled={isLoading}>
          <View
            style={[
              styles.editNumberContainer,
              { borderTopWidth: theme.borderWidth.thin },
            ]}>
            <EditIcon color={theme.text.secondary} size={30} />
            <Typo
              variant="body"
              fontFamily={FONTS.medium}
              color={theme.text.secondary}
              style={styles.infoText}>
              {contactType === "whatsapp" || contactType === "phone"
                ? t("auth.changePhoneNumber")
                : t("auth.changeEmailAddress")}
            </Typo>
          </View>
        </Button>
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
  },
  content: {
    flex: 1,
    paddingTop: verticalScale(20),
  },
  titleContainer: {
    gap: verticalScale(20),
    marginBottom: verticalScale(30),
  },
  infoText: {
    flex: 1,
    lineHeight: verticalScale(25),
  },

  resendContainer: {
    marginTop: verticalScale(10),
  },
  loadingContainer: {
    marginTop: verticalScale(10),
  },
  editNumberContainer: {
    marginTop: verticalScale(20),
    paddingTop: verticalScale(10),
    borderTopColor: COLORS.gray["200"],
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
});
