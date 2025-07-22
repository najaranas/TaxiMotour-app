import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "@/components/common/Button";
import Typo from "@/components/common/Typo";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import UserTypeCard from "@/components/common/UserTypeCard";
import { userTypes } from "@/constants/data";
import BackButton from "@/components/common/BackButton";
import { useTranslation } from "react-i18next";

type UserType = "driver" | "passenger" | null;

export default function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const router = useRouter();
  const { t } = useTranslation();

  const handleContinue = () => {
    router.dismissAll();
    if (selectedType === "passenger") {
      // router.replace("/screens/Passenger/Home/PassengerHomeScreen");
      router.replace("/(tabs)/Home");
    } else {
      // router.replace("/screens/Driver/Home/DriverHomeScreen");
      router.replace("/(tabs)/Home"); // For now, redirect to the same home
    }
  };
  return (
    <ScreenWrapper
      safeArea
      padding={horizontalScale(15)}
      scroll
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <BackButton />
      <View style={styles.header}>
        <Typo
          variant="h1"
          // fontFamily={FONTS.bold}
          color={THEME.text.primary}
          style={{
            fontSize: 32,
            lineHeight: 38,
            textAlign: "left",
            marginBottom: 6,
          }}>
          {t("auth.selectUserType")}
        </Typo>
        <Typo
          variant="body"
          color={THEME.text.secondary}
          style={styles.headerSubtitle}>
          {t("auth.userTypeDescription")}
        </Typo>
      </View>

      {/* Cards */}
      {userTypes.map((type) => {
        const isSelected = selectedType === type.id;
        return (
          <UserTypeCard
            key={type.id}
            icon={type.icon}
            title={t(`auth.${type.id}`)}
            subtitle={t(`auth.${type.id}Subtitle`)}
            description={t(`auth.${type.id}Description`)}
            isSelected={isSelected}
            onPress={() => setSelectedType(type.id)}
          />
        );
      })}
      {/* Continue Button */}
      <Button
        disabled={!selectedType}
        style={[
          styles.button,
          {
            backgroundColor: selectedType
              ? COLORS.secondary
              : COLORS.gray["300"],
            opacity: selectedType ? 1 : 0.5,
          },
        ]}
        onPress={handleContinue}>
        <Typo
          variant="button"
          size={moderateScale(18)}
          fontFamily={FONTS.medium}
          color={COLORS.white}>
          {t("auth.continue")}
        </Typo>
      </Button>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: verticalScale(20),
  },

  headerSubtitle: {
    lineHeight: moderateScale(22),
    textAlign: "left",
  },
  scroll: {
    flex: 1,
    marginTop: verticalScale(20),
  },
  scrollContent: {
    gap: verticalScale(20),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: THEME.borderRadius.large,
    padding: horizontalScale(18),
    position: "relative",
    borderWidth: THEME.borderWidth.regular,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    flex: 1,
  },
  cardIcon: {
    width: horizontalScale(100),
    borderRadius: THEME.borderRadius.large,
    aspectRatio: 1,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: moderateScale(20),
    marginBottom: verticalScale(2),
  },
  cardSubtitle: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(2),
  },

  button: {
    borderRadius: THEME.borderRadius.pill,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(15),
    minHeight: verticalScale(54),
  },

  circle: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: THEME.borderRadius.circle,
    borderWidth: THEME.borderWidth.regular,
    borderColor: COLORS.gray["200"],
    justifyContent: "center",
    alignItems: "center",
  },
  circleSelected: {
    borderColor: COLORS.gray["200"],
    backgroundColor: COLORS.secondary,
  },
});
