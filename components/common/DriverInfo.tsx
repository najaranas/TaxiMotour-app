import { View } from "react-native";
import UserProfileImage from "./UserProfileImage";
import { useTheme } from "@/contexts/ThemeContext";
import { useMemo } from "react";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import type { ViewStyle } from "react-native";
import Typo from "./Typo";

export default function DriverInfo() {
  const { theme } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        padding: horizontalScale(20),
        gap: verticalScale(10),
        borderRadius: theme.borderRadius.large,
        borderWidth: theme.borderWidth.thin,
        borderColor: theme.gray.border,
      } as ViewStyle,
    }),
    [theme]
  );
  return (
    <View style={dynamicStyles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(10),
          maxWidth: "60%",
        }}>
        <UserProfileImage
          editable={false}
          showEditIcon={false}
          hasImage
          imageUrl="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?cs=srgb&dl=pexels-italo-melo-2379005.jpg&fm=jpg"
          size={40}
        />
        <View
          style={{
            gap: verticalScale(5),
            flexShrink: 1,
          }}>
          <Typo variant="body" numberOfLines={1} ellipsizeMode="middle">
            Anis Ben Youssef
          </Typo>
          <Typo variant="caption" color={theme.text.muted}>
            Driver
          </Typo>
        </View>
      </View>
      <View
        style={{
          alignItems: "flex-end",
          gap: verticalScale(5),
          flexShrink: 1,
        }}>
        <Typo
          variant="body"
          numberOfLines={1}
          size={moderateScale(13)}
          color={theme.text.primary}>
          +216 93772115
        </Typo>
        <Typo variant="caption" color={theme.text.muted}>
          Yamaha YZF-R3
        </Typo>
      </View>
    </View>
  );
}
