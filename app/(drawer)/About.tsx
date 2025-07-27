import React, { useEffect, useMemo } from "react";
import { View, StyleSheet, Share } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { APP_CONFIG } from "@/constants/app";
import Typo from "@/components/common/Typo";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { horizontalScale, verticalScale } from "@/utils/styling";
import { CheckCircle, Info } from "lucide-react-native";
import BackButton from "@/components/common/BackButton";
import * as Sharing from "expo-sharing";

export default function About() {
  const { theme } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      sectionCard: {
        backgroundColor: theme.surface,
        borderRadius: theme.borderRadius.large,
        borderWidth: theme.borderWidth.thin,
        borderColor: theme.gray.border,
        padding: horizontalScale(16),
        marginBottom: verticalScale(20),
        gap: verticalScale(10),
      },
      icon: {
        marginRight: horizontalScale(8),
      },
    }),
    [theme]
  );

  return (
    <ScreenWrapper safeArea scroll showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <BackButton variant="arrow" />
        {/* Header */}
        <View style={styles.headerBox}>
          <Typo variant="h1" color={theme.text.primary}>
            About {APP_CONFIG.APP_NAME}
          </Typo>
          <Typo variant="body" color={theme.text.secondary}>
            Your trusted ride companion.
          </Typo>
        </View>

        {/* What is Taximoto */}
        <View style={dynamicStyles.sectionCard}>
          <Typo variant="h3" color={theme.text.primary}>
            What is {APP_CONFIG.APP_NAME}?
          </Typo>
          <Typo variant="body" color={theme.text.secondary}>
            {APP_CONFIG.APP_NAME} is a ride-hailing app designed for fast and
            safe motorcycle transportation. We aim to simplify urban mobility
            for both passengers and drivers.
          </Typo>
        </View>

        {/* Features */}
        <View style={dynamicStyles.sectionCard}>
          <Typo variant="h3" color={theme.text.primary}>
            Key Features
          </Typo>

          {[
            "Quick ride booking & tracking",
            "Secure payments and wallet",
            "Arabic & French language support",
            "Driver reviews and ratings",
            "24/7 customer service",
          ].map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <CheckCircle
                color={theme.button.primary}
                size={16}
                style={dynamicStyles.icon}
              />
              <Typo variant="body" color={theme.text.secondary}>
                {feature}
              </Typo>
            </View>
          ))}
        </View>

        {/* Vision */}
        <View style={dynamicStyles.sectionCard}>
          <Typo variant="h3" color={theme.text.primary}>
            Our Vision
          </Typo>
          <Typo variant="body" color={theme.text.secondary}>
            We envision a connected, sustainable transport system that empowers
            local communities. {APP_CONFIG.APP_NAME} is committed to accessible
            mobility and driver empowerment.
          </Typo>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Typo variant="caption" color={theme.text.muted}>
            Version {APP_CONFIG.APP_VERSION}
          </Typo>
          <Typo variant="caption" color={theme.text.muted}>
            Created by {APP_CONFIG.CREATOR_NAME}
          </Typo>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: horizontalScale(20),
    paddingBottom: 0,
  },
  headerBox: {
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(5),
  },
  footer: {
    alignItems: "center",
    gap: verticalScale(4),
  },
});
