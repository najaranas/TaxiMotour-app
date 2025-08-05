import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Switch,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { COLORS, FONTS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { createClient } from "@supabase/supabase-js";

import { useAuth, useClerk, useSession, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Typo from "@/components/common/Typo";
import Button from "@/components/common/Button";
import UserProfileImage from "@/components/common/UserProfileImage";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { ProfileMenuItemConfig, BottomSheetMethods } from "@/types/Types";
import { profileMenuItems } from "@/constants/data";
import CustomBottomSheetModal from "@/components/common/CustomBottomSheetModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { getSupabaseClient } from "@/services/supabaseClient";

/**
 * ProfileScreen - Main profile screen component
 *
 * Features:
 * - User profile information display
 * - Navigation to personal info and profile photo screens
 * - Settings menu (language, dark mode)
 * - Logout functionality with confirmation modal
 * - Clean, type-safe implementation with proper error handling
 */
export default function ProfileScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { session } = useSession();
  const { getToken } = useAuth();

  const { theme, themeName, setTheme } = useTheme();
  const { t } = useTranslation();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State management
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Ref for CustomBottomSheetModal
  const [bottomSheetRef, setBottomSheetRef] =
    useState<BottomSheetMethods | null>(null);

  useEffect(() => {
    if (themeName === "dark") {
      setIsDarkModeEnabled(true);
    } else {
      setIsDarkModeEnabled(false);
    }
  }, [themeName]);

  const handlethemeToggle = (value: boolean) => {
    setIsDarkModeEnabled((prev) => !prev);
    setTheme(value ? "dark" : "light");
  };

  // Navigation handlers
  const navigateToProfilePhoto = () => {
    router.navigate("/(profile)/Selfie");
  };

  // Bottom sheet handlers
  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
    bottomSheetRef?.present?.();
  };

  const hideLogoutModal = () => {
    setIsLogoutModalVisible(false);
    bottomSheetRef?.dismiss?.();
  };

  // Logout handler
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", JSON.stringify(error, null, 2));
    } finally {
      setIsSigningOut(false);
      hideLogoutModal();
    }
  };

  // Component renderers
  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <UserProfileImage
        imageUrl={user?.imageUrl}
        hasImage={user?.hasImage}
        onPress={navigateToProfilePhoto}
        size={100}
        showEditIcon={true}
        editable={true}
      />
      <Typo style={styles.profileGreeting} variant="h3">
        {user?.firstName
          ? t("profile.hiUser", { name: user.firstName })
          : t("profile.welcome")}
      </Typo>
    </View>
  );

  // Menu item action handlers
  const handleMenuItemPress = (item: ProfileMenuItemConfig) => {
    switch (item.action) {
      case "logout":
        showLogoutModal();
        break;
      case "language_settings":
        router.navigate("/(profile)/Languages");
        break;

      default:
        if (item.route) {
          router.navigate(item.route as any);
        }
        break;
    }
  };

  // Menu list component - renders all profile menu items
  const ProfileMenuList = () => (
    <View style={styles.menuContainer}>
      {profileMenuItems.map((item) => {
        const IconComponent = item.icon;
        const color = item.isDanger ? COLORS.danger : theme.text.primary;

        return (
          <Button
            activeOpacity={item.type === "toggle" ? 1 : 0.5}
            key={item.id}
            style={[
              styles.menuItem,
              item.subtitle && styles.menuItemWithSubtitle,
              item.isDanger && styles.menuItemDanger,
              !item.isDanger && { borderBottomWidth: theme.borderWidth.thin },
            ]}
            onPress={() => handleMenuItemPress(item)}>
            <View style={styles.menuItemContent}>
              <IconComponent
                color={color}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
              <View style={styles.menuItemTextContainer}>
                <Typo variant="body" size={moderateScale(16)} color={color}>
                  {t(item.title)}
                </Typo>
                {item.subtitle && (
                  <Typo
                    variant="caption"
                    fontFamily={FONTS.regular}
                    color={theme.text.secondary}>
                    {t(item.subtitle)}
                  </Typo>
                )}
              </View>
            </View>
            {/* Show toggle switch for dark mode */}
            {item.type === "toggle" && (
              <Switch
                value={isDarkModeEnabled}
                onValueChange={handlethemeToggle}
                trackColor={{
                  false: COLORS.gray["100"],
                  true: COLORS.secondary,
                }}
                thumbColor={
                  isDarkModeEnabled ? COLORS.white : COLORS.gray["200"]
                }
                ios_backgroundColor={COLORS.gray["200"]}
                style={styles.switch}
              />
            )}
          </Button>
        );
      })}
    </View>
  );

  const renderLogoutModal = () => (
    <CustomBottomSheetModal
      isVisible={isLogoutModalVisible}
      onClose={() => setIsLogoutModalVisible(false)}
      onRef={setBottomSheetRef}
      enablePanDownToClose
      enableOverDrag
      showIndicator
      showBackdrop>
      <BottomSheetView
        style={[
          styles.logoutModalContent,
          { paddingBottom: insets.bottom + verticalScale(20) },
        ]}>
        <Typo color={theme.text.primary} variant="h3">
          {t("profile.logoutConfirmation")}
        </Typo>

        <Button
          onPress={handleSignOut}
          loading={isSigningOut}
          disabled={isSigningOut}
          style={[
            styles.logouButton,
            {
              borderRadius: theme.borderRadius.circle,
              backgroundColor: COLORS.danger,
            },
          ]}>
          <Typo
            style={styles.buttonText}
            variant="button"
            color={theme.button.text}>
            {t("profile.confirmLogout")}
          </Typo>
        </Button>

        <Button
          onPress={hideLogoutModal}
          style={[
            styles.logouButton,
            {
              borderRadius: theme.borderRadius.circle,
              backgroundColor: theme.gray.surface,
            },
          ]}>
          <Typo
            style={styles.buttonText}
            variant="button"
            color={COLORS.gray["600"]}>
            {t("profile.cancel")}
          </Typo>
        </Button>
      </BottomSheetView>
    </CustomBottomSheetModal>
  );

  const fetchUserData = async () => {
    try {
      console.log("User ID:", user?.id);
      const supabase = getSupabaseClient(session);

      const res = await supabase
        .from("drivers")
        .update({
          full_name: "pippo",
        })
        .eq("user_id", user?.id)
        .select("*");
      console.log("User ID from Clerk:", res);

      // const az = await supabase.from("drivers").insert({
      //   user_id: user?.id,
      //   full_name: "test",
      // });
      // console.log("Matching drivers row:", az);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <ScreenWrapper
      style={styles.container}
      safeArea
      scroll
      hasBottomTabs
      padding={horizontalScale(15)}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {renderProfileHeader()}
      <ProfileMenuList />
      <TouchableOpacity onPress={() => fetchUserData()}>
        <Text>aze</Text>
      </TouchableOpacity>

      {renderLogoutModal()}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(5),
  },
  profileGreeting: {
    textAlign: "center",
    marginTop: verticalScale(10),
  },
  menuContainer: {
    marginTop: verticalScale(20),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(10),
    borderBottomColor: COLORS.gray["100"],
  },
  menuItemWithSubtitle: {
    paddingVertical: verticalScale(15),
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(12),
  },
  menuItemTextContainer: {
    gap: verticalScale(5),
  },
  switch: {
    transform: [{ scale: 1.2 }],
  },
  logoutModalContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: horizontalScale(20),
    gap: verticalScale(10),
  },

  logouButton: {
    width: "60%",
    padding: horizontalScale(10),
    justifyContent: "center",
    alignItems: "center",
    minHeight: verticalScale(50),
  },
  buttonText: {
    textAlign: "center",
  },
});
