import { useCallback, useState, useMemo, useEffect } from "react";
import { BackHandler, StyleSheet, View, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";

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
import {
  PassengerAcceptedCardProps,
  RideProps,
  RideRequestCardProps,
  userDataType,
} from "@/types/Types";
import { useUserData } from "@/store/userStore";
import { pricingService } from "@/constants/app";
import { useSession } from "@clerk/clerk-expo";
import RideRequestCard from "@/components/home/RideRequestCard";
import Animated, { SequencedTransition } from "react-native-reanimated";
import PassengerAcceptedCard from "@/components/home/PassengerAceptedCard";

interface LocationData {
  place?: string;
  lon?: number | null;
  lat?: number | null;
}

const { height: screenHeight } = Dimensions.get("window");

export default function Home() {
  // Router and hooks
  const router = useRouter();

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
  const [requestedRideData, setRequestedRideData] = useState<RideProps | null>(
    null
  );

  const [pendingRideRequests, setPendingRideRequests] = useState<
    (RideProps & userDataType)[]
  >([]);
  const [acceptedRide, setAcceptedRide] = useState<
    PassengerAcceptedCardProps["acceptedRideData"] | null
  >(null);

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
    console.log("handleRoadDataChange", newRoadData);
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

  const handleRequestRide = async () => {
    try {
      setIsRequestingRide(true);

      if (routeGeoJSON && roadData.length > 0) {
        const requestRideResponse = await supabaseClient
          .from("rides")
          .insert({
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
          } as RideProps)
          .select("*")
          .single();

        setRequestedRideData(requestRideResponse?.data);

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
  const handleCancelRide = useCallback(async () => {
    try {
      setIsRequestingRide(true);

      // Cancel ride in database if it exists
      if (requestedRideData?.ride_id) {
        await supabaseClient
          .from("rides")
          .update({ status: "cancelled" })
          .eq("ride_id", requestedRideData.ride_id);
      }

      // Clear local state
      setIsRideRequested(false);
      setAcceptedRide(null);
      setRequestedRideData(null);

      console.log("Ride cancelled successfully");
    } catch (error) {
      console.error("Error cancelling ride:", error);
    } finally {
      setIsRequestingRide(false);
    }
  }, [requestedRideData?.ride_id, supabaseClient]);

  const clearAllRideData = useCallback(() => {
    console.log("Clearing all ride data...");
    setRequestedRideData(null);
    setAcceptedRide(null);
    setIsRideRequested(false);
    setIsRequestingRide(false);
    setPendingRideRequests([]);
    setHasSelectedRoute(false);
    setRoadData([]);
    setCurrentLocation("");
    setDestinationLocation("");
    clearRoute();
    console.log("All ride data cleared successfully");
  }, [clearRoute]);

  const handleRideCompleted = useCallback(() => {
    try {
      console.log("Navigating to ride completion screen...");
      // Using correct route name based on file structure
      router?.push({
        pathname: "/(rides)/RideResult",
        params: {
          rideId: acceptedRide?.ride_id || "",
          status: "completed",
        },
      });
      // Clear ride data after navigation
      const timeout = setTimeout(() => clearAllRideData(), 100);
      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Error navigating to ride completion:", error);
    }
  }, [router, acceptedRide?.ride_id, clearAllRideData]);

  const handleRideCancelled = useCallback(() => {
    try {
      console.log("Navigating to ride cancellation screen...");
      // Using correct route name based on file structure
      router?.push({
        pathname: "/(rides)/RideResult",
        params: {
          rideId: acceptedRide?.ride_id || requestedRideData?.ride_id || "",
          status: "canceled",
        },
      });
      // Clear ride data after navigation
      setTimeout(() => clearAllRideData(), 100);
    } catch (error) {
      console.error("Error navigating to ride cancellation:", error);
    }
  }, [
    router,
    acceptedRide?.ride_id,
    requestedRideData?.ride_id,
    clearAllRideData,
  ]);

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

  const handleNewPendingRideForDriver = useCallback(
    async (newRideRequest: RideProps) => {
      try {
        console.log(
          "Processing new ride request for driver:",
          newRideRequest.ride_id
        );

        const { data: passengerProfile, error } = await supabaseClient
          ?.from("passengers")
          ?.select("*")
          ?.eq("id", newRideRequest?.passenger_id)
          ?.single();

        if (error) {
          console.error("Error fetching passenger data:", error);
          return;
        }

        if (passengerProfile) {
          setPendingRideRequests((previousRequests) => {
            // Check for duplicates
            const isDuplicate = previousRequests.some(
              (request) => request.ride_id === newRideRequest.ride_id
            );

            if (isDuplicate) {
              console.log("Duplicate ride request detected, skipping...");
              return previousRequests;
            }

            console.log("Adding new ride request to list");
            return [
              ...previousRequests,
              {
                ...newRideRequest,
                ...passengerProfile,
              },
            ];
          });
        }
      } catch (error) {
        console.error("Error processing new ride request:", error);
      }
    },
    [supabaseClient]
  );

  const handleAcceptedRideForPassenger = useCallback(
    async (acceptedRideData: RideProps) => {
      try {
        console.log(
          "Processing accepted ride for passenger:",
          acceptedRideData?.driver_id
        );

        const { data: driverProfile, error } = await supabaseClient
          ?.from("drivers")
          ?.select("*")
          ?.eq("id", acceptedRideData?.driver_id)
          ?.single();

        if (error) {
          console.error("Error fetching driver data:", error);
          return;
        }

        if (driverProfile) {
          console.log("Setting accepted ride with driver details");
          setAcceptedRide({
            ride_id: acceptedRideData?.ride_id,
            status: acceptedRideData?.status,
            pickup_address: acceptedRideData?.pickup_address,
            destination_address: acceptedRideData?.destination_address,
            distance: acceptedRideData?.distance,
            duration: acceptedRideData?.duration,
            name: driverProfile?.first_name,
            riderImg: driverProfile?.profile_image_url,
            ride_fare: acceptedRideData?.ride_fare,
            phone_number: driverProfile?.phone_number,
          });
        }
      } catch (error) {
        console.error("Error processing accepted ride:", error);
      }
    },
    [supabaseClient]
  );

  const removeRideRequestFromList = useCallback((rideIdToRemove: string) => {
    try {
      console.log("Removing ride request:", rideIdToRemove);

      setPendingRideRequests((previousRequests) =>
        previousRequests.filter(
          (rideRequest) => rideRequest.ride_id !== rideIdToRemove
        )
      );

      console.log("Ride request removed successfully");
    } catch (error) {
      console.error("Error removing ride request:", error);
    }
  }, []);

  const keepOnlySelectedRideRequest = useCallback((selectedRideId: string) => {
    try {
      console.log("Keeping only selected ride request:", selectedRideId);

      setPendingRideRequests((previousRequests) =>
        previousRequests.filter(
          (rideRequest) => rideRequest.ride_id === selectedRideId
        )
      );

      console.log("Other ride requests removed successfully");
    } catch (error) {
      console.error("Error filtering ride requests:", error);
    }
  }, []);

  // Real-time subscriptions for ride updates
  useEffect(() => {
    let channel;
    if (userData?.user_type === "driver") {
      channel = supabaseClient?.channel("public:rides").on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rides",
          filter: `status=eq.pending`,
        },
        (payload) => {
          console.log("new driver ride", payload?.new);
          handleNewPendingRideForDriver(payload.new as RideProps);
        }
      );
      if (acceptedRide?.ride_id) {
        channel = channel.on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "rides",
            filter: `ride_id=eq.${acceptedRide.ride_id}`,
          },
          (payload) => {
            console.log("ride update", payload?.new);

            if (payload.new.status === "cancelled") {
              handleRideCancelled();
            }
          }
        );
      }
      channel?.subscribe();
    } else {
      channel = supabaseClient
        ?.channel("public:rides")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "rides",
            filter: `ride_id=eq.${requestedRideData?.ride_id}`,
          },
          (payload) => {
            if (
              payload.eventType === "UPDATE" &&
              payload?.new?.status === "accepted"
            ) {
              console.log("new passengers ride", payload?.new);
              handleAcceptedRideForPassenger(payload.new as RideProps);
            } else if (
              payload.eventType === "UPDATE" &&
              payload?.new?.status === "in_progress"
            ) {
              setAcceptedRide((prev) => ({ ...prev, status: "in_progress" }));
            } else if (
              payload.eventType === "UPDATE" &&
              payload?.new?.status === "completed"
            ) {
              handleRideCompleted();
            }
          }
        )
        .subscribe();
    }

    return () => {
      supabaseClient.removeChannel(channel); // cleanup on unmount
    };
  }, [
    userData?.user_type,
    requestedRideData?.ride_id,
    acceptedRide?.ride_id,
    supabaseClient,
    handleNewPendingRideForDriver,
    handleAcceptedRideForPassenger,
    handleRideCancelled,
    handleRideCompleted,
  ]);

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

      {/* Menu Button and Request List*/}
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

        {/* Driver ride Request Data  */}
        {userData?.user_type === "driver" && (
          <Animated.FlatList
            itemLayoutAnimation={SequencedTransition}
            style={{
              maxHeight:
                // screenHeight && screenHeight
                // ? Math.max(
                //     screenHeight -
                //       insets.top -
                //       insets.bottom -
                //       (contentHeight + verticalScale(40)),
                //     verticalScale(500)
                //   )
                // : verticalScale(500),
                verticalScale(400),
            }}
            data={pendingRideRequests}
            keyExtractor={(item, index) =>
              `ride-${item.ride_id}` || `fallback-${index}`
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
                duration: pendingRideRequestsItem?.duration,
                name: pendingRideRequestsItem?.full_name,
                passengerImg: pendingRideRequestsItem?.profile_image_url,
                ride_fare: pendingRideRequestsItem?.ride_fare,
                phone_number: pendingRideRequestsItem?.phone_number,
              };
              return (
                <RideRequestCard
                  removeCardFromRequestedRides={removeRideRequestFromList}
                  removeOtherFromRequestedRides={keepOnlySelectedRideRequest}
                  rideRequestData={rideRequestData}
                  setAcceptedRide={setAcceptedRide}
                  clearAllRideData={clearAllRideData}
                />
              );
            }}
          />
        )}
        {/* passenger accepted ride Data  */}

        {userData?.user_type === "passenger" && acceptedRide && (
          <View style={{ flex: 1 }}>
            <PassengerAcceptedCard acceptedRideData={acceptedRide} />
          </View>
        )}
      </View>

      {/* BottomSheet */}
      {userData?.user_type === "passenger" &&
        (!hasSelectedRoute ? (
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
                      color={
                        acceptedRide?.status === "in_progress"
                          ? COLORS?.success
                          : acceptedRide?.status === "accepted"
                          ? COLORS?.info
                          : COLORS?.warning
                      }
                      size={moderateScale(30)}
                    />
                  </View>
                  <Typo
                    variant="body"
                    size={moderateScale(16)}
                    color={theme.text.primary}>
                    {acceptedRide?.status === "in_progress"
                      ? t("ride.status.inProgress")
                      : acceptedRide?.status === "accepted"
                      ? t("ride.status.driverOnTheWay")
                      : isRideRequested
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
                  </>
                )}
              </View>
            </View>
          )
        ))}
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
