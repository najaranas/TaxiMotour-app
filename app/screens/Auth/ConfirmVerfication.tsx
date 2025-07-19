import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import ConfirmationCodeField from "@/components/common/ConfirmationCodeField";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { EditIcon } from "@/components/common/SvgIcons";
import Typo from "@/components/common/Typo";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, verticalScale } from "@/utils/styling";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";

export default function ConfirmVerification() {
  const { contactType, contactValue } = useLocalSearchParams() as unknown as {
    contactType: "email" | "phone" | "whatsapp";
    contactValue: string;
  };

  const [verificationCode, setVerificationCode] = useState<string>("");
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const resendTime = 20;
  const [timerId, setTimerId] = useState<number | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(resendTime);

  const handleVerifyCode = () => {
    if (verificationCode.length < 4) {
      Alert.alert("Error", "Please enter the complete verification code");
      return;
    }
    setIsLoading(true);
    // TODO: Implement verification logic here
    console.log("Verifying code:", verificationCode);
  };

  useEffect(() => {
    startResendTimer();
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    if (resendTimer === 0 && timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }, [resendTimer, timerId]);

  const startResendTimer = () => {
    setResendTimer(resendTime);
    if (timerId) clearInterval(timerId);
    const id = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    setTimerId(id as unknown as number);
  };

  const handleResendCode = () => {
    // if (onResendCode) {
    //   onResendCode();
    // }

    startResendTimer();
  };

  const handleEditNumber = () => {
    router.back();
  };

  const onCodeComplete = async (code: string) => {
    try {
      const emailToVerify = user?.emailAddresses.find(
        (email) => email.emailAddress === contactValue
      );
      const phoneToVerify = user?.phoneNumbers.find(
        (phone) => phone.phoneNumber === contactValue
      );
      if (emailToVerify) {
        // Verify email code
        const verificationResult = await emailToVerify.attemptVerification({
          code: code,
        });
        console.log("verificationResult", verificationResult);
        if (verificationResult.verification.status === "verified") {
          // Set as primary email after successful verification
          console.log("emailResstart");

          const emailRes = await user?.update({
            primaryEmailAddressId: emailToVerify.id,
          });
          console.log("emailRes", emailRes);
          console.log("Email verified and set as primary successfully");
          router.navigate("/screens/Profile/PersonalInfo");
        }
      } else if (phoneToVerify) {
        // Verify phone code
        const verification = await phoneToVerify.attemptVerification({ code });
        if (verification.verification.status === "verified") {
          // Set as primary phone after successful verification
          await user?.update({
            primaryPhoneNumberId: phoneToVerify.id,
          });
          console.log("Phone verified and set as primary successfully");
          router.navigate("/screens/Profile/PersonalInfo");
        }
      }
    } catch (error) {
      console.log("Error verifying code:", error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
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
      {/* Header */}
      <BackButton />
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Typo color={THEME.text.primary} variant="h3">
            {contactType === "whatsapp" || contactType === "phone"
              ? "Verify Your Phone"
              : "Verify Your email"}
          </Typo>
          <View style={{ gap: verticalScale(5) }}>
            <Typo
              color={THEME.text.muted}
              variant="body"
              style={styles.infoText}>
              {contactType === "whatsapp" || contactType === "phone"
                ? "Enter the verification code sent to your WhatsApp number."
                : "Enter the verification code sent to your email."}
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
          digitCount={4}
          autoFocus
          // onCodeChange={onCodeChange}
          // onCodeComplete={onCodeComplete}
        />

        <View style={styles.resendContainer}>
          {resendTimer === 0 ? (
            <Button onPress={handleResendCode}>
              <Typo variant="button" color={COLORS.secondary}>
                Resend code
              </Typo>
            </Button>
          ) : (
            <Typo variant="body" color={THEME.text.muted}>
              Resend Code in {resendTimer}
            </Typo>
          )}
        </View>

        <Button onPress={handleEditNumber}>
          <View style={styles.editNumberContainer}>
            <EditIcon color={THEME.text.secondary} size={30} />
            <Typo
              variant="body"
              fontFamily={FONTS.medium}
              color={THEME.text.secondary}
              style={styles.infoText}>
              {contactType === "whatsapp" || contactType === "phone"
                ? "Edit phone number"
                : "Edit email address"}
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
