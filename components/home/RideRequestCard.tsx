import { View, StyleSheet } from "react-native";
import { RideRequestCardProps } from "@/types/Types";
import UserProfileImage from "../common/UserProfileImage";
import Typo from "../common/Typo";
import { useTheme } from "@/contexts/ThemeContext";
import { COLORS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Button from "../common/Button";

export default function RideRequestCard({
  rideRequestData,
}: RideRequestCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.background,

          borderRadius: theme.borderRadius.medium,
          shadowRadius: 0,
        },
      ]}>
      {/* Your fare pill */}
      <View
        style={[styles.yourFare, { borderRadius: theme.borderRadius.medium }]}>
        <Typo variant="caption" style={styles.yourFareText}>
          Your fare
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
            {rideRequestData?.moto_type && (
              <Typo variant="body">{rideRequestData?.phone_number}</Typo>
            )}
          </View>
        </View>

        {/* Right: Time + Distance */}
        <View style={styles.rightSection}>
          <Typo variant="body">4 min</Typo>
          <Typo variant="body">794 m</Typo>
        </View>
      </View>

      {/* Price */}
      <Typo variant="h1" style={[styles.price, { color: theme.text.primary }]}>
        TND{rideRequestData?.ride_fare}
      </Typo>

      {/* Action buttons */}
      <View style={styles.buttonsRow}>
        <Button
          style={[
            styles.actionButton,
            {
              borderRadius: theme.borderRadius.medium,
              backgroundColor: "#F1F1F1",
            },
          ]}>
          <Typo variant="body">Decline</Typo>
        </Button>

        <Button
          style={[
            styles.actionButton,
            {
              borderRadius: theme.borderRadius.medium,
              backgroundColor: "#D7FF3E",
            },
          ]}>
          <Typo variant="body">Accept</Typo>
        </Button>
      </View>
    </View>
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
  yourFareText: {
    color: COLORS.black,
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
    gap: 12,
  },
  avatarContainer: {
    borderWidth: 3,
    borderColor: "#7C3AED",
    borderRadius: 30,
    padding: 2,
  },
  infoContainer: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  tier: {
    color: "#7C3AED",
  },
  rightSection: {
    alignItems: "flex-end",
    gap: 2,
  },
  price: {},
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
