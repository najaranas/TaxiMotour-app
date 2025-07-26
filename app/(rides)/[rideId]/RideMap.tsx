import { StatusBar, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MapProps, RideCardProps, RouteData } from "@/types/Types";
import { horizontalScale, verticalScale } from "@/utils/styling";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import BackButton from "@/components/common/BackButton";
import RideCard from "@/components/Ride/RideCard";
import DriverInfo from "@/components/common/DriverInfo";
import FareInfo from "@/components/common/FareInfo";
import { useTheme } from "@/contexts/ThemeContext";
import Map from "@/components/map/CustomMap";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatusBarOverlay from "@/components/common/StatusBarOverlay";
import { useState, useMemo } from "react";

export default function RideMap() {
  let { ride, rideId } = useLocalSearchParams() as unknown as {
    ride: string;
    rideId: string;
  };
  const { theme } = useTheme();

  const rideData = JSON.parse(ride) as RideCardProps["ride"];

  // Separate state variables for each padding
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [bottomHeight, setBottomHeight] = useState<number>(0);
  const insets = useSafeAreaInsets();

  // Calculate mapCameraView using useMemo to avoid unnecessary recalculations
  const mapCameraView = useMemo<MapProps["viewPadding"]>(
    () => ({
      paddingLeft: horizontalScale(50),
      paddingRight: horizontalScale(50),
      paddingTop: headerHeight + insets.top + verticalScale(40),
      paddingBottom: bottomHeight + verticalScale(40),
    }),
    [headerHeight, bottomHeight, insets.top]
  );

  console.log("mapCameraView", mapCameraView);
  console.log("Ride ID:", rideId);
  console.log("Ride Details:", rideData);

  const data = [
    {
      place: "Délégation Bab Souika",
      lon: 10.267988166213035,
      lat: 36.805205476964815,
    },
    {
      place: "Marsa Corniche",
      lon: 10.338330566883087,
      lat: 36.38208144708873,
    },
  ];

  return (
    <ScreenWrapper safeArea={false}>
      <Map roadData={data} viewPadding={mapCameraView} />
      <StatusBarOverlay />

      <View
        onLayout={(e) => {
          const height = e?.nativeEvent?.layout?.height;
          if (height !== undefined) {
            console.log("Header height:", height);
            setHeaderHeight(height);
          }
        }}
        style={[
          styles.headerSection,
          {
            top: insets.top + verticalScale(10),
            gap: verticalScale(10),
            alignItems: "flex-start",
            flexDirection: "row",
          },
        ]}>
        <View
          style={{
            padding: horizontalScale(5),
            backgroundColor: theme.background,
            borderRadius: theme.borderRadius.circle,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 6,
          }}>
          <BackButton variant="arrow" />
        </View>
        <View style={{ flex: 1 }}>
          <RideCard ride={rideData} hideExtraDetails />
        </View>
      </View>

      <View
        onLayout={(e) => {
          const height = e?.nativeEvent?.layout?.height;
          if (height !== undefined) {
            console.log("Bottom height:", height);
            setBottomHeight(height);
          }
        }}
        style={[
          styles.dataContainer,
          {
            borderTopLeftRadius: theme.borderRadius.large + horizontalScale(20),
            borderTopRightRadius:
              theme.borderRadius.large + horizontalScale(20),
            backgroundColor: theme.background,
            padding: horizontalScale(20),
            paddingBottom: insets.bottom,
            gap: verticalScale(20),
          },
        ]}>
        <DriverInfo />
        <FareInfo />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    position: "absolute",
    left: horizontalScale(20),
    right: horizontalScale(20),
    zIndex: 1,
  },
  dataContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: "blue",
  },
});
