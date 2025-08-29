import { useCallback, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

// Components
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Button from "@/components/common/Button";
import CustomDrawer from "@/components/common/CustomDrawer";
import CustomBottomSheet from "@/components/common/CustomBottomSheet";
import { MenuIcon } from "@/components/common/SvgIcons";

// New modular components
import CustomMap from "@/components/map/CustomMap";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import RideBookingSheet from "@/components/home/RideBookingSheet";

// Styling
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { apiUtils } from "@/services/api";
import { useTheme } from "@/contexts/ThemeContext";
import StatusBarOverlay from "@/components/common/StatusBarOverlay";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import Typo from "@/components/common/Typo";
import { useTranslation } from "react-i18next";
import { PulseIndicator } from "react-native-indicators";
import { useMapStore } from "@/store/mapStore";

interface LocationData {
  place?: string;
  lon?: number | null;
  lat?: number | null;
}

export default function Home() {
  // State management
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bottomSheetMethods, setBottomSheetMethods] = useState<any>(null);
  const [activeBottomSheetIndex, setActiveBottomSheetIndex] =
    useState<number>(0);
  const [currentLocation, setCurrentLocation] = useState<LocationData | string>(
    ""
  );
  const [destinationLocation, setDestinationLocation] = useState<
    LocationData | string
  >("");
  const [roadData, setRoadData] = useState<LocationData[]>([]);
  const [hasSelectedRoute, setHasSelectedRoute] = useState(false);
  const [isRideRequested, setIsRideRequested] = useState(false);
  const [isRequestingRide, setIsRequestingRide] = useState(false);
  const { isMapLoading, clearRoute } = useMapStore();

  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Handlers
  const handleSnapToIndex = useCallback(
    (index: number) => {
      bottomSheetMethods?.snapToIndex(index);
    },
    [bottomSheetMethods]
  );

  const handleCurrentLocationChange = (location: LocationData) => {
    setCurrentLocation(location);
  };

  const handleDestinationLocationChange = (location: LocationData) => {
    setDestinationLocation(location);
  };

  const handleRoadDataChange = (newRoadData: LocationData[]) => {
    // Only update road data if we have valid coordinates
    const validRoadData = newRoadData.filter((location) =>
      apiUtils.validateCoordinates(location.lat ?? null, location.lon ?? null)
    );
    console.log("validRoadData", validRoadData);
    if (validRoadData.length >= 2) {
      setRoadData(validRoadData);
      setHasSelectedRoute(true);
      // Hide the bottom sheet when route is selected
      setActiveBottomSheetIndex(0);
      handleSnapToIndex(0);
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleChangeRoute = useCallback(() => {
    setHasSelectedRoute(false);
    setIsRideRequested(false);
    setRoadData([]);
    clearRoute(); // Clear the route from store

    setActiveBottomSheetIndex(1);
    handleSnapToIndex(1);
  }, [handleSnapToIndex, clearRoute]);

  const handleRequestRide = useCallback(async () => {
    try {
      setIsRequestingRide(true);
      // Simulate API call - replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsRideRequested(true);
    } catch (error) {
      console.error("Failed to request ride:", error);
      // Handle error - maybe show an alert or toast
    } finally {
      setIsRequestingRide(false);
    }
  }, []);

  const handleCancelRide = useCallback(() => {
    setIsRideRequested(false);
    // You might want to call an API to cancel the ride request here
  }, []);

  // Cleanup on focus change
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        console.log("isDrawerOpen", isDrawerOpen);
        if (isDrawerOpen) {
          setIsDrawerOpen(false);
        } else if (isRideRequested) {
          // If ride is requested, cancel it and go back to route selection
          handleCancelRide();
        } else if (hasSelectedRoute) {
          // If route is selected, go back to route selection
          handleChangeRoute();
        } else if (activeBottomSheetIndex === 1) {
          setActiveBottomSheetIndex(0);
          handleSnapToIndex(0);
        } else {
          BackHandler.exitApp();
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => {
        backHandler.remove();
        isDrawerOpen && setIsDrawerOpen(false);
      };
    }, [
      isDrawerOpen,
      isRideRequested,
      hasSelectedRoute,
      activeBottomSheetIndex,
      setActiveBottomSheetIndex,
      handleSnapToIndex,
      handleChangeRoute,
      handleCancelRide,
    ])
  );

  console.log("activeBottomSheetIndex", activeBottomSheetIndex);
  console.log("roadData roadData", roadData);
  return (
    <ScreenWrapper safeArea={false} style={styles.container} hasBottomTabs>
      {/* Enhanced Map Component */}
      <CustomMap
        roadData={roadData}
        viewPadding={{
          paddingLeft: horizontalScale(50),
          paddingRight: horizontalScale(50),
          paddingTop: verticalScale(70),
          paddingBottom: verticalScale(200),
        }}
      />

      <StatusBarOverlay />

      {/* Navigation Drawer */}

      <View
        style={[StyleSheet.absoluteFill, { zIndex: 15 }]}
        pointerEvents={isDrawerOpen ? "auto" : "none"}>
        <CustomDrawer
          open={isDrawerOpen}
          onOpen={() => setIsDrawerOpen(true)}
          onClose={handleDrawerClose}>
          <NavigationDrawer onClose={handleDrawerClose} />
        </CustomDrawer>
      </View>

      {/* Menu Button */}
      <View
        style={[
          styles.menuButtonContainer,
          { top: insets.top + verticalScale(20) },
        ]}>
        <Button onPress={() => setIsDrawerOpen(true)}>
          <View
            style={[styles.menuButton, { backgroundColor: theme.background }]}>
            <MenuIcon color={theme.text.secondary} size={horizontalScale(25)} />
          </View>
        </Button>
      </View>

      {!hasSelectedRoute ? (
        //  Ride Booking Bottom Sheet
        <CustomBottomSheet
          enableOverDrag={false}
          enablePanDownToClose={false}
          onRef={setBottomSheetMethods}
          snapPoints={["20%", "100%"]}
          index={activeBottomSheetIndex}
          zindex={10}
          onChange={setActiveBottomSheetIndex}>
          <RideBookingSheet
            activeIndex={activeBottomSheetIndex}
            onSnapToIndex={handleSnapToIndex}
            currentLocation={currentLocation}
            destinationLocation={destinationLocation}
            onCurrentLocationChange={handleCurrentLocationChange}
            onDestinationLocationChange={handleDestinationLocationChange}
            onRoadDataChange={handleRoadDataChange}
          />
        </CustomBottomSheet>
      ) : (
        //  Ride Action Buttons - Show when route is selected
        !isMapLoading && (
          <View
            style={[
              styles.buttonColumn,
              {
                backgroundColor: theme.background,
                borderTopRightRadius: theme.borderRadius.pill,
                borderTopLeftRadius: theme.borderRadius.pill,
              },
            ]}>
            {/* Status indicator - Only show after ride is requested */}

            {(isRideRequested || isRequestingRide) && (
              <View
                style={{
                  flexDirection: "row",
                  gap: horizontalScale(10),
                  alignItems: "center",
                }}>
                <View>
                  <PulseIndicator
                    color={COLORS.secondary}
                    size={moderateScale(30)}
                  />
                </View>
                <Typo
                  variant="body"
                  size={moderateScale(16)}
                  color={theme.text.primary}>
                  {isRideRequested
                    ? t("home.waitingForOffers")
                    : t("home.findingDriver")}
                </Typo>
              </View>
            )}

            {/* Action buttons */}
            <View style={{ gap: horizontalScale(10), width: "100%" }}>
              {!isRideRequested ? (
                <>
                  <Button
                    onPress={handleRequestRide}
                    loading={isRequestingRide}
                    disabled={isRequestingRide}
                    indicatorStyle={{ color: COLORS.white }}
                    style={[
                      styles.actionButton,
                      { backgroundColor: COLORS.secondary },
                    ]}>
                    <Typo
                      size={moderateScale(17)}
                      fontFamily={FONTS.bold}
                      color={COLORS.white}>
                      {t("home.requestRide")}
                    </Typo>
                  </Button>
                  <Button
                    onPress={handleChangeRoute}
                    disabled={isRequestingRide}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: isRequestingRide
                          ? COLORS.gray["200"]
                          : COLORS.gray["100"],
                      },
                    ]}>
                    <Typo
                      size={moderateScale(17)}
                      fontFamily={FONTS.medium}
                      color={
                        isRequestingRide ? COLORS.gray["400"] : COLORS.black
                      }>
                      {t("home.changeRoute")}
                    </Typo>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onPress={handleCancelRide}
                    style={[
                      styles.actionButton,
                      { backgroundColor: COLORS.danger },
                    ]}>
                    <Typo
                      size={moderateScale(17)}
                      fontFamily={FONTS.bold}
                      color={COLORS.white}>
                      {t("home.cancelRide")}
                    </Typo>
                  </Button>
                  <Button
                    onPress={handleChangeRoute}
                    style={[
                      styles.actionButton,
                      { backgroundColor: COLORS.gray["100"] },
                    ]}>
                    <Typo
                      size={moderateScale(17)}
                      fontFamily={FONTS.medium}
                      color={COLORS.black}>
                      {t("home.changeRoute")}
                    </Typo>
                  </Button>
                </>
              )}
            </View>
          </View>
        )
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  menuButtonContainer: {
    position: "absolute",
    left: horizontalScale(20),
    zIndex: 5,
  },
  menuButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: horizontalScale(12),
    borderRadius: horizontalScale(25),
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  buttonColumn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    gap: verticalScale(15),
    padding: horizontalScale(20),
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: horizontalScale(10),
    borderRadius: THEME.borderRadius.circle,
    minHeight: verticalScale(55),
    width: "100%",
  },
});
