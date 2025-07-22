import { View, ScrollView, StatusBarStyle, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenWrapperProps } from "@/types/Types";
import { useTheme } from "@/contexts/ThemeContext";
import { SystemBars, SystemBarStyle } from "react-native-edge-to-edge";

export default function ScreenWrapper({
  style,
  children,
  backgroundColor,
  padding = 0,
  safeArea = true,
  scroll = false,
  systemBarsStyle,
  statusBarStyle,
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

  const defaultSystemBarsstyle: SystemBarStyle =
    themeName === "dark" ? "light" : "dark";

  const defaultStatusBarsstyle: StatusBarStyle =
    themeName === "dark" ? "light-content" : "dark-content";

  console.log("test", statusBarStyle || defaultStatusBarsstyle);
  console.log("statusBarStyle", statusBarStyle);
  return (
    <>
      <SystemBars
        style={{ navigationBar: systemBarsStyle || defaultSystemBarsstyle }}
      />
      <StatusBar
        barStyle={statusBarStyle || defaultStatusBarsstyle}
        backgroundColor={"transparent"}
        translucent
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
