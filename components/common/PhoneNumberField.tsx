import { Pressable, StyleSheet, View } from "react-native";
import THEME, { COLORS } from "@/constants/theme";
import { moderateScale, horizontalScale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { TunisiaFlag } from "./SvgIcons";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "./Button";
import React from "react";

interface PhoneNumberFieldProps {
  placeholder?: string;
  countryCode?: string;
  countryIcon?: React.ReactNode;
  onPress?: () => void;
}

export default function PhoneNumberField({
  placeholder = "Phone number",
  countryCode = "+216",
  countryIcon,
  onPress,
}: PhoneNumberFieldProps) {
  const { theme } = useTheme();
  return (
    <Button
      onPress={onPress}
      style={[
        styles.container,
        {
          borderRadius: theme.borderRadius.medium,
          backgroundColor: theme.surface,
          borderWidth: theme.borderWidth.thin,
          borderColor: theme.gray.border,
        },
      ]}>
      <View
        style={[
          styles.countryButton,
          {
            borderRightWidth: theme.borderWidth.regular,
            borderRightColor: theme.gray.border,
          },
        ]}>
        {countryIcon}
      </View>

      {/* Country Code Display */}
      <View style={styles.countryCodeContainer}>
        <View>
          <Typo variant="body" color={theme.text.primary}>
            {countryCode}
          </Typo>
        </View>
        <View>
          <Typo variant="body" color={theme.text.muted}>
            {placeholder}
          </Typo>
        </View>
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
    gap: horizontalScale(10),
  },
  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
    paddingRight: horizontalScale(10),
  },
  countryCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    paddingRight: horizontalScale(8),
  },
});
