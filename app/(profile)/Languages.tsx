import React from "react";
import { View, StyleSheet, I18nManager } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import BackButton from "@/components/common/BackButton";
import Typo from "@/components/common/Typo";
import Button from "@/components/common/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { useTranslation } from "react-i18next";
import {
  SUPPORTED_LANGUAGES,
  changeLanguage,
  getCurrentLanguage,
  type SupportedLanguage,
} from "@/utils/translation/languageUtils";
import { COLORS } from "@/constants/theme";
import { Check } from "lucide-react-native";
import * as Updates from "expo-updates";

export default function Languages() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const currentLanguage = getCurrentLanguage();

  const handleLanguageChange = async (languageCode: SupportedLanguage) => {
    const success = await changeLanguage(languageCode);
    if (success) {
      if (languageCode === "ar") {
        I18nManager.forceRTL(true);
      } else {
        I18nManager.forceRTL(false);
      }
      await Updates.reloadAsync();
    }
  };

  console.log(I18nManager.isRTL);
  return (
    <ScreenWrapper
      safeArea
      scroll
      padding={horizontalScale(15)}
      contentContainerStyle={styles.container}>
      <BackButton variant="arrow" />

      <View style={styles.content}>
        <Typo variant="h3" style={styles.title}>
          {t("profile.language")}
        </Typo>

        <Typo
          variant="body"
          color={theme.text.secondary}
          style={styles.description}>
          {t("profile.choosePreferredLanguage")}
        </Typo>

        <View style={styles.languageList}>
          {SUPPORTED_LANGUAGES.map((language) => {
            const isSelected = currentLanguage === language.code;

            return (
              <Button
                key={language.code}
                onPress={() => handleLanguageChange(language.code)}
                style={[
                  styles.languageItem,
                  {
                    backgroundColor: isSelected ? theme.surface : "transparent",
                    borderColor: isSelected
                      ? COLORS.secondary
                      : theme.input.border,
                    borderWidth: theme.borderWidth.regular,
                    borderRadius: theme.borderRadius.medium,
                  },
                ]}>
                <View style={styles.languageItemContent}>
                  <View style={styles.languageInfo}>
                    <Typo
                      variant="body"
                      size={moderateScale(16)}
                      color={theme.text.primary}
                      style={styles.languageName}>
                      {language.nativeName}
                    </Typo>
                    <Typo
                      variant="caption"
                      color={theme.text.secondary}
                      size={moderateScale(14)}>
                      {language.name}
                    </Typo>
                  </View>

                  {isSelected && (
                    <Check
                      size={moderateScale(20)}
                      color={COLORS.secondary}
                      strokeWidth={2}
                    />
                  )}
                </View>
              </Button>
            );
          })}
        </View>
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
    paddingTop: verticalScale(20),
  },
  title: {
    textAlign: "center",
    marginBottom: verticalScale(10),
  },
  description: {
    textAlign: "center",
    marginBottom: verticalScale(30),
    lineHeight: moderateScale(22),
  },
  languageList: {
    gap: verticalScale(15),
  },
  languageItem: {
    paddingVertical: verticalScale(18),
    paddingHorizontal: horizontalScale(20),
  },
  languageItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  languageInfo: {
    flex: 1,
    gap: verticalScale(4),
  },
  languageName: {
    fontWeight: "500",
  },
});
