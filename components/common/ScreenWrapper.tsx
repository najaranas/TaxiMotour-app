import React from "react";
import THEME from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenWrapperProps } from "@/types/Types";

// ✅ Using INTERFACE for props with proper TypeScript
export default function ScreenWrapper({
  style,
  children,
  backgroundColor = THEME.background,
  padding,
  safeArea = true,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      backgroundColor,
      paddingTop: safeArea ? insets.top : 0,
      padding: padding,
    },
    style,
  ];

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
