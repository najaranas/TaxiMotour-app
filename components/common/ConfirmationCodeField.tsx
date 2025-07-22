import { StyleSheet, TextInput, View } from "react-native";
import React, { useState, useRef } from "react";
import { COLORS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { moderateScale } from "@/utils/styling";
import Typo from "./Typo";
import { ConfirmationCodeFieldProps } from "@/types/Types";

export default function ConfirmationCodeField({
  digitCount = 4,
  onCodeComplete,
  onCodeChange,
  disabled = false,
  autoFocus = false,
  containerStyle,
}: ConfirmationCodeFieldProps) {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const hiddenInputRef = useRef<TextInput>(null);
  const { theme } = useTheme();

  const dynamicStyles = StyleSheet.create({
    digitCell: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: moderateScale(15),
      borderWidth: theme.borderWidth.thick,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: COLORS.white,
    },
  });

  // Generate array of digit positions
  const digitPositions = Array.from(
    { length: digitCount },
    (_, index) => index
  );

  // Handle code input changes
  const handleCodeChange = (newCode: string) => {
    // Only allow numeric input
    const numericCode = newCode.replace(/[^0-9]/g, "");

    // Limit to digitCount length
    const truncatedCode = numericCode.slice(0, digitCount);

    setVerificationCode(truncatedCode);

    // Call onChange callback
    onCodeChange?.(truncatedCode);

    // Call onComplete callback when code is full
    if (truncatedCode.length === digitCount) {
      onCodeComplete?.(truncatedCode);
    }
  };

  // Handle digit cell press to focus input
  const handleDigitCellPress = () => {
    if (!disabled) {
      hiddenInputRef.current?.focus();
    }
  };

  // Get current active digit index
  const getActiveDigitIndex = () => verificationCode.length;

  // Get digit value at specific position
  const getDigitValue = (index: number) => verificationCode[index] || "";

  // Determine border color for digit cell
  const getDigitCellBorderColor = (index: number) => {
    const activeIndex = getActiveDigitIndex();

    if (disabled) {
      return COLORS.gray[200];
    }

    if (index === activeIndex) {
      return COLORS.secondary;
    }

    return COLORS.gray[200];
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Visible digit cells */}
      <View style={styles.digitCellsContainer}>
        {digitPositions.map((position) => {
          const isActive = getActiveDigitIndex() === position;
          return (
            <View
              key={position}
              style={[
                dynamicStyles.digitCell,
                {
                  borderColor: getDigitCellBorderColor(position),
                  opacity: disabled ? 0.5 : 1,
                  backgroundColor: theme.input.background || COLORS.white,
                },
              ]}
              onTouchEnd={handleDigitCellPress}>
              <Typo variant="h3" color={theme.text.primary}>
                {isActive ? "|" : getDigitValue(position)}
              </Typo>
            </View>
          );
        })}
      </View>

      {/* Hidden text input for actual input handling */}
      <TextInput
        ref={hiddenInputRef}
        value={verificationCode}
        style={styles.hiddenInput}
        onChangeText={handleCodeChange}
        keyboardType="numeric"
        maxLength={digitCount}
        autoFocus={autoFocus}
        editable={!disabled}
        caretHidden={true}
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  digitCellsContainer: {
    flexDirection: "row",
    gap: moderateScale(5),
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    fontSize: 1, // Minimal size to avoid layout issues
  },
});
