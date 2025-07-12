import { SvgIconProps } from "@/types/Types";
import Svg, { Path, Circle, G } from "react-native-svg";

// Tunisia Flag SVG
export function TunisiaFlag({ size = 24 }: SvgIconProps) {
  return (
    <Svg
      width={size}
      height={size}
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

export function GoolgeIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg x="0px" y="0px" width={size} height={size} viewBox="0 0 48 48">
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

export function FacebookIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg x="0px" y="0px" width={size} height={size} viewBox="0 0 48 48">
      <Path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></Path>
      <Path
        fill="#fff"
        d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></Path>
    </Svg>
  );
}

export function AppleIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg x="0px" y="0px" width={size} height={size} viewBox="0 0 50 50">
      <Path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></Path>
    </Svg>
  );
}

export function LeftArrowIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.3508 12.7499L11.2096 17.4615L10.1654 18.5383L3.42264 11.9999L10.1654 5.46148L11.2096 6.53833L6.3508 11.2499L21 11.2499L21 12.7499L6.3508 12.7499Z"
          fill={color}
        />
        {/* Bolder arrow by overlaying a thicker Path */}
        <Path
          d="M6.5 13L11.5 17.5L10.2 18.8L3 12L10.2 5.2L11.5 6.5L6.5 11H21V13H6.5Z"
          fill={color}
          opacity={0.5}
        />
      </G>
    </Svg>
  );
}

export function WhatsappIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg x="0px" y="0px" width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#40c351"
        d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></Path>
      <Path
        fill="#fff"
        fill-rule="evenodd"
        d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
        clip-rule="evenodd"></Path>
    </Svg>
  );
}

export function EditIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <Path
          d="M18.3785 8.44975L11.4637 15.3647C11.1845 15.6439 10.8289 15.8342 10.4417 15.9117L7.49994 16.5L8.08829 13.5582C8.16572 13.1711 8.35603 12.8155 8.63522 12.5363L15.5501 5.62132M18.3785 8.44975L19.7927 7.03553C20.1832 6.64501 20.1832 6.01184 19.7927 5.62132L18.3785 4.20711C17.988 3.81658 17.3548 3.81658 16.9643 4.20711L15.5501 5.62132M18.3785 8.44975L15.5501 5.62132"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"></Path>
        <Path
          d="M5 20H19"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"></Path>
      </G>
    </Svg>
  );
}

export function MenuIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg x="0px" y="0px" width={size} height={size} viewBox="0 0 50 50">
      <Path
        fill={color}
        d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></Path>
    </Svg>
  );
}

export function CloseIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg x="0px" y="0px" width={size} height={size} viewBox="0 0 50 50">
      <Path
        fill={color}
        d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></Path>
    </Svg>
  );
}

export function UserIcon({ size = 24, bold, color = "#000000" }: SvgIconProps) {
  return bold ? (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="6" r="4" fill={color} />
      <Path
        d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
        fill={color}
      />
    </Svg>
  ) : (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="6" r="4" stroke={color} strokeWidth={1.5} />
      <Path
        d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export function HistoryIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <Path
          d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195"
          stroke={color}
          stroke-width="1.5"></Path>
        <Path
          d="M10.5 14L17 14"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"></Path>
        <Path
          d="M7 14H7.5"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"></Path>
        <Path
          d="M7 10.5H7.5"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"></Path>
        <Path
          d="M7 17.5H7.5"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"></Path>
        <Path
          d="M10.5 10.5H17"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"></Path>
        <Path
          d="M10.5 17.5H17"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"></Path>
        <Path
          d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
          stroke={color}
          stroke-width="1.5"></Path>
      </G>
    </Svg>
  );
}

export function AboutIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <Circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          stroke-width="1.5"></Circle>
        <Path d="M12 17V11" stroke={color}></Path>
        <Circle
          cx="1"
          cy="1"
          r="1"
          transform="matrix(1 0 0 -1 11 9)"
          fill={color}></Circle>
      </G>
    </Svg>
  );
}

export function SafetyIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <Path
          d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167C21 10.8996 21 11.4234 21 11.9914C21 17.6294 16.761 20.3655 14.1014 21.5273C13.38 21.8424 13.0193 22 12 22C10.9807 22 10.62 21.8424 9.89856 21.5273C7.23896 20.3655 3 17.6294 3 11.9914C3 11.4234 3 10.8996 3 10.4167Z"
          stroke={color}
          stroke-width="1.5"></Path>
        <Path
          d="M9.5 12.4L10.9286 14L14.5 10"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"></Path>
      </G>
    </Svg>
  );
}

export function SettingIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <Circle
          cx="12"
          cy="12"
          r="3"
          stroke={color}
          stroke-width="1.5"></Circle>
        <Path
          d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z"
          stroke={color}
          stroke-width="1.5"></Path>
      </G>
    </Svg>
  );
}

