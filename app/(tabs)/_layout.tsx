import { Tabs } from "expo-router";
import { COLORS } from "@/constants/theme";
import {
  BagIcon,
  HomeIcon,
  MotoIcon,
  UserIcon,
} from "@/components/common/SvgIcons";
import { moderateScale, verticalScale } from "@/utils/styling";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Platform,
  Pressable,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.text.primary,
        tabBarInactiveTintColor: theme.text.primary,
        headerShown: false,

        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: theme.borderWidth.thin,
          borderTopColor: COLORS.gray[100],
        },
        tabBarButton: (props) => (
          <Pressable
            {...(props as React.ComponentPropsWithRef<typeof Pressable>)}
            android_ripple={{
              color: theme.surface,
              radius: moderateScale(45),
            }}
            style={({ pressed }) => ({
              flex: 1,
              justifyContent: "center",
              borderRadius: theme.borderRadius.pill,
              alignItems: "center",
              // Platform-specific effects
              ...(Platform.OS === "ios" && {
                backgroundColor: pressed ? theme.surface : "transparent",
              }),
            })}
          />
        ),
      }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon size={moderateScale(27)} color={color} bold={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: t("tabs.rides"),
          tabBarIcon: ({ color, focused }) => (
            <MotoIcon size={moderateScale(27)} color={color} bold={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: t("tabs.earnings"),
          tabBarIcon: ({ color, focused }) => (
            <BagIcon size={moderateScale(27)} color={color} bold={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, focused }) => (
            <UserIcon size={moderateScale(27)} color={color} bold={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
