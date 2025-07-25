import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Image,
  ViewStyle,
  ImageSourcePropType,
} from "react-native";
import Button from "@/components/common/Button";
import Typo from "@/components/common/Typo";
import { FONTS } from "@/constants/theme";
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

// Static styles that don't depend on theme - outside for performance
const staticStyles = StyleSheet.create({
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
  textFlexShrink: {
    flexShrink: 1,
  },
});

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

  // Dynamic styles - memoized for performance, only recreated when theme or selection changes
  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          borderRadius: theme.borderRadius.large,
          padding: horizontalScale(15),
          position: "relative",
          borderWidth: theme.borderWidth.thick,
          minHeight: verticalScale(200),
          backgroundColor: isSelected
            ? theme.button.primary + "20"
            : theme.surface,
          borderColor: isSelected ? theme.button.primary : theme.gray.surface,
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
          borderColor: isSelected ? theme.button.primary : theme.gray.border,
          backgroundColor: isSelected ? theme.button.primary : theme.card,
        },
      }),
    [theme, isSelected]
  );

  return (
    <Button onPress={onPress} style={[dynamicStyles.card, style]}>
      <View style={staticStyles.cardContent}>
        <Image
          source={icon}
          style={dynamicStyles.cardIcon}
          resizeMode="contain"
        />
        <View style={staticStyles.cardTextContainer}>
          <Typo
            variant="h3"
            color={theme.text.primary}
            style={staticStyles.textFlexShrink}>
            {title}
          </Typo>
          <Typo
            variant="body"
            color={theme.text.primary}
            style={staticStyles.textFlexShrink}>
            {subtitle}
          </Typo>
          <Typo
            variant="caption"
            color={theme.text.muted}
            fontFamily={FONTS.regular}
            style={staticStyles.textFlexShrink}
            size={moderateScale(13)}>
            {description}
          </Typo>
        </View>
        {/* Selection Circle */}
        <View style={dynamicStyles.circle} />
      </View>
    </Button>
  );
}
