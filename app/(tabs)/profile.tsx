import React, { useState } from "react";
import { View, StyleSheet, Switch, Image } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { UserIcon } from "@/components/common/SvgIcons";
import Typo from "@/components/common/Typo";
import Button from "@/components/common/Button";
import { Flag, Globe, LogOut, Moon, Pencil, User } from "lucide-react-native";

export default function ProfileScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <ScreenWrapper
      style={styles.container}
      safeArea
      padding={horizontalScale(15)}
      scroll
      contentContainerStyle={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: verticalScale(5),
          }}>
          <Button onPress={() => router.push("/screens/Profile/Selfie")}>
            <View style={styles.profileImageWrapper}>
              {user?.hasImage ? (
                <Image
                  source={{ uri: user?.imageUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <UserIcon
                    color={COLORS.gray["600"]}
                    bold
                    size={horizontalScale(70)}
                  />
                </View>
              )}
              <View style={styles.profileEditIconWrapper}>
                <View style={styles.profileEditIconInner}>
                  <Pencil
                    color={COLORS.white}
                    strokeWidth={1.5}
                    size={moderateScale(20)}
                  />
                </View>
              </View>
            </View>
          </Button>

          <Typo style={styles.profileGreeting} variant="h3">
            {user?.firstName ? `Hi, ${user.firstName}!` : "Welcome!"}
          </Typo>
        </View>
        {/* Profile Menu List */}
        <View style={styles.menuContainer}>
          {/* Personal Info */}
          <Button style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemContent}>
              <User
                color={THEME.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
              <Typo
                variant="body"
                size={moderateScale(17)}
                color={THEME.text.primary}>
                Personal Info
              </Typo>
            </View>
          </Button>

          {/* Language */}
          <Button style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemContent}>
              <Globe
                color={THEME.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
              <View style={{ gap: verticalScale(5) }}>
                <Typo variant="body" color={THEME.text.primary}>
                  Language
                </Typo>
                <Typo
                  variant="caption"
                  fontFamily={FONTS.regular}
                  color={THEME.text.secondary}>
                  English
                </Typo>
              </View>
            </View>
          </Button>

          {/* Dark Mode */}
          <Button style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemContent}>
              <Moon
                color={THEME.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
              <Typo variant="body" color={THEME.text.primary}>
                Dark Mode
              </Typo>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{
                false: COLORS.gray["100"],
                true: COLORS.secondary,
              }}
              thumbColor={isDarkMode ? COLORS.white : COLORS.gray["200"]}
              ios_backgroundColor={COLORS.gray["200"]}
              style={{ transform: [{ scale: 1.2 }] }}
            />
          </Button>

          {/* Logout */}
          <Button
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleSignOut}>
            <View style={styles.menuItemContent}>
              <LogOut
                color={COLORS.danger}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
              <Typo variant="body" color={COLORS.danger}>
                Logout
              </Typo>
            </View>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray["100"],
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(12),
  },
  profileImageWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: horizontalScale(100),
    height: horizontalScale(100),
    aspectRatio: 1,
    borderRadius: horizontalScale(100) / 2,
    backgroundColor: COLORS.gray["100"],
    alignItems: "center",
    justifyContent: "center",
  },
  profileImagePlaceholder: {
    width: horizontalScale(100),
    height: horizontalScale(100),
    aspectRatio: 1,
    borderRadius: horizontalScale(100) / 2,
    backgroundColor: COLORS.gray["100"],
    alignItems: "center",
    justifyContent: "center",
  },
  profileEditIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: -horizontalScale(5),
    backgroundColor: THEME.background,
    borderRadius: 50,
    padding: horizontalScale(3),
  },
  profileEditIconInner: {
    backgroundColor: COLORS.secondary,
    borderRadius: 50,
    padding: horizontalScale(7),
  },
  profileGreeting: {
    textAlign: "center",
    marginTop: verticalScale(10),
  },
});
