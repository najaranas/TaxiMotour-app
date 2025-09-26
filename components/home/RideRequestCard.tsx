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

export default function RideRequestCard({
  rideRequestData,
  removeCardFromRequestedRides,
}: RideRequestCardProps) {
  const { theme } = useTheme();

  const supabaseClient = getSupabaseClient();

  const handleAccept = async () => {
    try {
      const { error } = await supabaseClient
        .from("rides")
        .update({ status: "accepted" })
        .eq("id", rideRequestData?.ride_id)
        .single();

      if (!error) {
        removeCardFromList();
      }
    } catch (error) {
      console.log("error updating ride request", error);
    }
  };

  const handleDecline = () => {
    console.log("clicked");
    removeCardFromList();
  };

  const removeCardFromList = () => {
    if (removeCardFromRequestedRides && rideRequestData?.ride_id) {
      removeCardFromRequestedRides(rideRequestData.ride_id);
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
          <Typo variant="body">{rideRequestData?.pickup_address}</Typo>
        </View>
        <View style={styles.addressRow}>
          {
            <LocateFixed
              color={theme.text.secondary}
              strokeWidth={1.5}
              size={moderateScale(20)}
            />
          }

          <Typo variant="body">{rideRequestData?.destination_address}</Typo>
        </View>
      </View>

      {/* Price */}
      <Typo variant="h1">{formatFare(rideRequestData?.ride_fare)}</Typo>

      {/* Action buttons */}
      <View style={styles.buttonsRow}>
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
