import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import ConfirmationCodeField from "@/components/common/ConfirmationCodeField";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { EditIcon } from "@/components/common/SvgIcons";
import Typo from "@/components/common/Typo";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";

export default function ConfirmVerification() {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const router = useRouter();
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

  // Start timer on mount
  useEffect(() => {
    startResendTimer();
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, []);

  // Clear timer when countdown reaches 0
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
    startResendTimer();
  };
  const handleEditNumber = () => {
    router.navigate("/screens/Auth/UserTypeSelection");
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
            Verify Your Phone
          </Typo>
          <View style={{ gap: verticalScale(5) }}>
            <Typo
              color={THEME.text.muted}
              variant="body"
              style={styles.infoText}>
              Enter the verification code sent to your WhatsApp number.
            </Typo>
            <Typo
              variant="body"
              fontFamily={FONTS.bold}
              color={THEME.text.secondary}
              style={styles.infoText}>
              +216 93 231 421
            </Typo>
          </View>
        </View>

        <ConfirmationCodeField
          digitCount={4}
          autoFocus
          onCodeComplete={() => null}
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
              Edit phone number
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