export function HomeIcon({ size = 24, bold, color = "#000000" }: SvgIconProps) {
  return (
    <>
      {bold ? (
        <Svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274ZM9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
            fill={color}
          />
        </Svg>
      ) : (
        <Svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
          <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
          <G
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"></G>
          <G id="SVGRepo_iconCarrier">
            <Path
              opacity="0.5"
              d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
              stroke={color}
              stroke-width="1.5"></Path>
            <Path
              d="M15 18H9"
              stroke={color}
              stroke-width="1.5"
              stroke-linecap="round"></Path>
          </G>
        </Svg>
      )}
    </>
  );
}

export function BagIcon({ size = 24, bold, color = "#000000" }: SvgIconProps) {
  return bold ? (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.052 1.25H11.948C11.0495 1.24997 10.3003 1.24995 9.70552 1.32991C9.07773 1.41432 8.51093 1.59999 8.05546 2.05546C7.59999 2.51093 7.41432 3.07773 7.32991 3.70552C7.27259 4.13189 7.25637 5.15147 7.25179 6.02566C5.22954 6.09171 4.01536 6.32778 3.17157 7.17157C2 8.34315 2 10.2288 2 14C2 17.7712 2 19.6569 3.17157 20.8284C4.34314 22 6.22876 22 9.99998 22H14C17.7712 22 19.6569 22 20.8284 20.8284C22 19.6569 22 17.7712 22 14C22 10.2288 22 8.34315 20.8284 7.17157C19.9846 6.32778 18.7705 6.09171 16.7482 6.02566C16.7436 5.15147 16.7274 4.13189 16.6701 3.70552C16.5857 3.07773 16.4 2.51093 15.9445 2.05546C15.4891 1.59999 14.9223 1.41432 14.2945 1.32991C13.6997 1.24995 12.9505 1.24997 12.052 1.25ZM15.2479 6.00188C15.2434 5.15523 15.229 4.24407 15.1835 3.9054C15.1214 3.44393 15.0142 3.24644 14.8839 3.11612C14.7536 2.9858 14.5561 2.87858 14.0946 2.81654C13.6116 2.7516 12.964 2.75 12 2.75C11.036 2.75 10.3884 2.7516 9.90539 2.81654C9.44393 2.87858 9.24644 2.9858 9.11612 3.11612C8.9858 3.24644 8.87858 3.44393 8.81654 3.9054C8.771 4.24407 8.75661 5.15523 8.75208 6.00188C9.1435 6 9.55885 6 10 6H14C14.4412 6 14.8565 6 15.2479 6.00188ZM12 9.25C12.4142 9.25 12.75 9.58579 12.75 10V10.0102C13.8388 10.2845 14.75 11.143 14.75 12.3333C14.75 12.7475 14.4142 13.0833 14 13.0833C13.5858 13.0833 13.25 12.7475 13.25 12.3333C13.25 11.9493 12.8242 11.4167 12 11.4167C11.1758 11.4167 10.75 11.9493 10.75 12.3333C10.75 12.7174 11.1758 13.25 12 13.25C13.3849 13.25 14.75 14.2098 14.75 15.6667C14.75 16.857 13.8388 17.7155 12.75 17.9898V18C12.75 18.4142 12.4142 18.75 12 18.75C11.5858 18.75 11.25 18.4142 11.25 18V17.9898C10.1612 17.7155 9.25 16.857 9.25 15.6667C9.25 15.2525 9.58579 14.9167 10 14.9167C10.4142 14.9167 10.75 15.2525 10.75 15.6667C10.75 16.0507 11.1758 16.5833 12 16.5833C12.8242 16.5833 13.25 16.0507 13.25 15.6667C13.25 15.2826 12.8242 14.75 12 14.75C10.6151 14.75 9.25 13.7903 9.25 12.3333C9.25 11.143 10.1612 10.2845 11.25 10.0102V10C11.25 9.58579 11.5858 9.25 12 9.25Z"
        fill={color}
      />
    </Svg>
  ) : (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 14C2 10.2288 2 8.34315 3.17157 7.17157C4.34315 6 6.22876 6 10 6H14C17.7712 6 19.6569 6 20.8284 7.17157C22 8.34315 22 10.2288 22 14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14Z"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M16 6C16 4.11438 16 3.17157 15.4142 2.58579C14.8284 2 13.8856 2 12 2C10.1144 2 9.17157 2 8.58579 2.58579C8 3.17157 8 4.11438 8 6"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M12 17.3333C13.1046 17.3333 14 16.5871 14 15.6667C14 14.7462 13.1046 14 12 14C10.8954 14 10 13.2538 10 12.3333C10 11.4129 10.8954 10.6667 12 10.6667M12 17.3333C10.8954 17.3333 10 16.5871 10 15.6667M12 17.3333V18M12 10V10.6667M12 10.6667C13.1046 10.6667 14 11.4129 14 12.3333"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MotoIcon({ size = 24, bold, color = "#000000" }: SvgIconProps) {
  return bold ? (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Wheels */}
      <Circle cx="6" cy="18" r="2" fill={color} />
      <Circle cx="18" cy="18" r="2" fill={color} />
      {/* Body */}
      <Path
        d="M6 18L9 13H11L13 16H15L16 13H18C18 13 19 13.5 19 15C19 16.5 18 18 18 18H13L11 15H9L7 18H6Z"
        fill={color}
      />
    </Svg>
  ) : (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Wheels */}
      <Circle cx="6" cy="18" r="2" stroke={color} strokeWidth={2} />
      <Circle cx="18" cy="18" r="2" stroke={color} strokeWidth={2} />
      {/* Body */}
      <Path
        d="M6 18L9 13H11L13 16H15L16 13H18C18 13 19 13.5 19 15C19 16.5 18 18 18 18H13L11 15H9L7 18H6Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SearchIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <Path
          d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"></Path>
      </G>
    </Svg>
  );
}

