import { View, StyleSheet } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Typo from "@/components/common/Typo";
import { Bell } from "lucide-react-native";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { useTheme } from "@/contexts/ThemeContext";
import RideCard from "@/components/Ride/RideCard";

export default function RidesHistoryScreen() {
  const { theme } = useTheme();

  const activeRide = {
    id: 1,
    pickupAddress: "456 Elm Street, Springfield",
    destinationAddress: "739 Main Street, Springfield",
    payment: "TND12",
    distance: "12Km",
  };

  return (
    <ScreenWrapper
      scroll
      safeArea
      hasBottomTabs
      padding={horizontalScale(20)}
      contentContainerStyle={{ paddingBlock: verticalScale(10) }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.mainContainer}>
        <View style={styles.headerSection}>
          <View style={styles.headerTextContainer}>
            <Typo variant="h3">Rides History</Typo>
            <Typo variant="body" color={theme.text.secondary}>
              Showing all your rides
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

        <View style={styles.ridesSection}>
          <Typo size={moderateScale(20)} variant="h3">
            Active rides
          </Typo>

          <RideCard ride={activeRide} />
        </View>
        <View style={styles.ridesSection}>
          <Typo size={moderateScale(20)} variant="h3">
            Past rides
          </Typo>

          <RideCard ride={activeRide} />
          <RideCard ride={activeRide} />
          <RideCard ride={activeRide} />
          <RideCard ride={activeRide} />
        </View>
      </View>
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
});
