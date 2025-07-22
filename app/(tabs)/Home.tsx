import React, { useCallback, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

// Components
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Button from "@/components/common/Button";
import CustomDrawer from "@/components/common/CustomDrawer";
import CustomBottomSheet from "@/components/common/CustomBottomSheet";
import { MenuIcon } from "@/components/common/SvgIcons";

// New modular components
import Map from "@/components/map/Map";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import RideBookingSheet from "@/components/home/RideBookingSheet";

// Styling
import { COLORS } from "@/constants/theme";
import { horizontalScale, verticalScale } from "@/utils/styling";
import { apiUtils } from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";

interface LocationData {
  place?: string;
  lon?: number | null;
  lat?: number | null;
}

export default function Home() {
  // State management
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bottomSheetMethods, setBottomSheetMethods] = useState<any>(null);
  const [activeBottomSheetIndex, setActiveBottomSheetIndex] =
    useState<number>(0); // Start at index 1 (100%) instead of 0 (10%)
  const [currentLocation, setCurrentLocation] = useState<LocationData | string>(
    ""
  );
  const [destinationLocation, setDestinationLocation] = useState<
    LocationData | string
  >("");
  const [roadData, setRoadData] = useState<LocationData[]>([]);

  const insets = useSafeAreaInsets();
  const { theme, themeName } = useTheme();

  // Handlers
  const handleSnapToIndex = (index: number) => {
    bottomSheetMethods?.snapToIndex(index);
  };

  const handleCurrentLocationChange = (location: LocationData) => {
    setCurrentLocation(location);
  };

  const handleDestinationLocationChange = (location: LocationData) => {
    setDestinationLocation(location);
  };

  const handleRoadDataChange = (newRoadData: LocationData[]) => {
    // Only update road data if we have valid coordinates

    const validRoadData = newRoadData.filter((location) =>
      apiUtils.validateCoordinates(location.lat ?? null, location.lon ?? null)
    );
    console.log("validRoadData", validRoadData);
    if (validRoadData.length >= 2) {
      setRoadData(validRoadData);
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // Cleanup on focus change
  useFocusEffect(
    useCallback(() => {
      return () => isDrawerOpen && setIsDrawerOpen(false);
    }, [isDrawerOpen])
  );

  return (
    <ScreenWrapper safeArea={false} style={styles.container}>
      {/* Enhanced Map Component */}
      <Map roadData={roadData} />

      {themeName === "dark" && (
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.3)", "transparent"]}
          dither={false}
          locations={[0.5, 1]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: insets.top + verticalScale(10),
            zIndex: 30,
          }}
        />
      )}

      {/* Navigation Drawer */}

      <View
        style={[StyleSheet.absoluteFill, { zIndex: 15 }]}
        pointerEvents={isDrawerOpen ? "auto" : "none"}>
        <CustomDrawer
          open={isDrawerOpen}
          onOpen={() => setIsDrawerOpen(true)}
          onClose={handleDrawerClose}>
          <NavigationDrawer onClose={handleDrawerClose} />
        </CustomDrawer>
      </View>

      {/* Menu Button */}
      <View
        style={[
          styles.menuButtonContainer,
          { top: insets.top + verticalScale(20) },
        ]}>
        <Button onPress={() => setIsDrawerOpen(true)}>
          <View
            style={[styles.menuButton, { backgroundColor: theme.background }]}>
            <MenuIcon color={theme.text.secondary} size={horizontalScale(25)} />
          </View>
        </Button>
      </View>

      {/* Ride Booking Bottom Sheet */}
      <CustomBottomSheet
        enableOverDrag={false}
        enablePanDownToClose={false}
        onRef={setBottomSheetMethods}
        snapPoints={["30%", "100%"]}
        index={0}
        zindex={10}
        onChange={setActiveBottomSheetIndex}>
        <RideBookingSheet
          activeIndex={activeBottomSheetIndex}
          onSnapToIndex={handleSnapToIndex}
          currentLocation={currentLocation}
          destinationLocation={destinationLocation}
          onCurrentLocationChange={handleCurrentLocationChange}
          onDestinationLocationChange={handleDestinationLocationChange}
          onRoadDataChange={handleRoadDataChange}
        />
      </CustomBottomSheet>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  menuButtonContainer: {
    position: "absolute",
    left: horizontalScale(20),
    zIndex: 5,
  },
  menuButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: horizontalScale(12),
    borderRadius: horizontalScale(25),
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
