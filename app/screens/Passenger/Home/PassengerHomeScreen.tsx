import { View, Text } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { horizontalScale } from "@/utils/styling";

export default function PassengerHomeScreen() {
  return (
    <ScreenWrapper padding={horizontalScale(15)}>
      <View>
        <Text>PassengerHomeScreen</Text>
      </View>
    </ScreenWrapper>
  );
}
