import React from "react";
import { ViewStyle, StyleProp, TextStyle } from "react-native";

export interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  padding?: number;
  safeArea?: boolean;
}

export interface TypoProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  fontFamily?: TextStyle["fontFamily"];
  size?: number;
  color?: string;
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "button";
}

export interface SvgIconProps {
  size?: number;
  color?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  disabled?: boolean;
  loading?: boolean;
  indicatorStyle?: { size?: number; color?: string };
  onPress: () => void;
}
export interface ConfirmationCodeFieldProps {
  digitCount: number;
  onCodeComplete?: (code: string) => void;
  onCodeChange?: (code: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface CustomDrawerProps {
  children: React.ReactNode;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
}
