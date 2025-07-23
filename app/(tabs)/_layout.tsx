import { Tabs } from "expo-router";
import { COLORS, FONTS } from "@/constants/theme";

import { moderateScale, verticalScale } from "@/utils/styling";
import { useTheme } from "@/contexts/ThemeContext";
import { Platform, Pressable, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { CalendarCheck, HandCoins, House, User } from "lucide-react-native";

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const role = "passenger";
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
          height: verticalScale(110),
        },

        tabBarItemStyle: {
          height: "100%",
          width: "100%",
          padding: 0,
          margin: 0,
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
            <House
              size={moderateScale(27)}
              color={color}
              strokeWidth={focused ? 1.8 : 1.3}
            />
          ),

          tabBarLabel: ({ color, focused }) => (
            <Text
              style={{
                color: color,
                fontFamily: focused ? FONTS.bold : FONTS.medium,
                fontSize: moderateScale(10),
              }}>
              {t("tabs.home")}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="Rides"
        options={{
          title: t("tabs.rides"),
          tabBarIcon: ({ color, focused }) => (
            <CalendarCheck
              size={moderateScale(27)}
              color={color}
              strokeWidth={focused ? 1.8 : 1.3}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text
              style={{
                color: color,
                fontFamily: focused ? FONTS.bold : FONTS.medium,
                fontSize: moderateScale(10),
              }}>
              {t("tabs.rides")}
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="Earnings"
        // redirect={role === "passenger"}
        options={{
          href: role === "passenger" ? null : undefined,

          title: t("tabs.earnings"),
          headerTitleStyle: { color: "red" },
          tabBarIcon: ({ color, focused }) => (
            <HandCoins
              size={moderateScale(27)}
              color={color}
              strokeWidth={focused ? 1.8 : 1.3}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text
              style={{
                color: color,
                fontFamily: focused ? FONTS.bold : FONTS.medium,
                fontSize: moderateScale(10),
              }}>
              {t("tabs.earnings")}
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, focused }) => (
            <User
              size={moderateScale(27)}
              color={color}
              strokeWidth={focused ? 1.8 : 1.3}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text
              style={{
                color: color,
                fontFamily: focused ? FONTS.bold : FONTS.medium,
                fontSize: moderateScale(10),
              }}>
              {t("tabs.profile")}
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
