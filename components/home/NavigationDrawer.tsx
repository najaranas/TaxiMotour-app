import React from "react";
import { View, StyleSheet } from "react-native";
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
import { useTranslation } from "react-i18next";

interface NavigationDrawerProps {
  onClose: () => void;
}

export default function NavigationDrawer({ onClose }: NavigationDrawerProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();
  const { t } = useTranslation();
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
      title: t(`drawer.${item.id}`),
      onPress: () => console.log(`${item.title} pressed`),
    };
  });

  return (
    <View
      style={[
        styles.drawerContent,
        {
          paddingTop: insets.top + verticalScale(10),
          backgroundColor: theme.background,
        },
      ]}>
      <View
        style={[
          styles.drawerHeader,
          {
            borderBottomWidth: theme.borderWidth.thin,
            borderBottomColor: theme.input.border,
          },
        ]}>
        <Button onPress={handleMyAccount} style={styles.userButton}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.input.background },
            ]}>
            <UserIcon
              bold
              color={theme.text.secondary}
              size={horizontalScale(25)}
            />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Typo
              variant="body"
              numberOfLines={1}
              fontFamily={FONTS.medium}
              color={theme.text.primary}>
              {user?.fullName}
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(13)}
              color={theme.text.secondary}
              fontFamily={FONTS.regular}>
              {t("drawer.myAccount")}
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
          {
            borderBottomWidth: theme.borderWidth.thin,
            borderBottomColor: theme.input.border,
          },
        ]}>
        {menuItems.map((item, index) => (
          <Button key={index} onPress={item.onPress} style={styles.menuItem}>
            <View style={styles.menuItemRow}>
              <item.icon
                color={theme.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
              <Typo
                variant="body"
                size={moderateScale(16)}
                color={theme.text.primary}
                fontFamily={FONTS.medium}>
                {item.title}
              </Typo>
            </View>
          </Button>
        ))}
      </View>

      <View
        style={[styles.drawerFooter, { backgroundColor: theme.background }]}>
        <Typo
          variant="body"
          size={moderateScale(14)}
          color={theme.text.primary}
          fontFamily={FONTS.medium}>
          {t("drawer.createdBy", { creator: APP_CONFIG.CREATOR_NAME })}
        </Typo>
        <Typo
          variant="caption"
          size={moderateScale(12)}
          color={theme.text.secondary}
          fontFamily={FONTS.regular}>
          {t("drawer.version", { version: APP_CONFIG.APP_VERSION })}
        </Typo>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
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
  },
  menuSection: {
    width: "100%",
    marginTop: verticalScale(20),
    paddingBottom: horizontalScale(15),
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
  drawerFooter: {
    width: "100%",
    marginTop: "auto",
    paddingTop: verticalScale(20),
    alignItems: "center",
  },
});
