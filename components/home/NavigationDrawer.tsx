import { useState } from "react";
import { View, StyleSheet, Share, Linking, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Typo from "@/components/common/Typo";
import Button from "@/components/common/Button";
import {
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  UserIcon,
} from "@/components/common/SvgIcons";

import {
  Info,
  CalendarCheck,
  X,
  Code,
  Star,
  Share2,
} from "lucide-react-native";
import { APP_CONFIG } from "@/constants/app";
import { useUser } from "@clerk/clerk-expo";
import { useTranslation } from "react-i18next";
import CustomBottomSheetModal from "../common/CustomBottomSheetModal";
import { BottomSheetView } from "@gorhom/bottom-sheet";

interface NavigationDrawerProps {
  onClose: () => void;
}

export default function NavigationDrawer({ onClose }: NavigationDrawerProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();
  const { t } = useTranslation();
  const [isDeveloperModalVisible, setIsDeveloperModalVisible] = useState(false);

  const handleMyAccount = () => {
    router.navigate("/(tabs)/Profile");
    onClose();
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message:
          "🚀 Download Taximoto now! Get safe and fast moto rides in your city.\nhttps://taximoto.app",
      });
    } catch (err) {
      console.log("Sharing failed:", err);
    }
  };

  const reviewApp = async () => {
    try {
      const url = Platform.select({
        ios: "itms-apps://itunes.apple.com/app/id951812684?action=write-review",
        android: `https://play.google.com/store/apps/details?id=com.muhammedhashim.misk_app&showAllReviews=true`,
      });
      if (url) await Linking.openURL(url);
    } catch (err) {
      console.log("Review failed:", err);
    }
  };

  type ItemId = "history" | "about" | "rate" | "share" | "developer";

  const itemPressHandler = (id: ItemId) => {
    switch (id) {
      case "history":
        router.navigate("/(tabs)/RidesHistory");
        onClose();
        break;
      case "about":
        router.navigate("/(drawer)/About");
        onClose();
        break;
      case "rate":
        reviewApp();
        break;
      case "share":
        shareApp();
        break;
      case "developer":
        setIsDeveloperModalVisible(true);
        break;
      default:
        break;
    }
  };

  const menuItems = APP_CONFIG.DRAWER_MENU_ITEMS.map((item) => {
    const iconMap = {
      history: CalendarCheck,
      about: Info,
      share: Share2,
      developer: Code,
      rate: Star,
    };

    // Use explicit translation keys for clarity

    return {
      icon: iconMap[item.id as keyof typeof iconMap],
      title: t(`drawer.${item.id}`),
      onPress: () => itemPressHandler(item.id),
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

      <CustomBottomSheetModal
        isVisible={isDeveloperModalVisible}
        onClose={() => setIsDeveloperModalVisible(false)}
        showBackdrop
        enablePanDownToClose
        showIndicator
        enableOverDrag>
        <BottomSheetView
          style={{
            paddingBottom: insets.bottom + verticalScale(20),
            justifyContent: "center",
            alignItems: "center",
            gap: verticalScale(15),
          }}>
          <Typo
            color={theme.text.primary}
            variant="body"
            size={moderateScale(20)}>
            {t("drawer.aboutDeveloper")}
          </Typo>
          <View style={{ alignItems: "center", gap: verticalScale(5) }}>
            <Typo
              variant="body"
              size={moderateScale(15)}
              color={theme.text.secondary}>
              {APP_CONFIG.CREATOR_NAME}
            </Typo>
            <Typo
              color={theme.text.muted}
              variant="body"
              size={moderateScale(15)}>
              {t("drawer.developerRole")}
            </Typo>
            <View
              style={{
                flexDirection: "row",
                gap: horizontalScale(15),
                marginTop: verticalScale(10),
              }}>
              <Button
                onPress={() =>
                  Linking.openURL(APP_CONFIG.SOCIAL_LINKS.LINKEDIN)
                }>
                <LinkedinIcon
                  color={theme.text.muted}
                  size={moderateScale(40)}
                />
              </Button>
              <Button
                onPress={() =>
                  Linking.openURL(APP_CONFIG.SOCIAL_LINKS.INSTAGRAM)
                }>
                <InstagramIcon
                  color={theme.text.muted}
                  size={moderateScale(40)}
                />
              </Button>
              <Button
                onPress={() =>
                  Linking.openURL(APP_CONFIG.SOCIAL_LINKS.TWITTER)
                }>
                <TwitterIcon
                  color={theme.text.muted}
                  size={moderateScale(40)}
                />
              </Button>
            </View>
          </View>
        </BottomSheetView>
      </CustomBottomSheetModal>
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
