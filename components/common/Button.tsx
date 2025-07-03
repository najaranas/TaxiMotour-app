import { ButtonProps } from "@/types/Types";
import { TouchableOpacity } from "react-native";

export default function Button({
  children,
  style,
  disabled = false,
  activeOpacity = 0.5,
  onPress,
}: ButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={style}>
      {children}
    </TouchableOpacity>
  );
}
