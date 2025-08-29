import { ScrollView, View } from "react-native";
import Typo from "./Typo";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { useState } from "react";
import { useMapStore } from "@/store/mapStore";

export default function FareInfo() {
  const { theme } = useTheme();
  const [viewWidth, setViewWidth] = useState(0);
  const { routeGeoJSON } = useMapStore();

  // Extract distance and duration from route data
  const routeData = routeGeoJSON?.features?.[0]?.properties?.summary;
  const distance = routeData?.distance
    ? `${(routeData.distance / 1000).toFixed(1)}km`
    : "N/A";
  const duration = routeData?.duration
    ? `${Math.round(routeData.duration / 60)}min`
    : "N/A";

  // Calculate basic fare (you can implement your fare calculation logic)
  const baseFare = routeData?.distance
    ? Math.max(5, Math.round((routeData.distance / 1000) * 2.5))
    : 15;

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
              Ride Fare
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              TND{baseFare}
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
              Payment Method
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              Cash
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
              Status
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              Completed
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
              Date
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              24 Jul 2025
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
              Distance
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              {distance}
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
              Duration
            </Typo>
            <Typo
              variant="body"
              size={moderateScale(14)}
              color={theme.text.secondary}>
              {duration}
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
            Feedback
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
              The ride was smooth and the driver was very professional. I had a
              great experience overall. The ride was smooth and the driver was
              very professional. I had a great experience overall.
            </Typo>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
