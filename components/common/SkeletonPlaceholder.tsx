import React, {
  useEffect,
  cloneElement,
  Children,
  isValidElement,
} from "react";
import { View, StyleSheet, Dimensions, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
const { width: screenWidth } = Dimensions.get("window");

// Type definitions
interface SkeletonPlaceholderProps {
  children: React.ReactNode;
  animationType?: "shimmer" | "pulse" | "wave" | "breathing";
  speed?: number;
  backgroundColor?: string;
  highlightColor?: string;
  enabled?: boolean;
  direction?: "left" | "right";
}

interface SkeletonItemProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

type AnimationType = "shimmer" | "pulse" | "wave" | "breathing";

// Context for sharing animation values
const SkeletonContext = React.createContext<{
  animationType: AnimationType;
  speed: number;
  backgroundColor: string;
  highlightColor: string;
  enabled: boolean;
  direction: "left" | "right";
}>({
  animationType: "shimmer",
  speed: 1000,
  backgroundColor: "#E1E9EE",
  highlightColor: "rgba(255,255,255,0.6)",
  enabled: true,
  direction: "left",
});

// Shimmer animation component
const ShimmerAnimation: React.FC<{
  children: React.ReactNode;
  style: ViewStyle;
  speed: number;
  highlightColor: string;
  direction: "left" | "right";
}> = ({ children, style, speed, highlightColor, direction }) => {
  const translateX: SharedValue<number> = useSharedValue(
    direction === "left" ? -screenWidth : screenWidth
  );

  useEffect(() => {
    const startValue = direction === "left" ? -screenWidth : screenWidth;
    const endValue = direction === "left" ? screenWidth : -screenWidth;

    translateX.value = withRepeat(
      withTiming(endValue, { duration: speed * 1.5 }),
      -1,
      false
    );
  }, [translateX, speed, direction]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[style, { overflow: "hidden" }]}>
      {children}
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle]}>
        <LinearGradient
          colors={["transparent", highlightColor, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

// Pulse animation component
const PulseAnimation: React.FC<{
  children: React.ReactNode;
  style: ViewStyle;
  speed: number;
}> = ({ children, style, speed }) => {
  const opacity: SharedValue<number> = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: speed }), -1, true);
  }, [opacity, speed]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};

// Wave animation component
const WaveAnimation: React.FC<{
  children: React.ReactNode;
  style: ViewStyle;
  speed: number;
  backgroundColor: string;
}> = ({ children, style, speed, backgroundColor }) => {
  const progress: SharedValue<number> = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: speed * 2 }),
      -1,
      false
    );
  }, [progress, speed]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundOpacity = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0.3, 0.8, 0.3],
      Extrapolation.CLAMP
    );

    // Extract RGB values from hex color
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${backgroundOpacity})`,
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};

// Breathing animation component
const BreathingAnimation: React.FC<{
  children: React.ReactNode;
  style: ViewStyle;
  speed: number;
}> = ({ children, style, speed }) => {
  const scale: SharedValue<number> = useSharedValue(1);
  const opacity: SharedValue<number> = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.02, { duration: speed * 1.2 }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(0.8, { duration: speed * 1.2 }),
      -1,
      true
    );
  }, [scale, opacity, speed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};

// Individual skeleton item that wraps any View
const SkeletonItem: React.FC<SkeletonItemProps> = ({ style, children }) => {
  const context = React.useContext(SkeletonContext);

  if (!context.enabled) {
    return <View style={style}>{children}</View>;
  }

  const skeletonStyle: ViewStyle = {
    ...style,
    backgroundColor: context.backgroundColor,
  };

  // Remove children for skeleton state - we only want the shape
  const skeletonChildren = null;

  switch (context.animationType) {
    case "shimmer":
      return (
        <ShimmerAnimation
          style={skeletonStyle}
          speed={context.speed}
          highlightColor={context.highlightColor}
          direction={context.direction}>
          {skeletonChildren}
        </ShimmerAnimation>
      );
    case "pulse":
      return (
        <PulseAnimation style={skeletonStyle} speed={context.speed}>
          {skeletonChildren}
        </PulseAnimation>
      );
    case "wave":
      return (
        <WaveAnimation
          style={skeletonStyle}
          speed={context.speed}
          backgroundColor={context.backgroundColor}>
          {skeletonChildren}
        </WaveAnimation>
      );
    case "breathing":
      return (
        <BreathingAnimation style={skeletonStyle} speed={context.speed}>
          {skeletonChildren}
        </BreathingAnimation>
      );
    default:
      return <View style={skeletonStyle}>{skeletonChildren}</View>;
  }
};

// Helper function to recursively process children
const processChildren = (children: React.ReactNode): React.ReactNode => {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child;
    }

    // If it's a View component, wrap it with SkeletonItem
    if (child.type === View) {
      return (
        <SkeletonItem style={child.props.style}>
          {child.props.children ? processChildren(child.props.children) : null}
        </SkeletonItem>
      );
    }

    // If it has children, process them recursively
    if (child.props.children) {
      return cloneElement(child, {
        ...child.props,
        children: processChildren(child.props.children),
      });
    }

    return child;
  });
};

// Main SkeletonPlaceholder component
const SkeletonPlaceholder: React.FC<SkeletonPlaceholderProps> = ({
  children,
  animationType = "shimmer",
  speed = 1000,
  backgroundColor = "#E1E9EE",
  highlightColor = "rgba(167, 166, 166, 0.6)",
  enabled = true,
  direction = "left",
}) => {
  const { theme } = useTheme();

  const contextValue = {
    animationType,
    speed,
    backgroundColor: theme.skeleton.backgroundColor || backgroundColor,
    highlightColor: theme.skeleton.highlightColor || highlightColor,
    enabled,
    direction,
  };

  return (
    <SkeletonContext.Provider value={contextValue}>
      {enabled ? processChildren(children) : children}
    </SkeletonContext.Provider>
  );
};

// Preset components for common use cases
const SkeletonText: React.FC<{
  width?: string | number;
  height?: number;
  style?: ViewStyle;
}> = ({ width = "100%", height = 14, style }) => (
  <View
    style={[
      {
        width: width as import("react-native").DimensionValue,
        height: height as import("react-native").DimensionValue,
      },
      style,
    ]}
  />
);

const SkeletonCircle: React.FC<{ size: number; style?: ViewStyle }> = ({
  size,
  style,
}) => (
  <View
    style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
  />
);

const SkeletonRect: React.FC<{
  width?: import("react-native").DimensionValue;
  height?: import("react-native").DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}> = ({ width = "100%", height = 100, borderRadius = 8, style }) => (
  <View
    style={[
      {
        width: width as import("react-native").DimensionValue,
        height: height as import("react-native").DimensionValue,
        borderRadius,
      },
      style,
    ]}
  />
);

// Export components
export default SkeletonPlaceholder;
export { SkeletonText, SkeletonCircle, SkeletonRect };

// Type exports
export type { SkeletonPlaceholderProps, AnimationType };
