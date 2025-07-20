import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import ConfirmationCodeField from "@/components/common/ConfirmationCodeField";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { EditIcon } from "@/components/common/SvgIcons";
import Typo from "@/components/common/Typo";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, verticalScale } from "@/utils/styling";
import { useUser } from "@clerk/clerk-expo";
import { useNavigationState } from "@react-navigation/native";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";

export default function ConfirmVerification() {
  const { contactType, contactValue } = useLocalSearchParams() as unknown as {
    contactType: "email" | "phone" | "whatsapp";
    contactValue: string;
  };
  const segments = useSegments();

  const routes = useNavigationState((state) => state.routes);

  console.log("Routes stack:", routes); // All routes in the current navigator

  console.log("segments", segments);
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
        Alert.alert(
          "Error",
          "Contact information not found. Please try again."
        );
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

          router.replace("/(profile)/PersonalInfo");
        } else {
          Alert.alert("Error", "Invalid verification code. Please try again.");
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

          router.navigate("/(profile)/PersonalInfo");
        } else {
          Alert.alert("Error", "Invalid verification code. Please try again.");
        }
      }
    } catch (error) {
      console.log("Error verifying code:", error);
      Alert.alert("Error", "Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      if (!contactToVerify) {
        Alert.alert(
          "Error",
          "Contact information not found. Please try again."
        );
        return;
      }

      if (contactType === "email") {
        await contactToVerify.prepareVerification({ strategy: "email_code" });
        Alert.alert("Success", "Verification code sent to your email!");
      } else if (contactType === "phone") {
        await contactToVerify.prepareVerification();
        Alert.alert("Success", "Verification code sent to your phone!");
      }

      startResendTimer();
    } catch (error) {
      console.log("Error resending code:", error);
      Alert.alert("Error", "Failed to resend code. Please try again.");
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
          <Typo color={THEME.text.primary} variant="h3">
            {contactType === "whatsapp" || contactType === "phone"
              ? "Verify Phone Number"
              : "Verify Email Address"}
          </Typo>
          <View style={{ gap: verticalScale(5) }}>
            <Typo
              color={THEME.text.muted}
              variant="body"
              style={styles.infoText}>
              {contactType === "whatsapp" || contactType === "phone"
                ? "Enter the 6-digit verification code sent to your phone number."
                : "Enter the 6-digit verification code sent to your email address."}
            </Typo>
            <Typo
              variant="body"
              fontFamily={FONTS.bold}
              color={THEME.text.secondary}
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
            <Typo variant="body" color={THEME.text.muted}>
              Verifying your code...
            </Typo>
          </View>
        )}

        <View style={styles.resendContainer}>
          {resendTimer === 0 ? (
            <Button onPress={handleResendCode} disabled={isLoading}>
              <Typo variant="button" color={COLORS.secondary}>
                {isLoading ? "Sending..." : "Resend code"}
              </Typo>
            </Button>
          ) : (
            <Typo variant="body" color={THEME.text.muted}>
              Resend Code in {resendTimer}
            </Typo>
          )}
        </View>

        <Button onPress={handleEditNumber} disabled={isLoading}>
          <View style={styles.editNumberContainer}>
            <EditIcon color={THEME.text.secondary} size={30} />
            <Typo
              variant="body"
              fontFamily={FONTS.medium}
              color={THEME.text.secondary}
              style={styles.infoText}>
              {contactType === "whatsapp" || contactType === "phone"
                ? "Change phone number"
                : "Change email address"}
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
    borderTopWidth: THEME.borderWidth.thin,
    borderTopColor: COLORS.gray["200"],
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
});
