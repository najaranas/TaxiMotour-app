import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const [shortDimenson, longDimension] =
  SCREEN_WIDTH < SCREEN_HEIGHT
    ? [SCREEN_WIDTH, SCREEN_HEIGHT]
    : [SCREEN_HEIGHT, SCREEN_WIDTH];

/**
 * 🔹 horizontalScale(size)
 * Use this for width-related styles:
 * - width
 * - horizontal padding/margin
 * - horizontal positioning (e.g. left/right)
 */
const horizontalScale = (size: number) =>
  (shortDimenson / guidelineBaseWidth) * size;

/**
 * 🔹 verticalScale(size)
 * Use this for height-related styles:
 * - height
 * - vertical padding/margin
 * - vertical positioning (e.g. top/bottom)
 */
const verticalScale = (size: number) =>
  (longDimension / guidelineBaseHeight) * size;

/**
 * 🔹 moderateScale(size)
 * Use this for elements that shouldn't scale too aggressively:
 * - font sizes
 * - border radius
 * - small icons
 */
const moderateScale = (size: number) => size + (horizontalScale(size) - size);

export { horizontalScale, moderateScale, verticalScale };
