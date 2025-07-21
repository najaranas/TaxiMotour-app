import { StatusBar, StyleSheet, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenWrapperProps } from "@/types/Types";
import { useTheme } from "@/contexts/ThemeContext";

export default function ScreenWrapper({
  style,
  children,
  backgroundColor,
  padding = 0,
  safeArea = true,
  scroll = false,
  ...rest
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const { theme, themeName } = useTheme();
  const containerStyle = [
    {
      paddingTop: safeArea ? insets.top + padding : 0,
      paddingBottom: safeArea ? insets.bottom + padding : 0,
      paddingRight: safeArea ? insets.right + padding : 0,
      paddingLeft: safeArea ? insets.left + padding : 0,
      flex: 1,
      backgroundColor: backgroundColor ? backgroundColor : theme.background,
    },
    style,
  ];

  return (
    <>
      <StatusBar
        barStyle={themeName === "light" ? "dark-content" : "light-content"}
        translucent={true}
        backgroundColor={"transparent"}
      />
      {scroll ? (
        <ScrollView style={[containerStyle]} {...rest}>
          {children}
        </ScrollView>
      ) : (
        <View style={containerStyle} {...rest}>
          {children}
        </View>
      )}
    </>
  );
}
