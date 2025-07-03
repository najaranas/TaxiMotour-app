import { SvgIconProps } from "@/types/Types";
import Svg, { Path, Circle } from "react-native-svg";

// Tunisia Flag SVG
export function TunisiaFlag({ width = 24, height = 24 }: SvgIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 36 36"
      style={{ borderRadius: 2 }}>
      {/* Red background */}
      <Path
        fill="#E70013"
        d="M32 5H4a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z"
      />

      {/* White circle */}
      <Circle fill="#FFF" cx="18" cy="18" r="6.5" />

      {/* Red crescent */}
      <Path
        fill="#E70013"
        d="M15.4 18a3.9 3.9 0 0 1 6.541-2.869a4.875 4.875 0 1 0 0 5.738A3.9 3.9 0 0 1 15.4 18z"
      />

      {/* Red star */}
      <Path
        fill="#E70013"
        d="M19.645 16.937l-1.249-1.719v2.125L16.375 18l2.021.657v2.125l1.249-1.719l2.021.656L20.417 18l1.249-1.719z"
      />
    </Svg>
  );
}

// Phone Icon
export function PhoneIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
      />
    </Svg>
  );
}

// Location Pin Icon
export function LocationIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
      />
    </Svg>
  );
}

// Car Icon (for taxi)
export function CarIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
      />
    </Svg>
  );
}

// User/Profile Icon
export function UserIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </Svg>
  );
}

// Eye Icon (for show/hide password)
export function EyeIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
      />
    </Svg>
  );
}

// Arrow Right Icon
export function ArrowRightIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
      />
    </Svg>
  );
}

// Back/Arrow Left Icon
export function ArrowLeftIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      />
    </Svg>
  );
}

// Star Icon (for ratings)
export function StarIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </Svg>
  );
}

// Clock/Time Icon
export function ClockIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
      />
      <Path fill={color} d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </Svg>
  );
}

// Money/Cash Icon
export function MoneyIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
      />
    </Svg>
  );
}

// Export all icons as a collection
export const SvgIcons = {
  TunisiaFlag,
  PhoneIcon,
  LocationIcon,
  CarIcon,
  UserIcon,
  EyeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  StarIcon,
  ClockIcon,
  MoneyIcon,
};

export default SvgIcons;
