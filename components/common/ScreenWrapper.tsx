import React from "react";
import THEME from "@/constants/theme";
import { StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenWrapperProps } from "@/types/Types";

// ✅ Using INTERFACE for props with proper TypeScript
export default function ScreenWrapper({
  style,
  children,
  backgroundColor = THEME.background,
  padding = 0,
  safeArea = true,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const containerStyle = [
    styles.container,
    {
      backgroundColor,
      paddingTop: safeArea ? insets.top + padding : 0,
      paddingBottom: insets.bottom + padding,
      paddingRight: padding,
      paddingLeft: padding,
    },
    style,
  ];

  return (
    <View style={containerStyle}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"transparent"} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
