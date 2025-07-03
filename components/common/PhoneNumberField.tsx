import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import THEME, { COLORS } from "@/constants/theme";
import { moderateScale, horizontalScale, verticalScale } from "@/utils/styling";
import { Entypo } from "@expo/vector-icons";
import Typo from "./Typo";

interface PhoneNumberFieldProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}

export default function PhoneNumberField({
  value = "",
  onChangeText,
  placeholder = "Phone number",
}: PhoneNumberFieldProps) {
  return (
    <View style={[styles.container]}>
      {/* Country Code with Tunisia Flag */}
      <Pressable style={styles.countryButton}>
        {/* <Typo style={styles.flagEmoji}>🇹🇳</Typo> */}
        <Typo variant="button">🇹🇳</Typo>
        <Entypo
          name="chevron-down"
          size={moderateScale(15)}
          color={THEME.text.secondary}
        />
      </Pressable>

      {/* Phone Input */}
      <Pressable>
        <Typo variant="button">+216</Typo>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: horizontalScale(15),
    borderRadius: moderateScale(8),
    gap: horizontalScale(10),
    backgroundColor: COLORS.gray["100"],
  },

  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
});
