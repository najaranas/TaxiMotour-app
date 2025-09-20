import { View } from "react-native";
import UserProfileImage from "./UserProfileImage";
import { useTheme } from "@/contexts/ThemeContext";
import { useMemo } from "react";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import type { ViewStyle } from "react-native";
import Typo from "./Typo";
import type { DriverInfoProps } from "@/types/Types";
import { useTranslation } from "react-i18next";
import SkeletonPlaceholder from "./SkeletonPlaceholder";

export default function DriverInfo({ driverData }: DriverInfoProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

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

  const renderSkeletonContainer = () => (
    <View style={[dynamicStyles.container, { alignItems: "center" }]}>
      <SkeletonPlaceholder animationType="shimmer">
        <View
          style={{
            width: moderateScale(40),
            height: moderateScale(40),
            borderRadius: moderateScale(20),
          }}
        />
      </SkeletonPlaceholder>
      <View style={{ flexDirection: "row", gap: horizontalScale(30) }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(10),
          }}>
          <View
            style={{
              gap: verticalScale(5),
              flexShrink: 1,
            }}>
            <SkeletonPlaceholder animationType="shimmer">
              <View
                style={{
                  height: verticalScale(16),
                  width: horizontalScale(120),
                  borderRadius: moderateScale(4),
                }}
              />
            </SkeletonPlaceholder>
            <SkeletonPlaceholder animationType="shimmer">
              <View
                style={{
                  height: verticalScale(12),
                  width: horizontalScale(60),
                  borderRadius: moderateScale(4),
                }}
              />
            </SkeletonPlaceholder>
          </View>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            gap: verticalScale(5),
            flexShrink: 1,
          }}>
          <SkeletonPlaceholder animationType="shimmer">
            <View
              style={{
                height: verticalScale(14),
                width: horizontalScale(100),
                borderRadius: moderateScale(4),
              }}
            />
          </SkeletonPlaceholder>
          <SkeletonPlaceholder animationType="shimmer">
            <View
              style={{
                height: verticalScale(12),
                width: horizontalScale(80),
                borderRadius: moderateScale(4),
              }}
            />
          </SkeletonPlaceholder>
        </View>
      </View>
    </View>
  );

  // Show skeleton if driverData is null or undefined
  if (!driverData) {
    return renderSkeletonContainer();
  }

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
          // hasImage={}
          imageUrl={""}
          size={40}
        />
        <View
          style={{
            gap: verticalScale(5),
            flexShrink: 1,
          }}>
          <Typo variant="body" numberOfLines={1} ellipsizeMode="middle">
            {driverData?.full_name}
          </Typo>
          <Typo variant="caption" color={theme.text.muted}>
            {t("rides.driver")}
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
          +216 {driverData?.phone_number}
        </Typo>
        <Typo variant="caption" color={theme.text.muted}>
          {driverData?.moto_type}
        </Typo>
      </View>
    </View>
  );
}
