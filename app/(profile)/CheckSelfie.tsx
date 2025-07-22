import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import BackButton from "@/components/common/BackButton";
import { useRouter } from "expo-router";
import Typo from "@/components/common/Typo";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import Button from "@/components/common/Button";
import { useUser } from "@clerk/clerk-expo";
import { getSelfieImage } from "../../store/selfieImageStore";

export default function CheckSelfie() {
  const selfieImage = getSelfieImage();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { user } = useUser();
  const router = useRouter();

  const handleRetake = () => {
    router.back();
  };
  const handleConfirm = async () => {
    try {
      setIsUploading(true);
      if (selfieImage?.base64) {
        const base64WithPrefix = "data:image/jpeg;base64," + selfieImage.base64;
        await user?.setProfileImage({ file: base64WithPrefix });
      } else {
        console.log("Invalid image data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
      router.replace("/(tabs)/profile");
    }
  };
  return (
    <ScreenWrapper
      safeArea
      padding={horizontalScale(15)}
      scroll
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.screenContent}>
      <BackButton disabled={isUploading} variant="arrow" />
      <View style={styles.mainContent}>
        <Typo variant="h3" style={{ textAlign: "center" }}>
          Review Your Selfie
        </Typo>
        <View>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selfieImage?.uri }}
              style={styles.selfieImage}
            />
          </View>
          <Typo
            style={styles.instructionText}
            variant="body"
            color={THEME.text.secondary}>
            If you’re happy with your photo, tap Confirm. Otherwise, retake your
            selfie.
          </Typo>
        </View>
        <View style={styles.buttonColumn}>
          <Button
            onPress={handleConfirm}
            loading={isUploading}
            indicatorStyle={{ color: COLORS.white }}
            style={[
              styles.actionButton,
              { backgroundColor: COLORS.secondary },
            ]}>
            <Typo
              size={moderateScale(17)}
              fontFamily={FONTS.bold}
              color={COLORS.white}>
              Confirm Selfie
            </Typo>
          </Button>
          <Button
            disabled={isUploading}
            onPress={handleRetake}
            style={[
              styles.actionButton,
              { backgroundColor: COLORS.gray["100"] },
            ]}>
            <Typo
              size={moderateScale(17)}
              fontFamily={FONTS.medium}
              color={COLORS.black}>
              Retake Selfie
            </Typo>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  imageContainer: {
    marginHorizontal: "auto",
  },
  selfieImage: {
    width: horizontalScale(250),
    aspectRatio: 1,
    borderRadius: horizontalScale(250) / 2,
  },
  instructionText: {
    textAlign: "center",
    marginTop: verticalScale(20),
  },
  buttonColumn: {
    gap: verticalScale(15),
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: horizontalScale(10),
    borderRadius: THEME.borderRadius.circle,
    minHeight: verticalScale(55),
  },
});
