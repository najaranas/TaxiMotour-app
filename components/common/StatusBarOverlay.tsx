import { useTheme } from "@/contexts/ThemeContext";
import { verticalScale } from "@/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StatusBarOverlay() {
  const insets = useSafeAreaInsets();
  const { themeName } = useTheme();

  if (themeName !== "dark") return null;

  return (
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
  );
}
