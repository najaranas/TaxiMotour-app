import { COLORS } from "@/constants/theme";
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
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={loading ? 1 : activeOpacity}
      onPress={onPress}
      style={[style, { opacity: loading || disabled ? 0.5 : 1 }]}>
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
