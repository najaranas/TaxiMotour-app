import { View, Text, StyleSheet } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Typo from "@/components/common/Typo";
import { Bell } from "lucide-react-native";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { useTheme } from "@/contexts/ThemeContext";

export default function RidesScreen() {
  const { theme } = useTheme();
  return (
    <ScreenWrapper scroll safeArea padding={horizontalScale(20)}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: verticalScale(5) }}>
            <Typo variant="h3">Rides History</Typo>
            <Typo variant="body" color={theme.text.secondary}>
              Showing all your rides
            </Typo>
          </View>
          <View>
            <Bell
              color={theme.text.primary}
              strokeWidth={1.5}
              size={moderateScale(25)}
            />
          </View>
        </View>
        <View style={{ gap: verticalScale(10) }}>
          <Typo size={moderateScale(20)} variant="h3">
            Active rides
          </Typo>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              gap: horizontalScale(20),
              justifyContent: "space-between",
              // backgroundColor: "#f5f5f53f",
              borderRadius: theme.borderRadius.large,
              borderWidth: theme.borderWidth.thin,
              borderColor: theme.gray.border,
              padding: horizontalScale(20),
            }}>
            <View>
              <View
                style={{
                  gap: verticalScale(5),
                  justifyContent: "space-between",
                }}>
                <View style={{ gap: verticalScale(5), alignItems: "center" }}>
                  <Typo variant="body" color={theme.text.primary}>
                    Pickedup Point
                  </Typo>
                  <Typo
                    variant="caption"
                    size={moderateScale(10)}
                    color={theme.text.secondary}>
                    Destination
                  </Typo>
                </View>
                <View style={{ gap: verticalScale(5), alignItems: "center" }}>
                  <Typo variant="caption" color={theme.text.muted}>
                    Distance
                  </Typo>
                  <Typo variant="caption" color={theme.text.secondary}>
                    12Km
                  </Typo>
                </View>
              </View>
            </View>
            <View
              style={{
                justifyContent: "space-between",
                gap: verticalScale(20),
              }}>
              <View style={{ gap: verticalScale(5), alignItems: "center" }}>
                <Typo variant="caption" color={theme.text.muted}>
                  Payment
                </Typo>
                <View
                  style={{
                    borderRadius: theme.borderRadius.pill,
                    backgroundColor: "#ffb2183d",
                    paddingInline: horizontalScale(10),
                    paddingBlock: horizontalScale(5),
                  }}>
                  <Typo variant="caption" color={theme.text.secondary}>
                    TND13
                  </Typo>
                </View>
              </View>
              <View style={{ gap: verticalScale(5), alignItems: "center" }}>
                <Typo variant="caption" color={theme.text.muted}>
                  Distance
                </Typo>
                <Typo variant="caption" color={theme.text.secondary}>
                  12Km
                </Typo>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(30),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: horizontalScale(10),
  },
});
