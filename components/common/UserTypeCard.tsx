import React from "react";
import {
  StyleSheet,
  View,
  Image,
  ViewStyle,
  ImageSourcePropType,
} from "react-native";
import Button from "@/components/common/Button";
import Typo from "@/components/common/Typo";
import { COLORS, FONTS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

import { moderateScale, horizontalScale, verticalScale } from "@/utils/styling";

type UserTypeCardProps = {
  icon: ImageSourcePropType;
  title: string;
  subtitle: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

export default function UserTypeCard({
  icon,
  title,
  subtitle,
  description,
  isSelected,
  onPress,
  style,
}: UserTypeCardProps) {
  const { theme } = useTheme();

  const dynamicStyles = StyleSheet.create({
    card: {
      borderRadius: theme.borderRadius.large,
      padding: horizontalScale(15),
      position: "relative",
      borderWidth: theme.borderWidth.thick,
      minHeight: verticalScale(200),
    },
    cardIcon: {
      width: horizontalScale(100),
      borderRadius: theme.borderRadius.large,
      aspectRatio: 1,
      flexShrink: 0,
    },
    circle: {
      width: moderateScale(22),
      height: moderateScale(22),
      borderRadius: theme.borderRadius.circle,
      borderWidth: theme.borderWidth.regular,
      borderColor: COLORS.gray["200"],
      backgroundColor: COLORS.white,
    },
  });

  return (
    <Button
      onPress={onPress}
      style={[
        dynamicStyles.card,
        style,
        {
          backgroundColor: isSelected ? COLORS.selection : COLORS.white,
          borderColor: isSelected ? COLORS.secondary : COLORS.gray["200"],
        },
      ]}>
      <View style={styles.cardContent}>
        <Image
          source={icon}
          style={dynamicStyles.cardIcon}
          resizeMode="contain"
        />
        <View style={styles.cardTextContainer}>
          <Typo
            variant="h3"
            color={theme.text.primary}
            style={{ flexShrink: 1 }}>
            {title}
          </Typo>
          <Typo
            variant="body"
            color={theme.text.primary}
            style={{ flexShrink: 1 }}>
            {subtitle}
          </Typo>
          <Typo
            variant="caption"
            color={theme.text.muted}
            fontFamily={FONTS.regular}
            style={{ flexShrink: 1 }}
            size={moderateScale(13)}>
            {description}
          </Typo>
        </View>
        {/* Selection Circle */}
        <View
          style={[dynamicStyles.circle, isSelected && styles.circleSelected]}
        />
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    flex: 1,
    minWidth: 0,
  },
  cardTextContainer: {
    flex: 1,
    minWidth: 0,
    gap: verticalScale(5),
  },
  circleSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary,
  },
});
