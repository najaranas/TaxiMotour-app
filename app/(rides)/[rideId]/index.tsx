import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RideCardProps } from "@/types/Types";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import BackButton from "@/components/common/BackButton";
import Typo from "@/components/common/Typo";
import RideCard from "@/components/Ride/RideCard";
import Seperator from "@/components/common/Seperator";
import DriverInfo from "@/components/common/DriverInfo";
import FareInfo from "@/components/common/FareInfo";
import Button from "@/components/common/Button";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { Map } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function RideDetails() {
  let { ride, rideId } = useLocalSearchParams() as unknown as {
    ride: string;
    rideId: string;
  };
  const { theme } = useTheme();
  const router = useRouter();

  const rideData = JSON.parse(ride) as RideCardProps["ride"];
  console.log("Ride ID:", rideId);
  console.log("Ride Dedstails:", rideData);

  const handleMapPress = () => {
    router.push({
      pathname: "/(rides)/[rideId]/RideMap",
      params: { rideId: rideId, ride: ride },
    });
  };
  return (
    <ScreenWrapper
      // scroll
      safeArea
      padding={horizontalScale(20)}>
      <BackButton variant="arrow" />
      <View style={styles.mainContainer}>
        <Typo variant="h3" style={styles.title}>
          Ride Details
        </Typo>
        <RideCard ride={rideData} viewOnly />
        <Seperator text="Details" />

        <DriverInfo />
        <FareInfo />
        <View style={styles.buttonColumn}>
          <Button
            // onPress={handleConfirm}
            // loading={isUploading}
            indicatorStyle={{ color: COLORS.white }}
            style={[
              styles.actionButton,
              { backgroundColor: theme.button.primary, flex: 1 },
            ]}>
            <Typo
              size={moderateScale(17)}
              fontFamily={FONTS.bold}
              color={COLORS.white}>
              Re-order ride
            </Typo>
          </Button>
          <Button
            // disabled={isUploading}
            onPress={handleMapPress}
            style={[styles.actionButton, { backgroundColor: theme.surface }]}>
            <Map
              size={moderateScale(20)}
              color={theme.text.secondary}
              strokeWidth={1.5}
            />
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    gap: verticalScale(20),
  },

  title: {
    textAlign: "center",
  },
  buttonColumn: {
    gap: verticalScale(10),
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-end",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: horizontalScale(10),
    borderRadius: THEME.borderRadius.circle,
    minHeight: verticalScale(55),
    minWidth: verticalScale(55),
  },
});
