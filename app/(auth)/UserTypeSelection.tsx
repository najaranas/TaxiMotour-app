import React, { useState, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Button from "@/components/common/Button";
import Typo from "@/components/common/Typo";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { usePathname, useRouter } from "expo-router";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import UserTypeCard from "@/components/common/UserTypeCard";
import { userTypes } from "@/constants/data";
import BackButton from "@/components/common/BackButton";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";

type UserType = "driver" | "passenger" | null;

export default function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Dynamic styles - memoized for performance, only recreated when theme changes
  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexDirection: "row",
          alignItems: "center",
          borderRadius: theme.borderRadius.large,
          padding: horizontalScale(18),
          position: "relative",
          borderWidth: theme.borderWidth.regular,
          backgroundColor: theme.card,
          borderColor: theme.gray.border,
        },
        cardIcon: {
          borderRadius: theme.borderRadius.large,
        },
        button: {
          borderRadius: theme.borderRadius.pill,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: verticalScale(15),
          minHeight: verticalScale(54),
        },
        buttonEnabled: {
          backgroundColor: theme.button.primary,
        },
        buttonDisabled: {
          backgroundColor: theme.gray.surface,
        },
        circle: {
          borderRadius: theme.borderRadius.circle,
          borderWidth: theme.borderWidth.regular,
          borderColor: theme.gray.border,
        },
        circleSelected: {
          borderColor: theme.gray.border,
          backgroundColor: theme.button.primary,
        },
      }),
    [theme]
  );

  const handleContinue = () => {
    router.dismissAll();
    router.replace("/(tabs)/Home");
  };
  const pathname = usePathname();
  console.log(pathname);

  return (
    <ScreenWrapper
      safeArea
      padding={horizontalScale(15)}
      scroll
      contentContainerStyle={staticStyles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <BackButton />
      <View style={staticStyles.header}>
        <Typo
          variant="h1"
          // fontFamily={FONTS.bold}
          color={theme.text.primary}
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
          color={theme.text.secondary}
          style={staticStyles.headerSubtitle}>
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
          dynamicStyles.button,
          selectedType
            ? dynamicStyles.buttonEnabled
            : dynamicStyles.buttonDisabled,
          {
            opacity: selectedType ? 1 : 0.5,
          },
        ]}
        onPress={handleContinue}>
        <Typo
          variant="button"
          size={moderateScale(18)}
          fontFamily={FONTS.medium}
          color={theme.button.text}>
          {t("auth.continue")}
        </Typo>
      </Button>
    </ScreenWrapper>
  );
}
// Static styles that don't depend on theme - outside for performance
const staticStyles = StyleSheet.create({
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
  },
  scrollContent: {
    gap: verticalScale(20),
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    flex: 1,
  },
  cardIcon: {
    width: horizontalScale(100),
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
  circle: {
    width: moderateScale(22),
    height: moderateScale(22),
    justifyContent: "center",
    alignItems: "center",
  },
});
