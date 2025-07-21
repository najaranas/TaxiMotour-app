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

export default function TabLayout() {
  const { theme } = useTheme();
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
      }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon size={moderateScale(27)} color={color} bold={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          tabBarIcon: ({ color, focused }) => (
            <MotoIcon size={moderateScale(27)} color={color} bold={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ color, focused }) => (
            <BagIcon size={moderateScale(27)} color={color} bold={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <UserIcon size={moderateScale(27)} color={color} bold={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
