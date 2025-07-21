import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { COLORS, FONTS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Typo from "@/components/common/Typo";
import Button from "@/components/common/Button";
import { UserIcon } from "@/components/common/SvgIcons";
import {
  Settings,
  Info,
  ShieldCheck,
  CalendarCheck,
  X,
} from "lucide-react-native";
import { APP_CONFIG, ROUTE_CONFIG } from "@/constants/app";
import { useUser } from "@clerk/clerk-expo";

interface NavigationDrawerProps {
  onClose: () => void;
}

export default function NavigationDrawer({ onClose }: NavigationDrawerProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();
  const handleMyAccount = () => {
    router.navigate(ROUTE_CONFIG.PROFILE);
    onClose();
  };

  const menuItems = APP_CONFIG.DRAWER_MENU_ITEMS.map((item) => {
    const iconMap = {
      history: CalendarCheck,
      about: Info,
      safety: ShieldCheck,
      settings: Settings,
    };

    return {
      icon: iconMap[item.id as keyof typeof iconMap],
      title: item.title,
      onPress: () => console.log(`${item.title} pressed`),
    };
  });

  return (
    <View
      style={[
        styles.drawerContent,
        { paddingTop: insets.top + verticalScale(10) },
      ]}>
      <View
        style={[
          styles.drawerHeader,
          { borderBottomWidth: theme.borderWidth.thick },
        ]}>
        <Button onPress={handleMyAccount} style={styles.userButton}>
          <View style={styles.avatar}>
            <UserIcon
              bold
              color={COLORS.gray["500"]}
              size={horizontalScale(25)}
            />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Typo variant="body" numberOfLines={1} fontFamily={FONTS.medium}>
              {user?.fullName}
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(13)}
              color={COLORS.primary}
              fontFamily={FONTS.regular}>
              My account
            </Typo>
          </View>
        </Button>

        <Button onPress={onClose}>
          <X
            color={theme.text.primary}
            strokeWidth={1.5}
            size={moderateScale(25)}
          />
        </Button>
      </View>

      <View
        style={[
          styles.menuSection,
          { borderBottomWidth: theme.borderWidth.thick },
        ]}>
        {menuItems.map((item, index) => (
          <Button key={index} onPress={item.onPress} style={styles.menuItem}>
            <View style={styles.menuItemRow}>
              <item.icon
                color={theme.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
          </Button>
        ))}
      </View>

      <View style={styles.drawerFooter}>
        <Text style={styles.creatorText}>
          Created by {APP_CONFIG.CREATOR_NAME}
        </Text>
        <Text style={styles.versionText}>Version {APP_CONFIG.APP_VERSION}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: COLORS.white,
    padding: horizontalScale(15),
    flex: 1,
    alignItems: "flex-start",
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: horizontalScale(15),
    borderBottomColor: COLORS.gray["200"],
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    flex: 1,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    padding: horizontalScale(8),
    borderRadius: horizontalScale(25),
    backgroundColor: COLORS.gray["100"],
  },
  menuSection: {
    width: "100%",
    marginTop: verticalScale(20),
    paddingBottom: horizontalScale(15),
    borderBottomColor: COLORS.gray["200"],
    flex: 1,
  },
  menuItem: {
    width: "100%",
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(5),
    marginBottom: verticalScale(5),
    borderRadius: horizontalScale(8),
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  menuText: {
    fontSize: moderateScale(16),
    color: COLORS.gray[700],
    fontFamily: FONTS.medium,
  },
  drawerFooter: {
    width: "100%",
    marginTop: "auto",
    paddingTop: verticalScale(20),
    alignItems: "center",
  },
  creatorText: {
    fontSize: moderateScale(14),
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    marginBottom: verticalScale(8),
  },
  versionText: {
    fontSize: moderateScale(12),
    color: COLORS.gray[500],
    fontFamily: FONTS.regular,
  },
});
