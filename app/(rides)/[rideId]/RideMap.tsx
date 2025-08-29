import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MapProps, RideCardProps } from "@/types/Types";
import { horizontalScale, verticalScale } from "@/utils/styling";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import BackButton from "@/components/common/BackButton";
import RideCard from "@/components/Ride/RideCard";
import DriverInfo from "@/components/common/DriverInfo";
import FareInfo from "@/components/common/FareInfo";
import { useTheme } from "@/contexts/ThemeContext";
import CustomMap from "@/components/map/CustomMap";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatusBarOverlay from "@/components/common/StatusBarOverlay";
import { useState, useMemo } from "react";

export default function RideMap() {
  // Get ride and rideId from navigation params
  const { ride: rideParam, rideId: rideIdParam } = useLocalSearchParams() as {
    ride: string;
    rideId: string;
  };
  const { theme } = useTheme();
  const rideDetails = JSON.parse(rideParam) as RideCardProps["ride"];

  // Heights and widths for dynamic padding
  const [headerSectionHeight, setHeaderSectionHeight] = useState<number>(0);
  const [footerSectionHeight, setFooterSectionHeight] = useState<number>(0);
  const [backButtonWidth, setBackButtonWidth] = useState<number>(0);
  const insets = useSafeAreaInsets();

  // Camera padding for map
  const mapViewPadding = useMemo<MapProps["viewPadding"]>(
    () => ({
      paddingLeft: horizontalScale(50),
      paddingRight: horizontalScale(50),
      paddingTop: headerSectionHeight + insets.top + verticalScale(40),
      paddingBottom: footerSectionHeight + verticalScale(40),
    }),
    [headerSectionHeight, footerSectionHeight, insets.top]
  );

  // Example ride route data
  const routePoints = [
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
      <CustomMap roadData={routePoints} viewPadding={mapViewPadding} />
      <StatusBarOverlay />

      {/* Header Section */}
      <View
        onLayout={(e) => {
          const height = e?.nativeEvent?.layout?.height;
          if (height !== undefined) {
            setHeaderSectionHeight(height);
          }
        }}
        style={[
          styles.headerSection,
          {
            top: insets.top + verticalScale(10),
            marginLeft: backButtonWidth + horizontalScale(10),
          },
        ]}>
        <View style={styles.headerCardWrapper}>
          <RideCard ride={rideDetails} hideExtraDetails viewOnly />
        </View>
      </View>

      {/* Back Button */}
      <View
        onLayout={(e) => {
          const width = e?.nativeEvent?.layout?.width;
          if (width !== undefined) {
            setBackButtonWidth(width);
          }
        }}
        style={[
          styles.backButton,
          {
            top: insets.top + verticalScale(10),

            backgroundColor: theme.background,
            borderRadius: theme.borderRadius.circle,
          },
        ]}>
        <BackButton variant="arrow" />
      </View>

      {/* Footer Section */}
      <View
        onLayout={(e) => {
          const height = e?.nativeEvent?.layout?.height;
          if (height !== undefined) {
            setFooterSectionHeight(height);
          }
        }}
        style={[
          styles.footerSection,
          {
            borderTopLeftRadius: theme.borderRadius.large + horizontalScale(20),
            borderTopRightRadius:
              theme.borderRadius.large + horizontalScale(20),
            backgroundColor: theme.background,
            paddingBottom: insets.bottom + horizontalScale(20),
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
    gap: verticalScale(10),
    alignItems: "flex-start",
    flexDirection: "row",
  },
  headerCardWrapper: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    left: horizontalScale(20),
    padding: horizontalScale(5),
    zIndex: 3,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  footerSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    padding: horizontalScale(20),
    gap: verticalScale(20),
  },
});
