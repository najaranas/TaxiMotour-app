import { Pressable, StyleSheet, View } from "react-native";
import THEME, { COLORS } from "@/constants/theme";
import { horizontalScale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { TunisiaFlag } from "./SvgIcons";
import { useRouter } from "expo-router";

export default function PhoneSelector() {
  const router = useRouter();
  const handlePress = () => {
    router.navigate("/screens/Auth/PhoneVerification");
  };
  return (
    <Pressable onPress={() => handlePress()} style={styles.container}>
      <View style={styles.countryButton}>
        <TunisiaFlag size={verticalScale(30)} />
      </View>

      {/* Country Code Display */}
      <View style={styles.countryCodeContainer}>
        <Typo variant="body" color={THEME.text.primary}>
          +216
        </Typo>

        <Typo variant="body" color={THEME.input.placeholder}>
          9XX XXX XX
        </Typo>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: horizontalScale(15),
    borderRadius: THEME.borderRadius.medium,
    gap: horizontalScale(10),
    backgroundColor: COLORS.gray["100"],
    borderWidth: THEME.borderWidth.thin,
    borderColor: THEME.input.border,
  },
  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
    borderRightWidth: THEME.borderWidth.thin,
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
