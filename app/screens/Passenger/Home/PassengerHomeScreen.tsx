import { View, Text } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import MapView from "react-native-maps";

export default function PassengerHomeScreen() {
  return (
    <ScreenWrapper safeArea={false}>
      {/* <MapView> */}
      <Text>PassengerHomeScreen</Text>
      {/* </MapView> */}
    </ScreenWrapper>
  );
}
