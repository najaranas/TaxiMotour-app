import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Switch } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import THEME, { COLORS } from "@/constants/theme";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { UserIcon } from "@/components/common/SvgIcons";
import Typo from "@/components/common/Typo";
import Button from "@/components/common/Button";
import { Globe, LogOut, Moon, Pencil, User } from "lucide-react-native";

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
      padding={horizontalScale(15)}>
      <ScrollView
        style={{ flex: 1 }}
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
            <View
              style={{
                padding: horizontalScale(10),
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                backgroundColor: COLORS.gray["100"],
                borderRadius: "50%",
              }}>
              <UserIcon
                color={COLORS.gray["600"]}
                bold
                size={horizontalScale(35)}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: -horizontalScale(5),
                  backgroundColor: THEME.background,
                  borderRadius: "50%",
                  padding: horizontalScale(2),
                }}>
                <View
                  style={{
                    backgroundColor: COLORS.secondary,
                    borderRadius: "50%",
                    padding: horizontalScale(4),
                  }}>
                  {/* <EditIcon color={COLORS.white} size={horizontalScale(15)} /> */}
                  <Pencil
                    color={COLORS.white}
                    strokeWidth={1.5}
                    size={moderateScale(13)}
                  />
                </View>
              </View>
            </View>

            <Typo style={{ textAlign: "center" }} variant="h3">
              {user?.fullName}
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
                <Typo variant="body" color={THEME.text.primary}>
                  Language
                </Typo>
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
                  false: COLORS.gray["200"],
                  true: COLORS.secondary,
                }}
                thumbColor={isDarkMode ? COLORS.white : COLORS.gray["400"]}
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
                  color="#FF4757"
                  strokeWidth={1.5}
                  size={moderateScale(25)}
                />
                <Typo variant="body" color="#FF4757">
                  Logout
                </Typo>
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
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
});
