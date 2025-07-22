import { useState, useEffect } from "react";
import { View, StyleSheet, Switch } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { COLORS, FONTS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useClerk, useUser } from "@clerk/clerk-expo";
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
  const { theme, setTheme } = useTheme();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State management
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Ref for CustomBottomSheetModal
  const [bottomSheetRef, setBottomSheetRef] =
    useState<BottomSheetMethods | null>(null);

  console.log("isDarkModeEnabled:", isDarkModeEnabled);

  useEffect(() => {
    if (isDarkModeEnabled) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [isDarkModeEnabled, setTheme]);

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
        {user?.firstName ? `Hi, ${user.firstName}!` : "Welcome!"}
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
        // TODO: Implement language selection
        console.log("Language settings pressed");
        break;
      case "toggle_dark_mode":
        // TODO: Implement dark mode toggle
        console.log("Dark mode toggle pressed");
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
                  {item.title}
                </Typo>
                {item.subtitle && (
                  <Typo
                    variant="caption"
                    fontFamily={FONTS.regular}
                    color={theme.text.secondary}>
                    {item.subtitle}
                  </Typo>
                )}
              </View>
            </View>
            {/* Show toggle switch for dark mode */}
            {item.type === "toggle" && (
              <Switch
                value={isDarkModeEnabled}
                onValueChange={setIsDarkModeEnabled}
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
      enablePanDownToClose={true}
      enableOverDrag={true}
      showIndicator={true}
      showBackdrop={true}>
      <BottomSheetView
        style={[
          styles.logoutModalContent,
          { paddingBottom: insets.bottom + verticalScale(20) },
        ]}>
        <Typo color={theme.text.primary} variant="h3">
          Log out?
        </Typo>

        <Button
          onPress={handleSignOut}
          loading={isSigningOut}
          disabled={isSigningOut}
          style={[
            styles.confirmLogoutButton,
            { borderRadius: theme.borderRadius.circle },
          ]}>
          <Typo
            style={styles.buttonText}
            variant="button"
            color={theme.button.text}>
            Confirm Logout
          </Typo>
        </Button>

        <Button
          onPress={hideLogoutModal}
          style={[
            styles.cancelButton,
            { borderRadius: theme.borderRadius.circle },
          ]}>
          <Typo
            style={styles.buttonText}
            variant="button"
            color={COLORS.gray["600"]}>
            Cancel
          </Typo>
        </Button>
      </BottomSheetView>
    </CustomBottomSheetModal>
  );
  return (
    <ScreenWrapper
      style={styles.container}
      safeArea
      scroll
      padding={horizontalScale(15)}
      contentContainerStyle={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {renderProfileHeader()}
      <ProfileMenuList />
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
  confirmLogoutButton: {
    backgroundColor: COLORS.danger,
    padding: horizontalScale(10),
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    minHeight: verticalScale(40),
  },
  cancelButton: {
    backgroundColor: COLORS.gray["200"],
    width: "60%",
    padding: horizontalScale(10),
    justifyContent: "center",
    alignItems: "center",
    minHeight: verticalScale(40),
  },
  buttonText: {
    textAlign: "center",
  },
});
