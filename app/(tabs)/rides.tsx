import { View, Text, StyleSheet } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Typo from "@/components/common/Typo";
import { Bell } from "lucide-react-native";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { useTheme } from "@/contexts/ThemeContext";

export default function RidesScreen() {
  const { theme } = useTheme();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: verticalScale(5) }}>
            <Typo variant="body">Rides History</Typo>
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
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: horizontalScale(10),
  },
});
