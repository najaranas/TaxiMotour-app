import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { CloseIcon, SearchIcon } from "@/components/common/SvgIcons";
import { COLORS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { geocodingService } from "@/services/api";
import Button from "../common/Button";
import { useTheme } from "@/contexts/ThemeContext";

interface LocationData {
  place?: string;
  lon?: number | null;
  lat?: number | null;
}

interface LocationSearchInputProps {
  placeholder: string;
  value: LocationData | string;
  onValueChange: (value: LocationData) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
  inputRef?: React.RefObject<TextInput | null>;
  onSearchDataChange?: (data: any) => void;
  setIsDataLoading?: (state: boolean) => void;
}

export default function LocationSearchInput({
  placeholder,
  value,
  onValueChange,
  onFocus,
  onBlur,
  isFocused = false,
  inputRef,
  onSearchDataChange,
  setIsDataLoading,
}: LocationSearchInputProps) {
  const handleTextChange = async (text: string) => {
    onValueChange({ place: text, lon: null, lat: null });
    await fetchSuggestions(text);
  };

  const { theme } = useTheme();

  const fetchSuggestions = async (text: string) => {
    if (!text) return;
    setIsDataLoading?.(true);
    try {
      const data = await geocodingService.fetchSuggestions(text);
      onSearchDataChange?.(data);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsDataLoading?.(false);
    }
  };

  const displayValue = typeof value === "string" ? value : value.place || "";

  return (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: theme.input.background,
          borderColor: isFocused ? COLORS.secondary : "transparent",
        },
      ]}>
      <SearchIcon color={theme.text.secondary} size={horizontalScale(20)} />
      <TextInput
        ref={inputRef}
        value={displayValue}
        onChangeText={handleTextChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.input.placeholder}
        style={[styles.textInput, { color: theme.text.primary }]}
      />
      <Button
        onPress={() => {
          onValueChange({
            place: "",
            lon: null,
            lat: null,
          });
          onSearchDataChange?.([]);
          inputRef?.current?.focus();
        }}>
        <CloseIcon color={theme.text.secondary} size={horizontalScale(15)} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingVertical: verticalScale(6),
    paddingInline: horizontalScale(10),
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    borderWidth: 2,
  },
  textInput: {
    fontSize: moderateScale(16),
    fontFamily: "Roboto-Regular",
    flex: 1,
  },
});
