import { Canvas, Group, Path, Skia } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { Dimensions } from "react-native";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// Get device screen dimensions
const { width, height } = Dimensions.get("window");

// Constants for our circle
const RADIUS = 50; // Circle radius in pixels
const STROKE_WIDTH = 10; // How thick the circle line is

const App = () => {
  // Create the circle path using Skia
  const path = Skia.Path.Make();
  // Add a circle to the path at center of screen
  path.addCircle(width / 2, height / 2, RADIUS);

  const rotate = useSharedValue(0);

  const matrix = useDerivedValue(() => {
    const m = Skia.Matrix();
    m.translate(width / 2, height / 2);
    m.rotate(rotate.value * (Math.PI / 180));
    m.translate(-width / 2, -height / 2);
    return m;
  });

  useEffect(() => {
    // Use either this approach:
    rotate.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);
  return (
    <Canvas style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <Group matrix={matrix}>
        <Path
          path={path}
          color="#404250"
          style="stroke"
          strokeWidth={STROKE_WIDTH}
          strokeCap="round"
          start={0}
          end={0.8}
        />
      </Group>
    </Canvas>
  );
};
export default App;
