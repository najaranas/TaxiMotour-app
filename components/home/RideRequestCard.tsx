import { View, StyleSheet } from "react-native";
import { RideRequestCardProps } from "@/types/Types";
import UserProfileImage from "../common/UserProfileImage";
import Typo from "../common/Typo";
import { useTheme } from "@/contexts/ThemeContext";
import THEME, { COLORS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Button from "../common/Button";
import { formatDistance, formatDuration, formatFare } from "@/utils/rideUtils";
import { t } from "i18next";
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
}: RideRequestCardProps) {
  const { theme } = useTheme();
  const { userData } = useUserData();
  const [isAceptLoading, setIsAceptLoading] = useState<boolean>(false);
  const [rideStatus, setRideStatus] = useState<
    "accepted" | "in_progress" | "completed" | null
  >(null);
  const supabaseClient = getSupabaseClient();
  const router = useRouter();

  const handleAccept = async () => {
    try {
      setIsAceptLoading(true);
      const response = await supabaseClient
        .from("rides")
        .update({ status: "accepted", driver_id: userData?.id })
        .eq("ride_id", rideRequestData?.ride_id);

      console.log("ride resuest response", response);
      if (rideRequestData?.ride_id) {
        removeOtherFromRequestedRides?.(rideRequestData.ride_id);
        setRideStatus("accepted");
      }
    } catch (error) {
      console.log("error updating ride request", error);
    } finally {
      setIsAceptLoading(false);
    }
  };

  const handleDecline = () => {
    console.log("clicked");
    removeCardFromList();
  };

  const handleInProgress = async () => {
    try {
      await supabaseClient
        .from("rides")
        .update({
          status: "in_progress",
        })
        .eq("ride_id", rideRequestData?.ride_id);
      setRideStatus("in_progress");
    } catch (error) {
      console.log("error updating ride request", error);
    }
  };

  const handleCompleted = async () => {
    try {
      // await supabaseClient
      //   .from("rides")
      //   .update({
      //     status: "completed",
      //   })
      //   .eq("ride_id", rideRequestData?.ride_id);
      setRideStatus(null);
      router?.replace("/(rides)/RideCompleted");
      // RideCompleted
    } catch (error) {
      console.log("error updating ride request", error);
    }
  };

  const removeCardFromList = () => {
    if (rideRequestData?.ride_id) {
      removeCardFromRequestedRides?.(rideRequestData?.ride_id);
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
        style={[styles.yourFare, { borderRadius: theme.borderRadius.medium }]}>
        <Typo variant="caption" color={COLORS.black}>
          {t("rides.rideFare")}
        </Typo>
      </View>
      {/* Main content row */}
      <View style={styles.headerRow}>
        {/* Left: Profile + Info */}
        <View style={styles.leftSection}>
          <View style={styles.avatarContainer}>
            <UserProfileImage
              hasImage={!!rideRequestData?.passengerImg}
              imageUrl={rideRequestData?.passengerImg}
              editable={false}
              showEditIcon={false}
              size={moderateScale(50)}
            />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Typo variant="body">{rideRequestData?.name}</Typo>
            </View>
            {rideRequestData?.phone_number && (
              <Typo variant="body">{`+216 ${rideRequestData?.phone_number}`}</Typo>
            )}
          </View>
        </View>

        {/* Right: Time + Distance */}
        <View style={styles.rightSection}>
          <Typo variant="body">
            {formatDistance(rideRequestData?.distance)}
          </Typo>
          <Typo variant="body">
            {formatDuration(rideRequestData?.duration)}
          </Typo>
        </View>
      </View>

      <View style={{ gap: verticalScale(5) }}>
        <View style={styles.addressRow}>
          {
            <MapPin
              color={theme.text.secondary}
              strokeWidth={1.5}
              size={moderateScale(20)}
            />
          }
          <Typo variant="body" style={{ flexShrink: 1 }}>
            {rideRequestData?.pickup_address}
          </Typo>
        </View>
        <View style={styles.addressRow}>
          {
            <LocateFixed
              color={theme.text.secondary}
              strokeWidth={1.5}
              size={moderateScale(20)}
            />
          }

          <Typo variant="body" style={{ flexShrink: 1 }}>
            {rideRequestData?.destination_address}
          </Typo>
        </View>
      </View>

      {/* Price */}
      <Typo variant="h1">{formatFare(rideRequestData?.ride_fare)}</Typo>

      {/* ride Status */}
      {rideStatus && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(5),
          }}>
          <View>
            <PulseIndicator
              color={
                rideStatus === "accepted"
                  ? COLORS?.info
                  : rideStatus === "in_progress"
                  ? COLORS?.success
                  : COLORS?.warning
              }
            />
          </View>
          <Typo
            variant="body"
            size={moderateScale(16)}
            color={theme.text.primary}>
            {rideStatus === "accepted"
              ? "on  the way to the client"
              : rideStatus === "in_progress"
              ? "ride in prgoress"
              : undefined}
          </Typo>
        </View>
      )}
      <View style={styles.buttonsRow}>
        {rideStatus === "accepted" || rideStatus === "in_progress" ? (
          <Button
            onPress={
              rideStatus === "accepted" ? handleInProgress : handleCompleted
            }
            style={[
              styles.actionButton,
              {
                borderRadius: theme.borderRadius.medium,
                backgroundColor: "#F1F1F1",
              },
            ]}>
            <Typo variant="body" color={COLORS.black}>
              {rideStatus === "accepted"
                ? "Make ride in Progress"
                : "Make ride Completed"}
            </Typo>
          </Button>
        ) : (
          <>
            <Button
              onPress={handleDecline}
              style={[
                styles.actionButton,
                {
                  borderRadius: theme.borderRadius.medium,
                  backgroundColor: "#F1F1F1",
                },
              ]}>
              <Typo variant="body" color={COLORS.black}>
                Decline
              </Typo>
            </Button>
            <Button
              onPress={handleAccept}
              indicatorStyle={{ size: moderateScale(20) }}
              loading={isAceptLoading}
              style={[
                styles.actionButton,
                {
                  borderRadius: theme.borderRadius.medium,
                  backgroundColor: "#D7FF3E",
                },
              ]}>
              <Typo variant="body" color={COLORS.black}>
                Accept
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
    gap: horizontalScale(8),
  },
  yourFare: {
    backgroundColor: "#D7FF3E",
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    alignSelf: "flex-start",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: horizontalScale(12),
  },
  avatarContainer: {
    borderWidth: THEME.borderWidth.regular,
    borderColor: "#7C3AED",
    borderRadius: THEME.borderRadius.circle,
    padding: horizontalScale(2),
  },
  infoContainer: {
    flex: 1,
    gap: horizontalScale(2),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rightSection: {
    alignItems: "flex-end",
    gap: horizontalScale(2),
  },

  addressRow: {
    flexDirection: "row",
    gap: horizontalScale(5),
    alignItems: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: horizontalScale(5),
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBlock: verticalScale(7),
  },
});
