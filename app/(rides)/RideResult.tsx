import React, { useState } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Typo from "@/components/common/Typo";
import Button from "@/components/common/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { CheckCircle, XCircle } from "lucide-react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useUserData } from "@/store/userStore";
import { getSupabaseClient } from "@/services/supabaseClient";
import { useTranslation } from "react-i18next";

export default function RideResult() {
  const { status, rideId } = useLocalSearchParams<{
    status: "completed" | "canceled";
    rideId: string;
  }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { userData } = useUserData();
  const { t } = useTranslation();

  // State management
  const [userFeedback, setUserFeedback] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const supabaseClient = getSupabaseClient();
  const isRideCompleted = status === "completed";

  const handleSubmitFeedback = async () => {
    if (!userFeedback.trim()) {
      Alert.alert(
        t("rideResult.error.title"),
        t("rideResult.error.emptyFeedback")
      );
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      console.log("Submitting user feedback:", {
        feedback: userFeedback,
        rideId,
      });

      const { error } = await supabaseClient
        ?.from("rides")
        .update({ feedback: userFeedback })
        .eq("ride_id", rideId);

      if (error) {
        throw error;
      }

      Alert.alert(
        t("rideResult.success.title"),
        t("rideResult.success.feedbackSubmitted"),
        [{ text: t("common.ok"), onPress: () => handleNavigateHome() }]
      );
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert(
        t("rideResult.error.title"),
        t("rideResult.error.submissionFailed")
      );
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleNavigateHome = () => {
    router.dismissAll();
    router.replace("/(tabs)/Home");
  };

  if (isRideCompleted) {
    return (
      <ScreenWrapper
        style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          {/* Success Header */}
          <View style={styles.header}>
            <CheckCircle size={moderateScale(80)} color={COLORS.success} />
            <Typo
              variant="h1"
              fontFamily={FONTS.bold}
              style={[styles.title, { color: COLORS.success }]}>
              {t("rideResult.completed.title")}
            </Typo>
            <Typo
              variant="body"
              style={[styles.subtitle, { color: theme.text.secondary }]}>
              {t("rideResult.completed.subtitle")}
            </Typo>
          </View>

          {/* Feedback Section */}
          {userData?.user_type === "passenger" && (
            <View
              style={[
                styles.feedbackSection,
                { backgroundColor: theme.surface },
              ]}>
              <Typo
                variant="h3"
                fontFamily={FONTS.medium}
                style={styles.sectionTitle}>
                {t("rideResult.feedback.title")}
              </Typo>

              <KeyboardStickyView
                offset={{ closed: 0, opened: verticalScale(300) }}>
                <TextInput
                  style={[
                    styles.feedbackInput,
                    {
                      backgroundColor: theme.background,
                      color: theme.text.primary,
                      borderColor: theme.text.secondary + "30",
                    },
                  ]}
                  placeholder={t("rideResult.feedback.placeholder")}
                  placeholderTextColor={theme.text.secondary}
                  value={userFeedback}
                  onChangeText={setUserFeedback}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </KeyboardStickyView>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {userData?.user_type === "passenger" && (
              <Button
                onPress={handleSubmitFeedback}
                loading={isSubmittingFeedback}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: COLORS.primary,
                  },
                ]}>
                <Typo
                  variant="body"
                  color={COLORS.white}
                  fontFamily={FONTS.medium}>
                  {t("rideResult.actions.submitFeedback")}
                </Typo>
              </Button>
            )}
            <Button
              onPress={handleNavigateHome}
              style={[
                styles.secondaryButton,
                { backgroundColor: theme.surface },
              ]}>
              <Typo variant="body" fontFamily={FONTS.medium}>
                {userData?.user_type === "passenger"
                  ? t("rideResult.actions.skipAndGoHome")
                  : t("rideResult.actions.goHome")}
              </Typo>
            </Button>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  // Canceled ride view
  return (
    <ScreenWrapper
      style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <XCircle size={moderateScale(80)} color={COLORS.danger} />
          <Typo
            variant="h1"
            fontFamily={FONTS.bold}
            style={[styles.title, { color: COLORS.danger }]}>
            {t("rideResult.canceled.title")}
          </Typo>
          <Typo
            variant="body"
            style={[styles.subtitle, { color: theme.text.secondary }]}>
            {t("rideResult.canceled.subtitle")}
          </Typo>
        </View>

        <Button
          onPress={handleNavigateHome}
          style={[styles.primaryButton, { backgroundColor: COLORS.primary }]}>
          <Typo variant="body" color={COLORS.white} fontFamily={FONTS.medium}>
            {t("rideResult.actions.goHome")}
          </Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: horizontalScale(20),
    justifyContent: "center",
    gap: verticalScale(30),
  },
  header: {
    alignItems: "center",
    gap: verticalScale(15),
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: verticalScale(5),
  },
  feedbackSection: {
    padding: horizontalScale(20),
    borderRadius: moderateScale(15),
    gap: verticalScale(15),
  },
  sectionTitle: {
    textAlign: "center",
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: moderateScale(10),
    padding: horizontalScale(15),
    fontSize: moderateScale(16),
    minHeight: verticalScale(100),
  },
  buttonContainer: {
    gap: verticalScale(15),
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(12),
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: COLORS.gray[300],
  },
});
