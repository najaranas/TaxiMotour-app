import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { COLORS } from "@/constants/theme";
import { useTranslation } from "react-i18next";

export default function EarningsScreen() {
  const { t } = useTranslation();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>{t("earnings.title")}</Text>
        <Text style={styles.subtitle}>{t("earnings.subtitle")}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: "center",
  },
});
