import React from "react";
import {
  ViewStyle,
  StyleProp,
  TextStyle,
  ScrollViewProps,
  Text,
  TextProps,
} from "react-native";

export interface ScreenWrapperProps extends ScrollViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  padding?: number;
  safeArea?: boolean;
  scroll?: boolean;
}

export interface TypoProps extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  fontFamily?: TextStyle["fontFamily"];
  size?: number;
  numberOfLines?: number;
  color?: string;
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "button";
}

export interface SvgIconProps {
  size?: number;
  color?: string;
  bold?: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  disabled?: boolean;
  loading?: boolean;
  indicatorStyle?: { size?: number; color?: string };
  onPress?: () => void;
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
export interface CustomBottomSheetProps {
  children: React.ReactNode;
  snapPoints: (string | number)[];
  enablePanDownToClose?: boolean;
  showIndicator?: boolean;
  enableOverDrag?: boolean;
  enableContentPanningGesture?: boolean;
  style?: StyleProp<ViewStyle>;
  onChange?: (index: number) => void;
  onRef?: (methods: {
    snapToIndex: (index: number) => void;
    snapToPosition: (position: string | number) => void;
    expand: () => void;
    collapse: () => void;
    close: () => void;
    forceClose: () => void;
    ref: any;
  }) => void;
}

// MapTiler Geocoding API Types
export interface MapTilerGeometry {
  type: string;
  coordinates: [number, number];
}

export interface MapTilerContext {
  ref: string;
  id: string;
  text: string;
  country_code?: string;
  wikidata?: string;
  kind?: string;
  language?: string;
  text_fr?: string;
  language_fr?: string;
  categories?: string[];
  "osm:tags"?: Record<string, string>;
  place?: string;
  street?: string;
  addressnumber?: string;
}

export interface MapTilerProperties {
  ref: string;
  country_code: string;
  wikidata?: string;
  kind: string;
  "osm:place_type"?: string;
  place_type_name: (string | null)[];
}

export interface MapTilerFeature {
  type: "Feature";
  properties: MapTilerProperties;
  geometry: MapTilerGeometry;
  bbox: [number, number, number, number];
  center: [number, number];
  place_name: string;
  place_type: string[];
  relevance: number;
  id: string;
  text: string;
  place_type_name: (string | null)[];
  context: MapTilerContext[];
  language: string;
  text_fr: string;
  language_fr: string;
  place_name_fr: string;
}

export interface MapTilerGeocodingResponse {
  type: "FeatureCollection";
  features: MapTilerFeature[];
  query: string[];
  attribution: string;
}

export interface locationProp {
  place?: string;
  lon?: number | null;
  lat?: number | null;
}

export interface MapProps {
  roadData?: locationProp[];
}
