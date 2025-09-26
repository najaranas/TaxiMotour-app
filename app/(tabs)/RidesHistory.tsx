import { View, StyleSheet, RefreshControl, Image } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Typo from "@/components/common/Typo";
import { Bell } from "lucide-react-native";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { useTheme } from "@/contexts/ThemeContext";
import RideCard from "@/components/Ride/RideCard";
import { useEffect, useState, useCallback } from "react";
import { useSession, useUser } from "@clerk/clerk-expo";
import { getSupabaseClient } from "@/services/supabaseClient";
import SkeletonPlaceholder from "@/components/common/SkeletonPlaceholder";
import { PulseIndicator } from "react-native-indicators";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { RideProps } from "@/types/Types";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useUserData } from "@/store/userStore";

export default function RidesHistoryScreen() {
  const { theme } = useTheme();
  const { session } = useSession();
  const { user } = useUser();
  const router = useRouter();
  const { t } = useTranslation();
  const { userData } = useUserData();
  const [completedRides, setCompletedRides] = useState<RideProps[]>([]);
  const [currentActiveRide, setCurrentActiveRide] = useState<RideProps | null>(
    null
  );
  const [isLoadingRides, setIsLoadingRides] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const supabaseClient = getSupabaseClient(session);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchRidesData();
    setIsRefreshing(false);
  };

  console.log("completedRides", completedRides);

  const fetchRidesData = async () => {
    setIsLoadingRides(true);
    try {
      const supabaseUserId = await supabaseClient
        .from(userData?.user_type + "s")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      console.log(user?.id, "user?.id");
      console.log("supadbaseUserId", supabaseUserId);

      const fetchRidesResponse = await supabaseClient
        .from("rides")
        .select("*")
        .eq(userData?.user_type + "_id", supabaseUserId?.data?.id);
      console.log("fetchRidesResponse", fetchRidesResponse?.data);
      setCompletedRides(
        fetchRidesResponse?.data?.filter(
          (ride: RideProps) => ride?.status === "completed"
        ) || []
      );
      setCurrentActiveRide(
        fetchRidesResponse?.data?.find(
          (ride: RideProps) => ride?.status === "in_progress"
        ) || null
      );
    } catch (error) {
      console.log("error feching rides data", error);
    } finally {
      setIsLoadingRides(false);
    }
  };

  useEffect(() => {
    fetchRidesData();
  }, []);

  const navigateToHome = () => {
    router.replace("/(tabs)/Home");
  };

  const renderskeletonContainer = () => (
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
      </View>

      {/* Past Rides Section */}
      <View style={styles.skeletonSection}>
        <SkeletonPlaceholder animationType="shimmer">
          <View style={styles.skeletonSectionTitle} />
        </SkeletonPlaceholder>

        {/* Multiple ride cards */}
        {[1, 2, 3, 4].map((index) => (
          <SkeletonPlaceholder key={index} animationType="shimmer">
            <View style={styles.skeletonRideCard}></View>
          </SkeletonPlaceholder>
        ))}
      </View>
    </View>
  );

  useEffect(() => {
    // Listen for new rides in real time
    const channel = supabaseClient
      .channel("public:rides")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rides",
          filter: "status=eq.in_progress",
        },
        (payload) => {
          setCurrentActiveRide(payload.new as RideProps);
          // setRides((prev) => [...prev, payload.new]); // auto update UI
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel); // cleanup on unmount
    };
  }, []);

  return (
    <ScreenWrapper
      scroll
      safeArea
      hasBottomTabs
      padding={horizontalScale(20)}
      contentContainerStyle={{
        paddingBlock: verticalScale(10),
        flexGrow: 1,
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          progressBackgroundColor={theme.gray.background}
          colors={[theme.text.primary]}
        />
      }
      showsVerticalScrollIndicator={false}>
      {isLoadingRides ? (
        <>{renderskeletonContainer()}</>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.headerSection}>
            <View style={styles.headerTextContainer}>
              <Typo variant="h3">{t("rides.title")}</Typo>
              <Typo variant="body" color={theme.text.secondary}>
                {t("rides.subtitle")}
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
          {completedRides.length > 0 || currentActiveRide ? (
            <>
              {/* Show Active Ride Section if exists */}
              {currentActiveRide && (
                <View style={styles.ridesSection}>
                  <View
                    style={{ flexDirection: "row", gap: horizontalScale(5) }}>
                    <View>
                      <PulseIndicator
                        color={COLORS.success}
                        size={moderateScale(30)}
                      />
                    </View>
                    <Typo size={moderateScale(20)} variant="h3">
                      {t("rides.activeRide")}
                    </Typo>
                  </View>
                  <RideCard ride={currentActiveRide} />
                </View>
              )}

              {/* Show Past Rides Section if exists */}

              <View style={styles.ridesSection}>
                <Typo size={moderateScale(20)} variant="h3">
                  {t("rides.pastRides")}
                </Typo>
                {completedRides.length > 0 ? (
                  completedRides.map((ride: RideProps, id: number) => {
                    return <RideCard key={id.toString()} ride={ride} />;
                  })
                ) : (
                  <Typo variant="body" color={theme.text.muted}>
                    {t("rides.completeFirstRide")}
                  </Typo>
                )}
              </View>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: verticalScale(10),
              }}>
              <Image
                source={require("../../assets/images/no_history.png")}
                style={styles.noHistoryImg}
              />
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomWidth: theme.borderWidth.thin,
                  borderBottomColor: theme.gray.border,
                  paddingBottom: verticalScale(20),
                  gap: verticalScale(5),
                }}>
                <Typo variant="h2" style={{ textAlign: "center" }}>
                  {t("rides.noRidesTitle")}
                </Typo>
                <Typo
                  variant="body"
                  color={theme.text.muted}
                  style={{ textAlign: "center" }}>
                  {t("rides.noRidesSubtitle")}
                </Typo>
              </View>
              <View
                style={{
                  paddingTop: verticalScale(20),
                  width: "100%",
                }}>
                <Button
                  onPress={navigateToHome}
                  indicatorStyle={{ color: COLORS.white }}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: COLORS.secondary,
                    },
                  ]}>
                  <Typo
                    size={moderateScale(17)}
                    fontFamily={FONTS.bold}
                    color={COLORS.white}>
                    {t("rides.takeARide")}
                  </Typo>
                </Button>
              </View>
            </View>
          )}
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
  noCompletedRidesMessage: {
    padding: verticalScale(20),
    alignItems: "center",
    gap: verticalScale(8),
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
  noHistoryImg: {
    height: verticalScale(150),
    aspectRatio: 1,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: horizontalScale(10),
    borderRadius: THEME.borderRadius.circle,
    minHeight: verticalScale(55),
  },
});
