import { ScrollView, View } from "react-native";
import Typo from "./Typo";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { useState } from "react";
import type { RideProps, PaymentMethod, RideStatus } from "@/types/Types";
import { formatDistance, formatRideDate } from "@/utils/rideUtils";
import { useTranslation } from "react-i18next";

interface FareInfoProps {
  rideData?: RideProps;
}

export default function FareInfo({ rideData }: FareInfoProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [viewWidth, setViewWidth] = useState(0);

  // Use ride data or fallback values for demo
  const rideFare = rideData?.ride_fare || 15;
  const paymentMethod = rideData?.payment_method || "cash";
  const rideStatus = rideData?.status || "completed";
  const rideDate = rideData?.created_at || new Date().toISOString();
  const distance = rideData?.distance || 5000; // in meters
  const duration = rideData?.duration || 900; // in seconds
  const feedback = rideData?.feedback || null;

  // Format data for display
  const formattedDistance = formatDistance(distance);
  const formattedDate = formatRideDate(rideDate);
  const formattedDuration = Math.round(duration / 60); // minutes

  // Translation helpers
  const getPaymentMethodText = (method: PaymentMethod) => {
    switch (method) {
      case "cash":
        return t("rides.cash");
      case "card":
        return t("rides.card");
      case "mobile_wallet":
        return t("rides.mobile");
      case "bank_transfer":
        return t("rides.card"); // Use card as fallback for bank transfer
      default:
        return t("rides.cash");
    }
  };

  const getStatusText = (status: RideStatus) => {
    switch (status) {
      case "pending":
        return t("rides.pending");
      case "accepted":
        return t("rides.active");
      case "in_progress":
        return t("rides.active");
      case "completed":
        return t("rides.completed");
      case "cancelled":
        return t("rides.cancelled");
      default:
        return t("rides.completed");
    }
  };

  return (
    <View>
      <View
        onLayout={(e) => {
          setViewWidth(e.nativeEvent.layout.width);
        }}
        style={{
          gap: horizontalScale(15),
        }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: horizontalScale(10),
          }}>
          <View
            style={{
              gap: moderateScale(7),
              flexShrink: 1,
              minWidth: viewWidth / 3,
            }}>
            <Typo
              variant="body"
              size={moderateScale(12)}
              color={theme.text.muted}>
              {t("rides.rideFare")}
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              TND{rideFare}
            </Typo>
          </View>
          <View
            style={{
              gap: moderateScale(7),
              flexShrink: 1,
              minWidth: viewWidth / 3,
            }}>
            <Typo
              variant="body"
              size={moderateScale(12)}
              color={theme.text.muted}>
              {t("rides.paymentMethod")}
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              {getPaymentMethodText(paymentMethod)}
            </Typo>
          </View>
          <View
            style={{
              gap: moderateScale(7),
              flexShrink: 1,
              minWidth: viewWidth / 3,
            }}>
            <Typo
              variant="body"
              size={moderateScale(12)}
              color={theme.text.muted}>
              {t("rides.rideStatus")}
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              {getStatusText(rideStatus)}
            </Typo>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: horizontalScale(10),
          }}>
          <View
            style={{
              gap: moderateScale(7),
              flexShrink: 1,
              minWidth: viewWidth / 3,
            }}>
            <Typo
              variant="body"
              size={moderateScale(12)}
              color={theme.text.muted}>
              {t("rides.rideDate")}
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              {formattedDate}
            </Typo>
          </View>
          <View
            style={{
              gap: moderateScale(7),
              flexShrink: 1,
              minWidth: viewWidth / 3,
            }}>
            <Typo
              variant="body"
              size={moderateScale(12)}
              color={theme.text.muted}>
              {t("rides.distance")}
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              {formattedDistance.value}
              {formattedDistance.unit}
            </Typo>
          </View>
          <View
            style={{
              gap: moderateScale(7),
              flexShrink: 1,
              minWidth: viewWidth / 3,
            }}>
            <Typo
              variant="body"
              size={moderateScale(12)}
              color={theme.text.muted}>
              {t("rides.duration")}
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              {formattedDuration}min
            </Typo>
          </View>
        </View>
      </View>
      <View style={{ marginTop: horizontalScale(20) }}>
        <View
          style={{
            gap: moderateScale(7),
            flexShrink: 1,
            minWidth: viewWidth / 3,
          }}>
          <Typo
            variant="body"
            size={moderateScale(12)}
            color={theme.text.muted}>
            {t("rides.feedback")}
          </Typo>
          <ScrollView
            nestedScrollEnabled
            style={{
              maxHeight: verticalScale(100),
              borderRadius: theme.borderRadius.large,
              borderWidth: theme.borderWidth.thin,
              borderColor: theme.gray.border,
            }}
            contentContainerStyle={{
              padding: horizontalScale(20),
              gap: verticalScale(10),
            }}>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              {feedback || t("rides.noFeedback")}
            </Typo>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
