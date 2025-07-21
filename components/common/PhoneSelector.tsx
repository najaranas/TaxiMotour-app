import { Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { TunisiaFlag } from "./SvgIcons";
import { useRouter } from "expo-router";

export default function PhoneSelector() {
  const { theme } = useTheme();
  const router = useRouter();
  const handlePress = () => {
    router.navigate("/(auth)/PhoneVerification");
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: horizontalScale(15),
      borderRadius: theme.borderRadius.medium,
      gap: horizontalScale(10),
      backgroundColor: COLORS.gray["100"],
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.input.border,
    },
    countryButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: horizontalScale(5),
      borderRightWidth: theme.borderWidth.thin,
      borderRightColor: theme.input.border,
      paddingRight: horizontalScale(10),
    },
  });

  return (
    <Pressable onPress={() => handlePress()} style={dynamicStyles.container}>
      <View style={dynamicStyles.countryButton}>
        <TunisiaFlag size={verticalScale(30)} />
      </View>

      {/* Country Code Display */}
      <View style={styles.countryCodeContainer}>
        <Typo variant="body" color={theme.text.primary}>
          +216
        </Typo>

        <Typo variant="body" color={theme.input.placeholder}>
          9XX XXX XX
        </Typo>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  countryCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    paddingRight: horizontalScale(8),
  },
});
