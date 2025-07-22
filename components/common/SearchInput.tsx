import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import React, { useRef } from "react";
import { CircleX } from "lucide-react-native";
import Button from "@/components/common/Button";
import Typo from "@/components/common/Typo";
import { COLORS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";

export interface SearchInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  showClearButton?: boolean;
  containerStyle?: any;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  inputStyle?: any;
  labelColor?: string;
  clearIconColor?: string;
}

export default function SearchInput({
  label,
  value,
  onChangeText,
  placeholder,
  isFocused = false,
  onFocus,
  onBlur,
  onClear,
  showClearButton = true,
  containerStyle,
  keyboardType,
  autoCapitalize,
  inputStyle,
  labelColor,
  clearIconColor = COLORS.gray["600"],
}: SearchInputProps) {
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const handleClear = () => {
    onChangeText("");
    onClear?.();
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Button activeOpacity={1} onPress={focusInput}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused ? theme.button.primary : theme.input.border,
            borderRadius: theme.borderRadius.medium,
            backgroundColor: theme.input.background,
          },
          containerStyle,
        ]}>
        <View style={styles.inputField}>
          <Typo
            variant="body"
            color={labelColor || theme.input.placeholder}
            size={moderateScale(12)}>
            {label}
          </Typo>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.input.placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            style={[
              styles.textInput,
              { color: theme.text.primary },
              inputStyle,
            ]}
          />
        </View>
        {showClearButton && value.length > 0 && (
          <Button onPress={handleClear}>
            <CircleX
              color={clearIconColor}
              strokeWidth={1.5}
              size={moderateScale(25)}
            />
          </Button>
        )}
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingInline: horizontalScale(15),
    paddingBlock: horizontalScale(8),
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: horizontalScale(10),
  },
  inputField: {
    flex: 1,
    gap: verticalScale(5),
  },
  textInput: {
    paddingTop: verticalScale(0),
    paddingBottom: verticalScale(0),
    paddingLeft: verticalScale(5),
    paddingRight: verticalScale(0),
    fontSize: moderateScale(16),
  },
});
