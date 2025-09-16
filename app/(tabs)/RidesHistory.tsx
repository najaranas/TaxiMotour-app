import { View, StyleSheet, RefreshControl } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Typo from "@/components/common/Typo";
import { Bell } from "lucide-react-native";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { useTheme } from "@/contexts/ThemeContext";
import RideCard from "@/components/Ride/RideCard";
import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/clerk-expo";
import { getSupabaseClient } from "@/services/supabaseClient";
import SkeletonPlaceholder from "@/components/common/SkeletonPlaceholder";
import { PulseIndicator } from "react-native-indicators";
import { COLORS } from "@/constants/theme";

export default function RidesHistoryScreen() {
  const { theme } = useTheme();
  const { session } = useSession();
  const { user } = useUser();

  const [ridesData, setRidesData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  //  passenger_id: "90a183c9-5fc8-420e-89f6-eb53a1248a48",
  //     driver_id: "25a26619-3854-47e3-905e-df0968d97e40",
  //     pickup_address: "Délégation Bab Souika",
  //     pickup_lat: "36.805205",
  //     pickup_lon: "10.167988",
  //     destination_address: "Bab Saadoun",
  //     destination_lat: "36.806302",
  //     destination_lon: "10.162364",
  //     ride_fare: "5",
  //     distance: "3",
  //     duration: "3000",
  //     status: "completed",
  //     feedback: "very good ",
  //     payment: "cash",

  const supabase = getSupabaseClient(session);

  const activeRide = {
    id: 1,
    pickupAddress: "456 Elm Street, Springfieldsdsdsd",
    destinationAddress: "739 Main Street, Springfield",
    payment: "TND12",
    distance: "12Km",
  };

  useEffect(() => {
    fetchRidesData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRidesData();
    setRefreshing(false);
  };

  console.log("ridesData", ridesData);

  const fetchRidesData = async () => {
    setIsLoading(true);
    try {
      const supabaseUserId = await supabase
        .from("drivers")
        .select("id")
        .eq("user_id", "user_32huNQZutbWpXK7QoOTutC2onnN")
        .single();
      console.log(user?.id, "user?.id");
      console.log("supadbaseUserId", supabaseUserId);

      const response = await supabase
        .from("rides")
        .select("*")
        .eq("passenger_id", supabaseUserId.data?.id);

      setRidesData(response);
    } catch (error) {
      console.log("error feching rides data", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper
      scroll
      safeArea
      hasBottomTabs
      padding={horizontalScale(20)}
      contentContainerStyle={{
        paddingBlock: verticalScale(10),
        flex: isLoading ? 1 : 0,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressBackgroundColor={theme.gray.background}
          colors={[theme.text.primary]}
        />
      }
      showsVerticalScrollIndicator={false}>
      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {/* Header Section Skeleton */}
          <View style={styles.skeletonHeaderSection}>
            <View style={styles.skeletonHeaderText}>
              <SkeletonPlaceholder animationType="shimmer">
                <View style={styles.skeletonTitle} />
              </SkeletonPlaceholder>
              <SkeletonPlaceholder animationType="shimmer">
                <View style={styles.skeletonSubtitle} />
              </SkeletonPlaceholder>
            </View>
            <SkeletonPlaceholder animationType="shimmer">
              <View style={styles.skeletonIcon} />
            </SkeletonPlaceholder>
          </View>

          {/* Active Rides Section */}
          <View style={styles.skeletonSection}>
            <SkeletonPlaceholder animationType="shimmer">
              <View style={styles.skeletonSectionTitle} />
            </SkeletonPlaceholder>

            <SkeletonPlaceholder animationType="shimmer">
              <View style={styles.skeletonRideCard}></View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder animationType="shimmer">
              <View style={styles.skeletonRideCard}></View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder animationType="shimmer">
              <View style={styles.skeletonRideCard}></View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder animationType="shimmer">
              <View style={styles.skeletonRideCard}></View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder animationType="shimmer">
              <View style={styles.skeletonRideCard}></View>
            </SkeletonPlaceholder>
          </View>

          {/* Past Rides Section */}
          <View style={styles.skeletonSection}>
            <SkeletonPlaceholder animationType="shimmer">
              <View
                style={[
                  styles.skeletonSectionTitle,
                  { backgroundColor: "#E1E9EE" },
                ]}
              />
            </SkeletonPlaceholder>

            {/* Multiple ride cards */}
            {[1, 2, 3, 4].map((index) => (
              <SkeletonPlaceholder key={index} animationType="shimmer">
                <View
                  style={[
                    styles.skeletonRideCard,
                    { backgroundColor: "#E1E9EE" },
                  ]}>
                  <View style={styles.skeletonCardContent}>
                    <View
                      style={[
                        styles.skeletonCardIcon,
                        { backgroundColor: "#D0D7DD" },
                      ]}
                    />
                    <View style={styles.skeletonCardText}>
                      <View
                        style={[
                          styles.skeletonCardMainText,
                          { backgroundColor: "#D0D7DD" },
                        ]}
                      />
                      <View
                        style={[
                          styles.skeletonCardSecondaryText,
                          { backgroundColor: "#D0D7DD" },
                        ]}
                      />
                    </View>
                    <View style={styles.skeletonCardRight}>
                      <View
                        style={[
                          styles.skeletonPrice,
                          { backgroundColor: "#D0D7DD" },
                        ]}
                      />
                      <View
                        style={[
                          styles.skeletonDistance,
                          { backgroundColor: "#D0D7DD" },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </SkeletonPlaceholder>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.headerSection}>
            <View style={styles.headerTextContainer}>
              <Typo variant="h3">Rides History</Typo>
              <Typo variant="body" color={theme.text.secondary}>
                Showing all your rides
              </Typo>
            </View>
            <View>
              <Bell
                color={theme.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
            </View>
          </View>

          <View style={styles.ridesSection}>
            <View style={{ flexDirection: "row", gap: horizontalScale(5) }}>
              <View>
                <PulseIndicator
                  color={COLORS.success}
                  size={moderateScale(30)}
                />
              </View>
              <Typo size={moderateScale(20)} variant="h3">
                Active rides
              </Typo>
            </View>

            <RideCard ride={activeRide} />
          </View>
          <View style={styles.ridesSection}>
            <Typo size={moderateScale(20)} variant="h3">
              Past rides
            </Typo>

            <RideCard ride={activeRide} />
            <RideCard ride={activeRide} />
            <RideCard ride={activeRide} />
            <RideCard ride={activeRide} />
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    gap: verticalScale(30),
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  headerTextContainer: {
    gap: verticalScale(5),
  },
  ridesSection: {
    gap: verticalScale(10),
  },
  // Skeleton styles
  skeletonContainer: {
    flex: 1,
    gap: verticalScale(30),
  },
  skeletonHeaderSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  skeletonHeaderText: {
    gap: verticalScale(5),
    flex: 1,
  },
  skeletonTitle: {
    height: verticalScale(28),
    width: "60%",
    borderRadius: moderateScale(6),
  },
  skeletonSubtitle: {
    height: verticalScale(18),
    width: "80%",
    borderRadius: moderateScale(4),
  },
  skeletonIcon: {
    width: moderateScale(25),
    height: moderateScale(25),
    borderRadius: moderateScale(12.5),
  },
  skeletonSection: {
    gap: verticalScale(10),
  },
  skeletonSectionTitle: {
    height: verticalScale(24),
    width: "40%",
    borderRadius: moderateScale(6),
  },
  skeletonRideCard: {
    height: verticalScale(120),
    borderRadius: moderateScale(12),
    padding: horizontalScale(15),
  },
  skeletonCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(12),
    flex: 1,
  },
  skeletonCardIcon: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(8),
  },
  skeletonCardText: {
    flex: 1,
    gap: verticalScale(8),
  },
  skeletonCardMainText: {
    height: verticalScale(16),
    width: "85%",
    borderRadius: moderateScale(4),
  },
  skeletonCardSecondaryText: {
    height: verticalScale(14),
    width: "65%",
    borderRadius: moderateScale(4),
  },
  skeletonCardRight: {
    gap: verticalScale(6),
    alignItems: "flex-end",
  },
  skeletonPrice: {
    height: verticalScale(18),
    width: horizontalScale(50),
    borderRadius: moderateScale(4),
  },
  skeletonDistance: {
    height: verticalScale(14),
    width: horizontalScale(35),
    borderRadius: moderateScale(4),
  },
});
