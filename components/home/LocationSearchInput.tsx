import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { CloseIcon, SearchIcon } from "@/components/common/SvgIcons";
import { COLORS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { geocodingService } from "@/services/api";
import Button from "../common/Button";

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
}: LocationSearchInputProps) {
  const handleTextChange = async (text: string) => {
    onValueChange({ place: text, lon: null, lat: null });
    await fetchSuggestions(text);
  };

  const fetchSuggestions = async (text: string) => {
    if (!text) return;
    try {
      const data = await geocodingService.fetchSuggestions(text);
      onSearchDataChange?.(data);
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const displayValue = typeof value === "string" ? value : value.place || "";

  return (
    <View
      style={[
        styles.inputContainer,
        {
          borderColor: isFocused ? COLORS.secondary : "transparent",
        },
      ]}>
      <SearchIcon size={horizontalScale(20)} />
      <TextInput
        ref={inputRef}
        value={displayValue}
        onChangeText={handleTextChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        style={styles.textInput}
      />
      <Button
        onPress={() => {
          onValueChange({
            place: "",
            lon: null,
            lat: null,
          });
          inputRef?.current?.focus();
        }}>
        <CloseIcon size={horizontalScale(15)} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: COLORS.gray["100"],
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
