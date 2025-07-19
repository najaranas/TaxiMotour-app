import React from "react";
import THEME from "@/constants/theme";
import { StatusBar, StyleSheet, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenWrapperProps } from "@/types/Types";

export default function ScreenWrapper({
  style,
  children,
  backgroundColor = THEME.background,
  padding = 0,
  safeArea = true,
  scroll = false,
  ...rest
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const containerStyle = [
    styles.container,
    {
      backgroundColor,
      paddingTop: safeArea ? insets.top + padding : 0,
      paddingBottom: safeArea ? insets.bottom + padding : 0,
      paddingRight: safeArea ? insets.right + padding : 0,
      paddingLeft: safeArea ? insets.left + padding : 0,
    },
    style,
  ];

  return scroll ? (
    <ScrollView style={containerStyle} {...rest}>
      <StatusBar
        barStyle={"dark-content"}
        translucent={true}
        backgroundColor={"transparent"}
      />
      {children}
    </ScrollView>
  ) : (
    <View style={containerStyle} {...rest}>
      <StatusBar
        barStyle={"dark-content"}
        translucent={true}
        backgroundColor={"transparent"}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
