import { LucideIcon } from "lucide-react-native";
import * as React from "react";
import {
  ViewStyle,
  StyleProp,
  TextStyle,
  ScrollViewProps,
  TextProps,
  StatusBarStyle,
} from "react-native";
import { SystemBarStyle } from "react-native-edge-to-edge";

export interface ScreenWrapperProps extends ScrollViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  padding?: number;
  safeArea?: boolean;
  scroll?: boolean;
  systemBarsStyle?: SystemBarStyle;
  statusBarStyle?: StatusBarStyle;
  hasBottomTabs?: boolean;
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
  snapPoints?: (string | number)[];
  enablePanDownToClose?: boolean;
  showIndicator?: boolean;
  enableOverDrag?: boolean;
  enableContentPanningGesture?: boolean;
  index?: number;
  zindex?: number;
  style?: StyleProp<ViewStyle>;
  onChange?: (index: number) => void;
  onClose?: () => void;
  onRef?: (methods: BottomSheetMethods) => void;
  showBackdrop?: boolean; // Control whether to show backdrop overlay
}

export interface BottomSheetMethods {
  snapToIndex: (index: number) => void;
  snapToPosition: (position: string | number) => void;
  expand: () => void;
  collapse: () => void;
  close: () => void;
  forceClose: () => void;
  present?: () => void; // For BottomSheetModal
  dismiss?: () => void; // For BottomSheetModal
  ref: any;
}

export interface ProfileMenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  rightComponent?: React.ReactNode;
  isDanger?: boolean;
}

export interface ProfileMenuItemConfig {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon; // Lucide icon component
  route?: string;
  type: "navigation" | "action" | "toggle";
  action?: string;
  isDanger?: boolean;
}

export interface LogoutBottomSheetProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
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

export interface RouteData {
  type: "FeatureCollection";
  bbox?:
    | [number, number, number, number]
    | [number, number, number, number, number, number];
  features: {
    type: "Feature";
    properties: Record<string, any>;
    geometry: {
      type: "LineString";
      coordinates: number[][];
    };
  }[];
  metadata?: any;
}

export interface locationProp {
  place?: string;
  lon?: number | null;
  lat?: number | null;
}

export interface MapProps {
  roadData?: locationProp[];
  viewPadding?: {
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
  };
}

export type ThemeType = {
  background: string;
  surface: string;
  card: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  borderRadius: {
    none: number;
    small: number;
    medium: number;
    large: number;
    pill: number;
    circle: number;
  };
  borderWidth: {
    none: number;
    thin: number;
    regular: number;
    thick: number;
    extraThick: number;
  };
  button: {
    primary: string;
    secondary: string;
    text: string;
  };
  input: {
    background: string;
    border: string;
    text: string;
    placeholder: string;
  };
  status: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  skeleton: {
    backgroundColor: string;
    highlightColor: string;
  };
  gray: {
    background: string;
    surface: string;
    border: string;
    text: string;
    mutedText: string;
    placeholder: string;
  };
};

export type ThemeContextType = {
  themeName: "light" | "dark";
  theme: ThemeType;
  setTheme: (theme: "light" | "dark") => void;
};

// Ride status enum
export type RideStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

// Payment method enum
export type PaymentMethod = "cash" | "card" | "mobile_wallet" | "bank_transfer";

// Complete ride type based on Supabase schema
export type RideProps = {
  ride_id?: string; // UUID from Supabase
  passenger_id: string;
  driver_id: string;
  pickup_address: string;
  pickup_lat: string;
  pickup_lon: string;
  destination_address: string;
  destination_lat: string;
  destination_lon: string;
  ride_fare?: string;
  distance?: string; // in kilometers
  duration?: string; // in seconds
  status: RideStatus;
  feedback?: string | null;
  payment_method?: PaymentMethod;
  created_at?: string; // ISO string timestamp
  updated_at?: string; // ISO string timestamp
};

// Simplified ride type for UI components (backward compatibility)
export type SimpleRideProps = {
  id: number;
  pickupAddress: string;
  destinationAddress: string;
  payment?: string;
  distance?: string;
};

// Union type for ride card component

export type RideCardProps = {
  ride: RideProps;
  viewOnly?: boolean;
  hideExtraDetails?: boolean;
};

export type DriverDataType = {
  moto_type?: string;
  phone_number?: string;
  full_name?: string;
  profile_image_url?: string;
};

export type DriverInfoProps = {
  driverData: DriverDataType | null;
};

export interface userDataType {
  id?: string;
  email_address?: string;
  phone_number?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  experience_years?: string;
  moto_type?: string;
  user_type?: "driver" | "passenger";
  profile_image_url?: string;
}

export interface RideRequestCardProps {
  rideRequestData: {
    ride_id?: string;
    pickup_address?: string;
    destination_address?: string;
    passengerImg?: string;
    name?: string;
    duration?: string;
    distance?: string;
    ride_fare?: string;
    phone_number?: string;
  };

  removeCardFromRequestedRides?: (ride_id: string) => void;
  removeOtherFromRequestedRides?: (ride_id: string) => void;
}
export interface PassengerAceptedCardProps {
  acceptedRideData: {
    ride_id?: string;
    status?: RideStatus;
    pickup_address?: string;
    destination_address?: string;
    riderImg?: string;
    name?: string;
    moto_type?: string;
    duration?: string;
    distance?: string;
    ride_fare?: string;
    phone_number?: string;
  };
}
