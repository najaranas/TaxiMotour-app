import {
  View,
  ScrollView,
  StatusBarStyle,
  StatusBar,
  ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
  hasBottomTabs = false,
  ...rest
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const { theme, themeName } = useTheme();
  const containerStyle: ViewStyle = {
    paddingTop: safeArea ? insets.top + padding : 0,
    paddingRight: safeArea ? insets.right + padding : 0,
    paddingLeft: safeArea ? insets.left + padding : 0,
    paddingBottom: safeArea && !hasBottomTabs ? insets.bottom + padding : 0,
    flex: 1,
    backgroundColor: backgroundColor ? backgroundColor : theme.background,
    overflow: "hidden",
    ...{ style },
  };
  const defaultSystemBarsstyle: SystemBarStyle =
    themeName === "dark" ? "light" : "dark";

  const defaultStatusBarsstyle: StatusBarStyle =
    themeName === "dark" ? "light-content" : "dark-content";

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
        <View style={containerStyle}>
          <ScrollView {...rest}>{children}</ScrollView>
        </View>
      ) : (
        <View style={containerStyle} {...rest}>
          {children}
        </View>
      )}
    </>
  );
}
