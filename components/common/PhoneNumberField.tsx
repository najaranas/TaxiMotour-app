import { Pressable, StyleSheet, View } from "react-native";
import THEME, { COLORS } from "@/constants/theme";
import { moderateScale, horizontalScale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { TunisiaFlag } from "./SvgIcons";

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
    <View style={styles.container}>
      <Pressable style={styles.countryButton}>
        <TunisiaFlag height={verticalScale(30)} width={horizontalScale(30)} />
      </Pressable>

      {/* Country Code Display */}
      <View style={styles.countryCodeContainer}>
        <Pressable>
          <Typo variant="body" color={THEME.text.primary}>
            +216
          </Typo>
        </Pressable>

        <Pressable>
          <Typo variant="body" color={THEME.input.placeholder}>
            9XX XXX XX
          </Typo>
        </Pressable>
      </View>
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
    borderWidth: 1,
    borderColor: THEME.input.border,
  },
  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
    borderRightWidth: 1,
    borderRightColor: COLORS.gray["300"],
    paddingRight: horizontalScale(10),
  },
  countryCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    paddingRight: horizontalScale(8),
  },
});
