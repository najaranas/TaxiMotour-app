import { useCallback, useState, useMemo, useEffect } from "react";
import { BackHandler, StyleSheet, View, Dimensions } from "react-native";
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
import { getSupabaseClient } from "@/services/supabaseClient";
import { RideProps, RideRequestCardProps, userDataType } from "@/types/Types";
import { useUserData } from "@/store/userStore";
import { pricingService } from "@/constants/app";
import { useSession } from "@clerk/clerk-expo";
import RideRequestCard from "@/components/home/RideRequestCard";
import Animated, { SequencedTransition } from "react-native-reanimated";

interface LocationData {
  place?: string;
  lon?: number | null;
  lat?: number | null;
}

const { height: screenHeight } = Dimensions.get("window");

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

  const [contentHeight, setContentHeight] = useState(0);
  const { isMapLoading, clearRoute, routeGeoJSON, routeLoading } =
    useMapStore();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { session } = useSession();
  const { t } = useTranslation();
  const { userData } = useUserData();
  const supabaseClient = getSupabaseClient(session);

  const [pendingRideRequests, setPendingRideRequests] = useState<
    (RideProps & userDataType)[]
  >([]);

  console.log("pendingRideRequests", pendingRideRequests);

  const snapPoints = useMemo(() => {
    if (contentHeight === 0) {
      // Fallback to percentage while measuring content
      return ["30%", "100%"];
    }

    // Convert content height to percentage of screen height
    const contentHeightPercentage = Math.min(
      Number(
        ((contentHeight + insets.bottom) / (screenHeight - insets.top)).toFixed(
          2
        )
      ) * 100,
      90 // Cap at 90% to ensure it doesn't take full screen on first snap
    );
    return [`${contentHeightPercentage}%`, "100%"];
  }, [contentHeight, insets.bottom, insets.top]);

  // Handler for content height measurement
  const handleContentLayout = useCallback(
    (height: number) => {
      if (height > 0 && height !== contentHeight) {
        setContentHeight(height);
      }
    },
    [contentHeight]
  );

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

  console.log("11routeGeoJSON", routeGeoJSON);
  console.log("11roadData.length ", roadData.length);

  const handleRequestRide = async () => {
    try {
      setIsRequestingRide(true);

      if (routeGeoJSON && roadData.length > 0) {
        const requestRideResponse = await supabaseClient.from("rides").insert({
          passenger_id: userData?.id,
          pickup_address: roadData[0]?.place,
          pickup_lat: `${roadData[0]?.lat}`,
          pickup_lon: `${roadData[0]?.lon}`,
          destination_address: roadData[1]?.place,
          destination_lat: `${roadData[1]?.lat}`,
          destination_lon: `${roadData[1]?.lon}`,
          ride_fare: `${pricingService?.calculateRidePrice(
            routeGeoJSON?.features[0]?.properties?.summary?.distance,
            routeGeoJSON?.features[0]?.properties?.summary?.duration
          )}`,
          distance: `${routeGeoJSON?.features[0]?.properties?.summary?.distance}`,
          duration: `${routeGeoJSON?.features[0]?.properties?.summary?.duration}`,
          status: "pending",
        } as RideProps);

        console.log("requestRideResponse", requestRideResponse);
      } else {
        console.log("aaezaeza");
      }
      setIsRideRequested(true);
    } catch (error) {
      console.error("Failed to request ride:", error);
      // Handle error - maybe show an alert or toast
    } finally {
      setIsRequestingRide(false);
    }
  };

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

  useEffect(() => {
    console.log("aze?.new");

    let channel;
    if (userData?.user_type === "driver") {
      channel = supabaseClient
        ?.channel("public:rides")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "rides",
            filter: "status=eq.pending",
          },
          (payload) => {
            console.log("new driver ride", payload?.new);
            handleNewPendingRide(payload.new as RideProps);
          }
        )
        .subscribe();
    } else {
      channel = supabaseClient
        ?.channel("public:rides")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "rides",
            filter: "status=eq.accepted",
          },
          (payload) => {
            console.log("new passengers ride", payload?.new);
            handleNewPendingRide(payload.new as RideProps);
          }
        )
        .subscribe();
    }

    return () => {
      supabaseClient.removeChannel(channel); // cleanup on unmount
    };
  }, []);

  const handleNewPendingRide = async (newPendingRideData: RideProps) => {
    // setRequestedPassengers();

    try {
      const passengerData = await supabaseClient
        ?.from("passengers")
        ?.select("*")
        ?.eq("id", newPendingRideData?.passenger_id)
        ?.single();
      if (passengerData?.data) {
        setPendingRideRequests((prev) => [
          ...prev,
          {
            ...newPendingRideData,
            ...passengerData.data,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching passenger data:", error);
    }
  };

  const removeCardFromRequestedRides = (rideID: string) => {
    console.log("here");
    setPendingRideRequests((prevRidesRequeted) =>
      prevRidesRequeted.filter((ridesRequeted) => ridesRequeted.id !== rideID)
    );
  };

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
          {
            top: insets.top + verticalScale(20),
            alignItems: "flex-start",
            flexDirection: "row",
            gap: horizontalScale(10),
          },
        ]}>
        <Button onPress={() => setIsDrawerOpen(true)}>
          <View
            style={[styles.menuButton, { backgroundColor: theme.background }]}>
            <MenuIcon color={theme.text.secondary} size={horizontalScale(25)} />
          </View>
        </Button>

        {/* Passengers  */}
        {userData?.user_type === "passenger" && (
          <Animated.FlatList
            itemLayoutAnimation={SequencedTransition}
            style={{
              // minHeight: pendingRideRequests.length > 1 ? verticalScale(200) : 0,
              backgroundColor: "red",
              maxHeight:
                screenHeight && screenHeight
                  ? Math.max(
                      screenHeight -
                        insets.top -
                        insets.bottom -
                        (contentHeight + verticalScale(50)),
                      verticalScale(500)
                    )
                  : verticalScale(500),
            }}
            data={pendingRideRequests}
            keyExtractor={(item, index) =>
              `ride-${item.id}` || `fallback-${index}`
            }
            ItemSeparatorComponent={() => (
              <View style={{ height: verticalScale(10) }} />
            )}
            renderItem={({ item: pendingRideRequestsItem }) => {
              const rideRequestData: RideRequestCardProps["rideRequestData"] = {
                ride_id: pendingRideRequestsItem?.ride_id,
                pickup_address: pendingRideRequestsItem?.pickup_address,
                destination_address:
                  pendingRideRequestsItem?.destination_address,
                distance: pendingRideRequestsItem?.distance,
                moto_type: pendingRideRequestsItem?.moto_type,
                duration: pendingRideRequestsItem?.duration,
                name: pendingRideRequestsItem?.full_name,
                passengerImg: pendingRideRequestsItem?.profile_image_url,
                ride_fare: pendingRideRequestsItem?.ride_fare,
                phone_number: pendingRideRequestsItem?.phone_number,
              };
              return (
                <RideRequestCard
                  removeCardFromRequestedRides={removeCardFromRequestedRides}
                  rideRequestData={rideRequestData}
                />
              );
            }}
          />
        )}
      </View>
      {!hasSelectedRoute ? (
        //  Ride Booking Bottom Sheet with responsive snap points
        <CustomBottomSheet
          enableOverDrag={false}
          enablePanDownToClose={false}
          onRef={setBottomSheetMethods}
          snapPoints={snapPoints} // Use dynamic snap points
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
            onContentLayout={handleContentLayout} // Pass layout handler
          />
        </CustomBottomSheet>
      ) : (
        //  Ride Action Buttons - Show when route is selected
        !isMapLoading &&
        !routeLoading && (
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
    right: horizontalScale(20),
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
