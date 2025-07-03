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
  width?: number;
  height?: number;
  color?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  disabled?: boolean;
  onPress: () => void;
}
