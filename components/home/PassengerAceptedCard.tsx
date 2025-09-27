import { View, StyleSheet } from "react-native";
import { PassengerAceptedCardProps } from "@/types/Types";
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

export default function PassengerAceptedCard({
  acceptedRideData,
}: PassengerAceptedCardProps) {
  const { theme } = useTheme();
  const { userData } = useUserData();
  console.log("acceptedRideData?.name", acceptedRideData?.name);

  const handleDecline = () => {
    console.log("clicked");
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
              hasImage={!!acceptedRideData?.riderImg}
              imageUrl={acceptedRideData?.riderImg}
              editable={false}
              showEditIcon={false}
              size={moderateScale(50)}
            />
          </View>

          <View style={styles.infoContainer}>
            {acceptedRideData?.name && (
              <Typo variant="body" lineBreakMode="middle">
                {acceptedRideData?.name}
              </Typo>
            )}
            {acceptedRideData?.phone_number && (
              <Typo
                variant="body"
                lineBreakMode="head">{`+216 ${acceptedRideData?.phone_number}`}</Typo>
            )}
            {acceptedRideData?.moto_type && (
              <Typo variant="body" lineBreakMode="middle">
                {acceptedRideData?.moto_type}
              </Typo>
            )}
          </View>
        </View>

        {/* Right: Time + Distance */}
        <View style={styles.rightSection}>
          <Typo variant="body">
            {formatDistance(acceptedRideData?.distance)}
          </Typo>
          <Typo variant="body">
            {formatDuration(acceptedRideData?.duration)}
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
            {acceptedRideData?.pickup_address}
          </Typo>
        </View>
        <View style={styles.addressRow}>
          <LocateFixed
            color={theme.text.secondary}
            strokeWidth={1.5}
            size={moderateScale(20)}
          />

          <Typo variant="body" style={{ flexShrink: 1 }}>
            {acceptedRideData?.destination_address}
          </Typo>
        </View>
      </View>

      {/* Price */}
      <Typo variant="h1">{formatFare(acceptedRideData?.ride_fare)}</Typo>

      {/* Action buttons */}
      <View style={styles.buttonsRow}>
        <Button
          onPress={handleDecline}
          style={[
            styles.actionButton,
            {
              borderRadius: theme.borderRadius.medium,
              backgroundColor: COLORS.danger,
            },
          ]}>
          <Typo variant="body" color={COLORS.black}>
            Cancel Ride
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
