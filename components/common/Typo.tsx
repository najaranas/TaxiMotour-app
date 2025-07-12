import { TypoProps } from "@/types/Types";
import { moderateScale } from "@/utils/styling";
import THEME from "@/constants/theme";
import { Text, TextStyle } from "react-native";

export default function Typo({
  size,
  fontFamily,
  color = THEME.text.primary,
  style,
  children,
  numberOfLines,
  variant = "body",
}: TypoProps) {
  // Typography variants
  const getVariantStyle = () => {
    switch (variant) {
      case "h1":
        return { fontSize: moderateScale(32), fontFamily: "Roboto-Bold" };
      case "h2":
        return { fontSize: moderateScale(28), fontFamily: "Roboto-Bold" };
      case "h3":
        return { fontSize: moderateScale(24), fontFamily: "Roboto-Medium" };
      case "body":
        return { fontSize: moderateScale(16), fontFamily: "Roboto-Regular" };
      case "caption":
        return { fontSize: moderateScale(12), fontFamily: "Roboto-Light" };
      case "button":
        return { fontSize: moderateScale(16), fontFamily: "Roboto-Medium" };
      default:
        return { fontSize: moderateScale(16), fontFamily: "Roboto-Regular" };
    }
  };

  const variantStyle = getVariantStyle();

  const textStyle: TextStyle = {
    fontFamily: fontFamily || variantStyle.fontFamily,
    fontSize: size ? moderateScale(size) : variantStyle.fontSize,
    color,
  };

  return (
    <Text numberOfLines={numberOfLines} style={[textStyle, style]}>
      {children}
    </Text>
  );
}
