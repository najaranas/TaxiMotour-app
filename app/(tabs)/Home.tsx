import { StyleSheet, Text, TextInput, View } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import React, { useEffect, useRef, useState } from "react";
import Map from "@/components/common/Map";
import Button from "@/components/common/Button";
import {
  AboutIcon,
  CloseIcon,
  HistoryIcon,
  MenuIcon,
  SafetyIcon,
  Searchcon,
  SettingIcon,
  UserIcon,
} from "@/components/common/SvgIcons";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomDrawer from "@/components/common/CustomDrawer";
import Typo from "@/components/common/Typo";
import { useFocusEffect, useRouter } from "expo-router";
import CustomBottomSheet from "@/components/common/CustomBottomSheet";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bottomSheetMethods, setBottomSheetMethods] = useState<any>(null);
  const [activeBottomSheetIndex, setActiveBottomSheetIndex] =
    useState<number>(0);
  const [locationInputFocused, setLocationInputFocused] = useState(false);
  const [destinationInputFocused, setDestinationInputFocused] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [destinationLocation, setDestinationLocation] = useState<string>("");

  const insets = useSafeAreaInsets();
  const route = useRouter();

  const handleTextChange = async (text: string, type: string) => {
    if (type === "current") {
      setCurrentLocation(text);
    } else {
      setDestinationLocation(text);
    }

    await fetchSuggestions(text);
  };

  const searchInputsRef = useRef<{
    locationInputRef: TextInput | null;
    destinationInputRef: TextInput | null;
  }>({
    locationInputRef: null,
    destinationInputRef: null,
  });

  const myAccountHandler = () => {
    route.push("/(tabs)/profile");
  };

  const snapToIndex = (index: number) => {
    bottomSheetMethods?.snapToIndex(index);
  };

  const fetchSuggestions = async (text: string) => {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          text
        )}.json?key=${
          process.env.EXPO_PUBLIC_MAPTILER_MAP_API
        }&bbox=7.5,30.0,12.0,38.0&limit=10`
      );
      const data = await response.json();
      console.log(data.features);
    } catch (error) {
      console.error("MapTiler error:", error);
    }
  };

  // useEffect(() => {
  // fetchSuggestions("halfaouine");
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => isDrawerOpen && setIsDrawerOpen(false);
    }, [isDrawerOpen])
  );

  return (
    <ScreenWrapper safeArea={false} style={styles.container}>
      {/* Map in the background */}
      <Map />

      <View
        style={[
          styles.menuButtonContainer,

          { top: insets.top + verticalScale(20) },
        ]}>
        <Button onPress={() => setIsDrawerOpen(true)}>
          <View style={styles.menuButton}>
            <MenuIcon color={COLORS.black} size={horizontalScale(25)} />
          </View>
        </Button>
      </View>
      {/* Touch handler wrapper for drawer */}
      <View
        style={[StyleSheet.absoluteFill, { zIndex: 20 }]}
        pointerEvents={isDrawerOpen ? "auto" : "none"}>
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
                    bold
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
                <CloseIcon size={horizontalScale(25)} />
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

      <CustomBottomSheet
        enableOverDrag
        onRef={setBottomSheetMethods}
        snapPoints={["100%"]}
        onChange={setActiveBottomSheetIndex}>
        {activeBottomSheetIndex === 0 ? (
          <Animated.View
            key="view1"
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft}
            style={{
              gap: 10,
              marginTop: verticalScale(5),
              paddingHorizontal: horizontalScale(15),
              padding: horizontalScale(16),
            }}>
            <Typo variant="h3">Let&apos;s go places.</Typo>
            <Button
              onPress={() => snapToIndex(1)}
              style={{
                backgroundColor: COLORS.gray["200"],
                padding: horizontalScale(15),
                borderRadius: THEME.borderRadius.medium,
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}>
              <Searchcon />
              <Typo variant="body">Where to go ?</Typo>
            </Button>
          </Animated.View>
        ) : (
          <Animated.View
            key="view2"
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft}
            style={{
              gap: 10,
              marginTop: verticalScale(5),
              padding: horizontalScale(15),
            }}>
            <Button onPress={() => snapToIndex(0)}>
              <CloseIcon />
            </Button>
            <View style={{ gap: verticalScale(5) }}>
              <View
                style={{
                  backgroundColor: COLORS.gray["200"],
                  padding: horizontalScale(6),
                  borderRadius: THEME.borderRadius.medium,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: horizontalScale(10),
                  borderWidth: 2,
                  borderColor: locationInputFocused
                    ? COLORS.secondary
                    : "transparent",
                }}>
                <Searchcon />
                <TextInput
                  ref={(el) => {
                    searchInputsRef.current.locationInputRef = el;
                  }}
                  value={currentLocation}
                  onChangeText={(text) => handleTextChange(text, "current")}
                  onFocus={() => setLocationInputFocused(true)}
                  onBlur={() => setLocationInputFocused(false)}
                  placeholder="Current location"
                  style={{
                    fontSize: moderateScale(16),
                    fontFamily: "Roboto-Regular",
                    flex: 1,
                  }}
                />
              </View>
              <View
                style={{
                  backgroundColor: COLORS.gray["200"],
                  padding: horizontalScale(6),
                  borderRadius: THEME.borderRadius.medium,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: horizontalScale(10),
                  borderWidth: 2,
                  borderColor: destinationInputFocused
                    ? COLORS.secondary
                    : "transparent",
                }}>
                <Searchcon />
                <TextInput
                  ref={(el) => {
                    searchInputsRef.current.destinationInputRef = el;
                  }}
                  value={destinationLocation}
                  onChangeText={(text) => handleTextChange(text, "destination")}
                  onFocus={() => setDestinationInputFocused(true)}
                  onBlur={() => setDestinationInputFocused(false)}
                  placeholder="Where to go?"
                  style={{
                    fontSize: moderateScale(16),
                    fontFamily: "Roboto-Regular",
                    flex: 1,
                  }}
                />
              </View>
            </View>
            <View></View>
          </Animated.View>
        )}
      </CustomBottomSheet>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
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
    padding: horizontalScale(8),
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
    // zIndex: 1,
  },
  bottomSheetButtonContainer: {
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
