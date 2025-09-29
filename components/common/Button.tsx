import { COLORS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { ButtonProps } from "@/types/Types";
import { moderateScale } from "@/utils/styling";
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
  const { themeName, theme } = useTheme();
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
          size={indicatorStyle?.size || moderateScale(25)}
          color={indicatorStyle?.color || theme.text.secondary}
          key="loading"
        />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
