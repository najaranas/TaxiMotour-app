import { StyleSheet, View } from "react-native";
import { useMemo } from "react";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { LocateFixed, MapPin } from "lucide-react-native";
import Typo from "../common/Typo";
import { useTheme } from "@/contexts/ThemeContext";
import { RideCardProps } from "@/types/Types";
import { useRouter } from "expo-router";
import Button from "../common/Button";
import { useTranslation } from "react-i18next";
import { formatDistance, formatFare } from "@/utils/rideUtils";

export default function RideCard({
  ride,
  viewOnly,
  hideExtraDetails = false,
}: RideCardProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const dynamicStyles = useMemo(
    () => ({
      rideCard: {
        ...styles.rideCard,
        borderRadius: theme.borderRadius.large,
        borderWidth: theme.borderWidth.thin,
        borderColor: theme.gray.border,
        backgroundColor: theme.background,
      },
      locationIcon: {
        ...styles.locationIcon,
        backgroundColor: theme.button.primary + "58",
        borderRadius: theme.borderRadius.circle,
      },
      dashedLine: {
        ...styles.dashedLine,
        borderColor: theme.gray.border,
      },
      paymentBadge: {
        ...styles.paymentBadge,
        borderRadius: theme.borderRadius.small,
        backgroundColor: theme.button.primary + "58",
      },
    }),
    [theme]
  );
  console.log("ride", ride.distance);
  const cardPressHandler = () => {
    router.navigate({
      pathname: "/(rides)/[rideId]",
      params: {
        rideId: ride?.id?.toString() ?? "",
        ride: JSON.stringify(ride),
      },
    });
  };

  const formattedDistance = formatDistance(ride?.distance);

  return (
    <Button
      onPress={!viewOnly ? cardPressHandler : undefined}
      activeOpacity={viewOnly ? 1 : 0.5}>
      <View style={dynamicStyles.rideCard}>
        <View style={styles.locationInfoColumn}>
          {/* Pickup Icon */}
          <View style={dynamicStyles.locationIcon}>
            <MapPin
              color={theme.button.primary}
              strokeWidth={1.5}
              size={moderateScale(17)}
            />
          </View>

          {/* Dashed line */}
          <View style={dynamicStyles.dashedLine} />

          {/* Destination Icon */}
          <View style={dynamicStyles.locationIcon}>
            <LocateFixed
              color={theme.button.primary}
              strokeWidth={1.5}
              size={moderateScale(17)}
            />
          </View>
        </View>

        <View style={styles.rideInfoColumn}>
          {/* First Row */}
          <View style={styles.locationRow}>
            <View style={styles.locationTextContainer}>
              <Typo variant="body" color={theme.text.primary} numberOfLines={1}>
                {ride.pickup_address || "--"}
              </Typo>
              <Typo
                variant="caption"
                size={moderateScale(12)}
                color={theme.text.secondary}>
                {t("rides.pickupPoint")}
              </Typo>
            </View>

            {!hideExtraDetails && (
              <View style={styles.paymentInfoContainer}>
                <Typo variant="caption" color={theme.text.muted}>
                  {t("rides.payment")}
                </Typo>
                <View style={dynamicStyles.paymentBadge}>
                  <Typo
                    variant="caption"
                    size={moderateScale(10)}
                    color={theme.button.primary}>
                    {formatFare(ride.ride_fare)}
                  </Typo>
                </View>
              </View>
            )}
          </View>

          {/* Second Row */}
          <View style={styles.locationRow}>
            <View style={styles.locationTextContainer}>
              <Typo variant="body" color={theme.text.primary} numberOfLines={1}>
                {ride.destination_address || "--"}
              </Typo>
              <Typo
                variant="caption"
                size={moderateScale(12)}
                color={theme.text.secondary}>
                {t("rides.destination")}
              </Typo>
            </View>
            {!hideExtraDetails && (
              <View style={styles.distanceInfoContainer}>
                <Typo variant="caption" color={theme.text.muted}>
                  {t("rides.distance")}
                </Typo>
                <Typo
                  variant="body"
                  size={moderateScale(13)}
                  color={theme.text.primary}>
                  {formattedDistance || "--"}
                </Typo>
              </View>
            )}
          </View>
        </View>
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  locationInfoColumn: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  rideInfoColumn: {
    flex: 1,
    gap: verticalScale(24),
  },
  dashedLine: {
    width: 1,
    flex: 1,
    borderRightWidth: 1.4,
    borderStyle: "dashed",
    marginVertical: verticalScale(2),
  },
  rideCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: horizontalScale(20),
    gap: verticalScale(10),
  },
  rideCardContent: {
    flexDirection: "row",
    gap: horizontalScale(12),
    flex: 1,
  },
  locationRow: {
    gap: verticalScale(10),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationInfoContainer: {
    gap: horizontalScale(10),
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    flexShrink: 1,
  },
  locationIcon: {
    padding: horizontalScale(3),
  },
  locationTextContainer: {
    gap: verticalScale(4),
    flexShrink: 1,
  },
  paymentInfoContainer: {
    alignItems: "flex-end",
    gap: verticalScale(4),
  },
  paymentBadge: {
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
  },
  distanceInfoContainer: {
    alignItems: "flex-end",
    gap: verticalScale(4),
  },
});
