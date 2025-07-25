import { StyleSheet, View } from "react-native";
import Typo from "./Typo";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale } from "@/utils/styling";

export default function Seperator({ text }: { text?: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.separator}>
      <View
        style={[styles.separatorLine, { backgroundColor: theme.gray.surface }]}
      />
      <Typo
        color={theme.text.muted}
        variant="body"
        style={styles.separatorText}>
        {text || "Or"}
      </Typo>
      <View
        style={[styles.separatorLine, { backgroundColor: theme.gray.surface }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    flexDirection: "row",
    alignItems: "center",
  },
  separatorLine: {
    height: 1,
    flex: 1,
  },
  separatorText: {
    paddingHorizontal: horizontalScale(10),
  },
});
