import { Tabs } from "expo-router";
import { COLORS } from "@/constants/theme";
import {
  BagIcon,
  HomeIcon,
  MotoIcon,
  UserIcon,
} from "@/components/common/SvgIcons";
import { moderateScale } from "@/utils/styling";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray[500],
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.gray[200],
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
