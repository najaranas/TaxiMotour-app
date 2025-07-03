import { SvgIconProps } from "@/types/Types";
import Svg, { Path, Circle } from "react-native-svg";

// Tunisia Flag SVG
export function TunisiaFlag({ width = 24, height = 24 }: SvgIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 36 36"
      aria-hidden={true}
      role="img"
      preserveAspectRatio="xMidYMid meet">
      <Path
        fill="#E70013"
        d="M32 5H4a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z"
      />
      <Circle fill="#FFF" cx="18" cy="18" r="6.5" />
      <Path
        fill="#E70013"
        d="M15.4 18a3.9 3.9 0 0 1 6.541-2.869a4.875 4.875 0 1 0 0 5.738A3.9 3.9 0 0 1 15.4 18z"
      />
      <Path
        fill="#E70013"
        d="M19.645 16.937l-1.249-1.719v2.125L16.375 18l2.021.657v2.125l1.249-1.719l2.021.656L20.417 18l1.249-1.719z"
      />
    </Svg>
  );
}

export function GoolgeIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg x="0px" y="0px" width={width} height={height} viewBox="0 0 48 48">
      <Path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></Path>
      <Path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></Path>
      <Path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></Path>
      <Path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></Path>
    </Svg>
  );
}

export function FacebookIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg x="0px" y="0px" width={width} height={height} viewBox="0 0 48 48">
      <Path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></Path>
      <Path
        fill="#fff"
        d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></Path>
    </Svg>
  );
}

// Car Icon (for taxi)
export function AppleIcon({
  width = 24,
  height = 24,
  color = "#000000",
}: SvgIconProps) {
  return (
    <Svg x="0px" y="0px" width={width} height={height} viewBox="0 0 50 50">
      <Path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></Path>
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
