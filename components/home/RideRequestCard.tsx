import { View, StyleSheet } from "react-native";
import { RideRequestCardProps } from "@/types/Types";
import UserProfileImage from "../common/UserProfileImage";
import Typo from "../common/Typo";
import { useTheme } from "@/contexts/ThemeContext";
import THEME, { COLORS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Button from "../common/Button";
import { formatDistance, formatDuration, formatFare } from "@/utils/rideUtils";
import { useTranslation } from "react-i18next";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { getSupabaseClient } from "@/services/supabaseClient";
import { LocateFixed, MapPin } from "lucide-react-native";
import { useUserData } from "@/store/userStore";
import { useState } from "react";
import { PulseIndicator } from "react-native-indicators";
import { useRouter } from "expo-router";

export default function RideRequestCard({
  rideRequestData,
  removeCardFromRequestedRides,
  removeOtherFromRequestedRides,
  setAcceptedRide,
  clearAllRideData,
}: RideRequestCardProps) {
  const { theme } = useTheme();
  const { userData } = useUserData();
  const { t } = useTranslation();
  const router = useRouter();
  const supabaseClient = getSupabaseClient();

  const [isAcceptingRide, setIsAcceptingRide] = useState<boolean>(false);
  const [currentRideStatus, setCurrentRideStatus] = useState<
    "accepted" | "in_progress" | "completed" | null
  >(null);

  const handleAcceptRideRequest = async () => {
    if (!rideRequestData?.ride_id) {
      console.error("No ride ID found");
      return;
    }

    try {
      setIsAcceptingRide(true);
      console.log("Accepting ride request:", rideRequestData.ride_id);

      const { error } = await supabaseClient
        .from("rides")
        .update({ status: "accepted", driver_id: userData?.id })
        .eq("ride_id", rideRequestData.ride_id);

      if (error) {
        throw error;
      }

      console.log("Ride request accepted successfully");
      removeOtherFromRequestedRides?.(rideRequestData.ride_id);
      setCurrentRideStatus("accepted");
      setAcceptedRide?.(rideRequestData);
    } catch (error) {
      console.error("Error accepting ride request:", error);
    } finally {
      setIsAcceptingRide(false);
    }
  };

  const handleDeclineRideRequest = () => {
    console.log("Declining ride request:", rideRequestData?.ride_id);
    removeRideRequestFromList();
  };

  const handleStartRideProgress = async () => {
    if (!rideRequestData?.ride_id) {
      console.error("No ride ID found");
      return;
    }

    try {
      console.log("Starting ride progress for:", rideRequestData.ride_id);

      const { error } = await supabaseClient
        .from("rides")
        .update({ status: "in_progress" })
        .eq("ride_id", rideRequestData.ride_id);

      if (error) {
        throw error;
      }

      setCurrentRideStatus("in_progress");
      console.log("Ride status updated to in_progress");
    } catch (error) {
      console.error("Error updating ride to in_progress:", error);
    }
  };

  const handleCompleteRide = async () => {
    if (!rideRequestData?.ride_id) {
      console.error("No ride ID found");
      return;
    }

    try {
      console.log("Completing ride:", rideRequestData.ride_id);

      const { error } = await supabaseClient
        .from("rides")
        .update({ status: "completed" })
        .eq("ride_id", rideRequestData.ride_id);

      if (error) {
        throw error;
      }

      setCurrentRideStatus("completed");
      console.log("Ride completed successfully");

      // Navigate to ride result screen
      router.push({
        pathname: "/(rides)/RideResult",
        params: {
          status: "completed",
          rideId: rideRequestData.ride_id,
        },
      });

      // Clear ride data after a short delay
      setTimeout(() => {
        clearAllRideData?.();
      }, 100);
    } catch (error) {
      console.error("Error completing ride:", error);
    }
  };

  const removeRideRequestFromList = () => {
    if (rideRequestData?.ride_id) {
      console.log("Removing ride request from list:", rideRequestData.ride_id);
      removeCardFromRequestedRides?.(rideRequestData.ride_id);
    }
  };

  return (
    <Animated.View
      entering={LightSpeedInRight}
      style={[
        styles.card,
        {
          backgroundColor: theme.background,
          borderRadius: theme.borderRadius.medium,
          shadowRadius: 0,
        },
      ]}>
      <View
        style={[
          styles.rideFareBadge,
          { borderRadius: theme.borderRadius.medium },
        ]}>
        <Typo variant="caption" color={COLORS.black}>
          {t("rideRequestCard.rideFare")}
        </Typo>
      </View>

      {/* Passenger Information Row */}
      <View style={styles.passengerInfoRow}>
        {/* Left: Profile + Passenger Details */}
        <View style={styles.passengerSection}>
          <View style={styles.profileImageContainer}>
            <UserProfileImage
              hasImage={!!rideRequestData?.passengerImg}
              imageUrl={rideRequestData?.passengerImg}
              editable={false}
              showEditIcon={false}
              size={moderateScale(50)}
            />
          </View>

          <View style={styles.passengerDetailsContainer}>
            <View style={styles.nameRow}>
              <Typo variant="body">{rideRequestData?.name}</Typo>
            </View>
            {rideRequestData?.phone_number && (
              <Typo variant="body">
                {`+216 ${rideRequestData?.phone_number}`}
              </Typo>
            )}
          </View>
        </View>

        {/* Right: Trip Details */}
        <View style={styles.tripDetailsSection}>
          <Typo variant="body">
            {formatDistance(rideRequestData?.distance)}
          </Typo>
          <Typo variant="body">
            {formatDuration(rideRequestData?.duration)}
          </Typo>
        </View>
      </View>

      {/* Trip Route Information */}
      <View style={styles.routeContainer}>
        <View style={styles.addressRow}>
          <MapPin
            color={theme.text.secondary}
            strokeWidth={1.5}
            size={moderateScale(20)}
          />
          <Typo variant="body" style={styles.addressText}>
            {rideRequestData?.pickup_address}
          </Typo>
        </View>
        <View style={styles.addressRow}>
          <LocateFixed
            color={theme.text.secondary}
            strokeWidth={1.5}
            size={moderateScale(20)}
          />
          <Typo variant="body" style={styles.addressText}>
            {rideRequestData?.destination_address}
          </Typo>
        </View>
      </View>

      {/* Ride Fare */}
      <Typo variant="h1" style={styles.fareAmount}>
        {formatFare(rideRequestData?.ride_fare)}
      </Typo>

      {/* Ride Status Indicator */}
      {currentRideStatus && (
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator}>
            <PulseIndicator
              color={
                currentRideStatus === "accepted"
                  ? COLORS?.info
                  : currentRideStatus === "in_progress"
                  ? COLORS?.success
                  : COLORS?.warning
              }
              size={moderateScale(20)}
            />
          </View>
          <Typo
            variant="body"
            size={moderateScale(16)}
            color={theme.text.primary}>
            {currentRideStatus === "accepted"
              ? t("rideRequestCard.status.onTheWay")
              : currentRideStatus === "in_progress"
              ? t("rideRequestCard.status.inProgress")
              : undefined}
          </Typo>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtonsRow}>
        {currentRideStatus === "accepted" ||
        currentRideStatus === "in_progress" ? (
          <Button
            onPress={
              currentRideStatus === "accepted"
                ? handleStartRideProgress
                : handleCompleteRide
            }
            style={[
              styles.primaryActionButton,
              {
                borderRadius: theme.borderRadius.medium,
                backgroundColor: COLORS.secondary,
              },
            ]}>
            <Typo variant="body" color={COLORS.white}>
              {currentRideStatus === "accepted"
                ? t("rideRequestCard.actions.startRide")
                : t("rideRequestCard.actions.completeRide")}
            </Typo>
          </Button>
        ) : (
          <>
            <Button
              onPress={handleDeclineRideRequest}
              style={[
                styles.secondaryActionButton,
                {
                  borderRadius: theme.borderRadius.medium,
                  backgroundColor: theme.button.secondary,
                },
              ]}>
              <Typo variant="body" color={COLORS.white}>
                {t("rideRequestCard.actions.decline")}
              </Typo>
            </Button>
            <Button
              onPress={handleAcceptRideRequest}
              indicatorStyle={{ size: moderateScale(20) }}
              loading={isAcceptingRide}
              style={[
                styles.primaryActionButton,
                {
                  borderRadius: theme.borderRadius.medium,
                  backgroundColor: "#D7FF3E",
                },
              ]}>
              <Typo variant="body" color={COLORS.black}>
                {t("rideRequestCard.actions.accept")}
              </Typo>
            </Button>
          </>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: horizontalScale(16),
    gap: verticalScale(12),
  },
  rideFareBadge: {
    backgroundColor: "#D7FF3E",
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    alignSelf: "flex-start",
  },
  passengerInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  passengerSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: horizontalScale(12),
  },
  profileImageContainer: {
    borderWidth: THEME.borderWidth.regular,
    borderColor: "#7C3AED",
    borderRadius: THEME.borderRadius.circle,
    padding: horizontalScale(2),
  },
  passengerDetailsContainer: {
    flex: 1,
    gap: verticalScale(2),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripDetailsSection: {
    alignItems: "flex-end",
    gap: verticalScale(2),
  },
  routeContainer: {
    gap: verticalScale(8),
  },
  addressRow: {
    flexDirection: "row",
    gap: horizontalScale(8),
    alignItems: "center",
  },
  addressText: {
    flex: 1,
    flexShrink: 1,
  },
  fareAmount: {
    marginVertical: verticalScale(8),
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
    paddingVertical: verticalScale(8),
  },
  statusIndicator: {
    width: moderateScale(24),
    height: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: horizontalScale(8),
  },
  primaryActionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(12),
  },
  secondaryActionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(12),
  },
});
