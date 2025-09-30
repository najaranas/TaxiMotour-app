import { View, StyleSheet } from "react-native";
import { PassengerAcceptedCardProps } from "@/types/Types";
import UserProfileImage from "../common/UserProfileImage";
import Typo from "../common/Typo";
import { useTheme } from "@/contexts/ThemeContext";
import THEME, { COLORS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { formatDistance, formatDuration, formatFare } from "@/utils/rideUtils";
import { useTranslation } from "react-i18next";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { LocateFixed, MapPin } from "lucide-react-native";

export default function PassengerAcceptedCard({
  acceptedRideData,
}: PassengerAcceptedCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  console.log("Accepted ride driver name:", acceptedRideData?.name);

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
          {t("passengerCard.rideFare")}
        </Typo>
      </View>

      {/* Driver Information Row */}
      <View style={styles.driverInfoRow}>
        {/* Left: Profile + Driver Details */}
        <View style={styles.driverSection}>
          <View style={styles.profileImageContainer}>
            <UserProfileImage
              hasImage={!!acceptedRideData?.riderImg}
              imageUrl={acceptedRideData?.riderImg}
              editable={false}
              showEditIcon={false}
              size={moderateScale(50)}
            />
          </View>

          <View style={styles.driverDetailsContainer}>
            {acceptedRideData?.name && (
              <Typo variant="body" lineBreakMode="middle">
                {acceptedRideData?.name}
              </Typo>
            )}
            {acceptedRideData?.phone_number && (
              <Typo variant="body" lineBreakMode="head">
                {`+216 ${acceptedRideData?.phone_number}`}
              </Typo>
            )}
            {acceptedRideData?.moto_type && (
              <Typo variant="body" lineBreakMode="middle">
                {acceptedRideData?.moto_type}
              </Typo>
            )}
          </View>
        </View>

        {/* Right: Trip Details */}
        <View style={styles.tripDetailsSection}>
          <Typo variant="body">
            {formatDistance(acceptedRideData?.distance)}
          </Typo>
          <Typo variant="body">
            {formatDuration(acceptedRideData?.duration)}
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
            {acceptedRideData?.pickup_address}
          </Typo>
        </View>
        <View style={styles.addressRow}>
          <LocateFixed
            color={theme.text.secondary}
            strokeWidth={1.5}
            size={moderateScale(20)}
          />
          <Typo variant="body" style={styles.addressText}>
            {acceptedRideData?.destination_address}
          </Typo>
        </View>
      </View>

      {/* Ride Fare */}
      <Typo variant="h1" style={styles.fareAmount}>
        {formatFare(acceptedRideData?.ride_fare)}
      </Typo>
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
  driverInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  driverSection: {
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
  driverDetailsContainer: {
    flex: 1,
    gap: verticalScale(2),
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
    textAlign: "center",
    marginTop: verticalScale(8),
  },
});
