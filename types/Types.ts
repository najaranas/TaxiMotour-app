import React from "react";
import { ViewStyle, StyleProp, TextStyle } from "react-native";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  padding?: number;
  safeArea?: boolean;
}

interface TypoProps {
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

export { ScreenWrapperProps, TypoProps, SvgIconProps };
