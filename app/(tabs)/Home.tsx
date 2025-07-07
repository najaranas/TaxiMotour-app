import { StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { useState } from "react";
import Map from "@/components/common/Map";
import Button from "@/components/common/Button";
import {
  AboutIcon,
  ClosIcon,
  HistoryIcon,
  MenuIcon,
  SafetyIcon,
  SettingIcon,
  UserIcon,
} from "@/components/common/SvgIcons";
import { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomDrawer from "@/components/common/CustomDrawer";
import Typo from "@/components/common/Typo";
import { useRouter } from "expo-router";

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const route = useRouter();

  const myAccountHandler = () => {
    route.push("/(tabs)/profile");
  };
  return (
    <ScreenWrapper safeArea={false} style={styles.container}>
      {/* Map in the background */}
      <Map />
      {/* </View> */}

      {/* Touch handler wrapper for drawer */}
      <View
        style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
        pointerEvents={isDrawerOpen ? "auto" : "none"} // ✅ disables touch blocking when drawer is closed
      >
        <CustomDrawer
          open={isDrawerOpen}
          onOpen={() => setIsDrawerOpen(true)}
          onClose={() => setIsDrawerOpen(false)}
          // style={StyleSheet.absoluteFill}
        >
          <View
            style={[
              styles.drawerContent,
              { paddingTop: insets.top + verticalScale(10) },
            ]}>
            <View style={styles.drawerHeader}>
              <Button onPress={myAccountHandler} style={styles.userButton}>
                <View style={styles.avatar}>
                  <UserIcon
                    color={COLORS.gray["500"]}
                    size={horizontalScale(25)}
                  />
                </View>
                <View>
                  <Typo variant="body" fontFamily={FONTS.medium}>
                    +216 93 772 115
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

              <Button onPress={() => setIsDrawerOpen(false)}>
                <ClosIcon size={horizontalScale(25)} />
              </Button>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <Button
                onPress={() => console.log("Trip History pressed")}
                style={styles.menuItem}>
                <View style={styles.menuItemRow}>
                  <HistoryIcon
                    size={horizontalScale(27)}
                    color={COLORS.gray["500"]}
                  />
                  <Text style={styles.menuText}>Trip History</Text>
                </View>
              </Button>

              <Button
                onPress={() => console.log("About App pressed")}
                style={styles.menuItem}>
                <View style={styles.menuItemRow}>
                  <AboutIcon
                    size={horizontalScale(27)}
                    color={COLORS.gray["500"]}
                  />
                  <Text style={styles.menuText}>About App</Text>
                </View>
              </Button>

              <Button
                onPress={() => console.log("Safety Center pressed")}
                style={styles.menuItem}>
                <View style={styles.menuItemRow}>
                  <SafetyIcon
                    size={horizontalScale(27)}
                    color={COLORS.gray["500"]}
                  />
                  <Text style={styles.menuText}>Safety Center</Text>
                </View>
              </Button>

              <Button
                onPress={() => console.log("Settings pressed")}
                style={styles.menuItem}>
                <View style={styles.menuItemRow}>
                  <SettingIcon
                    size={horizontalScale(27)}
                    color={COLORS.gray["500"]}
                  />
                  <Text style={styles.menuText}>Settings</Text>
                </View>
              </Button>
            </View>

            {/* Footer Section */}
            <View style={styles.drawerFooter}>
              <Text style={styles.creatorText}>Created by Anas Najar</Text>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </View>
        </CustomDrawer>
      </View>

      {/* Menu button  */}
      <Button
        style={[
          styles.menuButtonContainer,
          { top: insets.top + verticalScale(20) },
        ]}
        onPress={() => setIsDrawerOpen(true)}>
        <View style={styles.menuButton}>
          <MenuIcon color={COLORS.black} size={horizontalScale(25)} />
        </View>
      </Button>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    borderBottomWidth: 3,
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
    padding: horizontalScale(10),
    borderRadius: horizontalScale(25),
    backgroundColor: COLORS.gray["100"],
  },
  menuSection: {
    width: "100%",
    marginTop: verticalScale(20),
    paddingBottom: horizontalScale(15),
    borderBottomWidth: 3,
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
  menuButtonContainer: {
    position: "absolute",
    left: horizontalScale(20),
  },
  menuButton: {
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    padding: horizontalScale(12),
    borderRadius: horizontalScale(25),
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