export function LocationIcon({
  size = 24,
  bold,
  color = "#000000",
}: SvgIconProps) {
  return bold ? (
    <Svg viewBox="-4 0 32 32" width={size} height={size} fill={color}>
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <G
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd">
          <G
            id="Icon-Set-Filled"
            transform="translate(-106.000000, -413.000000)"
            fill={color}>
            <Path
              d="M118,422 C116.343,422 115,423.343 115,425 C115,426.657 116.343,428 118,428 C119.657,428 121,426.657 121,425 C121,423.343 119.657,422 118,422 L118,422 Z M118,430 C115.239,430 113,427.762 113,425 C113,422.238 115.239,420 118,420 C120.761,420 123,422.238 123,425 C123,427.762 120.761,430 118,430 L118,430 Z M118,413 C111.373,413 106,418.373 106,425 C106,430.018 116.005,445.011 118,445 C119.964,445.011 130,429.95 130,425 C130,418.373 124.627,413 118,413 L118,413 Z"
              id="location"></Path>
          </G>
        </G>
      </G>
    </Svg>
  ) : (
    <Svg viewBox="-4 0 32 32" width={size} height={size} fill={color}>
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <G
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd">
          <G
            id="Icon-Set"
            transform="translate(-104.000000, -411.000000)"
            fill={color}>
            <Path
              d="M116,426 C114.343,426 113,424.657 113,423 C113,421.343 114.343,420 116,420 C117.657,420 119,421.343 119,423 C119,424.657 117.657,426 116,426 L116,426 Z M116,418 C113.239,418 111,420.238 111,423 C111,425.762 113.239,428 116,428 C118.761,428 121,425.762 121,423 C121,420.238 118.761,418 116,418 L116,418 Z M116,440 C114.337,440.009 106,427.181 106,423 C106,417.478 110.477,413 116,413 C121.523,413 126,417.478 126,423 C126,427.125 117.637,440.009 116,440 L116,440 Z M116,411 C109.373,411 104,416.373 104,423 C104,428.018 114.005,443.011 116,443 C117.964,443.011 128,427.95 128,423 C128,416.373 122.627,411 116,411 L116,411 Z"
              id="location"></Path>
          </G>
        </G>
      </G>
    </Svg>
  );
}
export function TopIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <Path
          d="M12 4.5L17 9.5M12 4.5L7 9.5M12 4.5C12 4.5 12 12.8333 12 14.5C12 16.1667 11 19.5 7 19.5"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"></Path>
      </G>
    </Svg>
  );
}

export function TargetIcon({ size = 24, color = "#000000" }: SvgIconProps) {
  return (
    <Svg viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></G>
      <G id="SVGRepo_iconCarrier">
        <G
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd">
          <G
            id="Dribbble-Light-Preview"
            transform="translate(-220.000000, -4759.000000)"
            fill={color}>
            <G id="icons" transform="translate(56.000000, 160.000000)">
              <Path
                d="M176,4609 C176,4610.105 175.105,4611 174,4611 C172.895,4611 172,4610.105 172,4609 C172,4607.895 172.895,4607 174,4607 C175.105,4607 176,4607.895 176,4609 M174,4613 C171.794,4613 170,4611.206 170,4609 C170,4606.794 171.794,4605 174,4605 C176.206,4605 178,4606.794 178,4609 C178,4611.206 176.206,4613 174,4613 M174,4603 C170.686,4603 168,4605.686 168,4609 C168,4612.314 170.686,4615 174,4615 C177.314,4615 180,4612.314 180,4609 C180,4605.686 177.314,4603 174,4603 M174,4617 C169.589,4617 166,4613.411 166,4609 C166,4604.589 169.589,4601 174,4601 C178.411,4601 182,4604.589 182,4609 C182,4613.411 178.411,4617 174,4617 M174,4599 C168.477,4599 164,4603.477 164,4609 C164,4614.523 168.477,4619 174,4619 C179.523,4619 184,4614.523 184,4609 C184,4603.477 179.523,4599 174,4599"
                id="target-[#784]"></Path>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
}
