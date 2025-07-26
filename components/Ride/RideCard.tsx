import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { LocateFixed, MapPin } from "lucide-react-native";
import Typo from "../common/Typo";
import { useTheme } from "@/contexts/ThemeContext";
import { RideCardProps } from "@/types/Types";
import { useRouter } from "expo-router";
import Button from "../common/Button";

export default function RideCard({
  ride,
  viewOnly,
  hideExtraDetails = false,
}: RideCardProps) {
  const { theme } = useTheme();
  const router = useRouter();

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

  const cardPressHandler = () => {
    router.navigate({
      pathname: "/(rides)/[rideId]",
      params: { rideId: ride.id.toString(), ride: JSON.stringify(ride) },
    });
  };
  return (
    <Button onPress={!viewOnly ? cardPressHandler : undefined}>
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
                {ride.pickupAddress}
              </Typo>
              <Typo
                variant="caption"
                size={moderateScale(12)}
                color={theme.text.secondary}>
                Pickup point
              </Typo>
            </View>

            {!hideExtraDetails && (
              <View style={styles.paymentInfoContainer}>
                <Typo variant="caption" color={theme.text.muted}>
                  Payment
                </Typo>
                <View style={dynamicStyles.paymentBadge}>
                  <Typo
                    variant="caption"
                    size={moderateScale(10)}
                    color={theme.button.primary}>
                    {ride.payment}
                  </Typo>
                </View>
              </View>
            )}
          </View>

          {/* Second Row */}
          <View style={styles.locationRow}>
            <View style={styles.locationTextContainer}>
              <Typo variant="body" color={theme.text.primary} numberOfLines={1}>
                {ride.destinationAddress}
              </Typo>
              <Typo
                variant="caption"
                size={moderateScale(12)}
                color={theme.text.secondary}>
                Destination
              </Typo>
            </View>
            {!hideExtraDetails && (
              <View style={styles.distanceInfoContainer}>
                <Typo variant="caption" color={theme.text.muted}>
                  Distance
                </Typo>
                <Typo
                  variant="body"
                  size={moderateScale(13)}
                  color={theme.text.primary}>
                  {ride.distance}
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
    // paddingVertical: verticalScale(),
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
    alignItems: "center",
    gap: verticalScale(4),
  },
  paymentBadge: {
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
  },
  distanceInfoContainer: {
    alignItems: "center",
    gap: verticalScale(4),
  },
});
