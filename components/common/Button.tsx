import { COLORS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { ButtonProps } from "@/types/Types";
import { TouchableOpacity } from "react-native";
import { MaterialIndicator } from "react-native-indicators";

export default function Button({
  children,
  style,
  disabled = false,
  activeOpacity = 0.5,
  loading = false,
  indicatorStyle,
  onPress,
}: ButtonProps) {
  const { themeName } = useTheme();
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={loading ? 1 : activeOpacity}
      onPress={onPress}
      style={[
        style,
        {
          opacity: loading || disabled ? (themeName === "dark" ? 0.2 : 0.5) : 1,
        },
      ]}>
      {loading ? (
        <MaterialIndicator
          size={indicatorStyle?.size || 25}
          color={indicatorStyle?.color || COLORS.primary}
          key="loading"
        />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
