import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import BackButton from "@/components/common/BackButton";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Typo from "@/components/common/Typo";
import { Flashlight, RefreshCcw, Zap, ZapOff } from "lucide-react-native";
import THEME, { COLORS } from "@/constants/theme";
import Button from "@/components/common/Button";
import { CameraView } from "expo-camera";
import { useRef, useState, useCallback } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useFocusEffect, useRouter } from "expo-router";
import { setSelfieImage } from "./selfieImageStore";

const AnimatedRefreshCcw = Animated.createAnimatedComponent(RefreshCcw);

export default function Selfie() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraFace, setCameraFace] = useState<"front" | "back">("front");
  const [isTorchActive, setIsTorchActive] = useState<boolean>(false);
  const router = useRouter();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const rotate = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotate.value}deg` }],
  }));
  const handleSwitchCamera = () => {
    rotate.value = withSpring(rotate.value + 360, {
      stiffness: 50,
      damping: 40,
    });
    setCameraFace((prev) => (prev === "back" ? "front" : "back"));
  };

  const takeSelfie = async () => {
    if (!isCameraReady) {
      console.log("Camera not ready");
      return;
    }
    console.log("startingbefore ");
    try {
      const response = await cameraRef?.current?.takePictureAsync({
        base64: true,
      });
      console.log("starting ");
      if (response) {
        console.log("entered");
        setSelfieImage(response);
        router.push("/screens/Profile/CheckSelfie");
      } else {
        console.log("aze");
      }
    } catch (error) {
      console.error("Error taking selfie:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("mounted");
      setIsFocused(true);
      return () => {
        console.log("unmounted");
        setIsCameraReady(false);
        setIsFocused(false);
      };
    }, [])
  );

  return (
    <ScreenWrapper
      safeArea
      padding={horizontalScale(15)}
      scroll
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.screenContent}>
      <BackButton variant="close" />
      <View style={styles.mainContent}>
        <Typo variant="h3" style={{ textAlign: "center" }}>
          Snap a Clear Selfie
        </Typo>
        <View>
          <View style={styles.cameraContainer}>
            {isFocused && (
              <CameraView
                ref={cameraRef}
                enableTorch={isTorchActive}
                mirror
                ratio="1:1"
                style={styles.cameraView}
                facing={cameraFace}
                onCameraReady={() => setIsCameraReady(true)}
                onMountError={(error) => {
                  console.error("Camera mount error:", error);
                  setIsCameraReady(false);
                }}
              />
            )}
            <View style={styles.cameraOverlay} />
          </View>
          <Typo
            style={styles.instructionText}
            variant="body"
            color={THEME.text.secondary}>
            Make sure your face is centered and well-lit. Smile for the best
            result!
          </Typo>
        </View>
        <View style={styles.buttonRow}>
          <Button onPress={handleSwitchCamera}>
            <View style={styles.iconButton}>
              <AnimatedRefreshCcw
                color={THEME.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
                style={animatedStyles}
              />
            </View>
          </Button>
          <Button onPress={takeSelfie}>
            <View style={styles.captureButtonOuter}>
              <View style={styles.captureButtonInner} />
            </View>
          </Button>
          <Button
            disabled={cameraFace === "front"}
            onPress={() => setIsTorchActive((prev) => !prev)}>
            <View
              style={[
                styles.iconButton,
                cameraFace === "front" && styles.iconButtonDisabled,
              ]}>
              {isTorchActive ? (
                <Zap
                  color={THEME.text.primary}
                  strokeWidth={1.5}
                  size={moderateScale(25)}
                />
              ) : (
                <ZapOff
                  color={THEME.text.primary}
                  strokeWidth={1.5}
                  size={moderateScale(25)}
                />
              )}
            </View>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  cameraContainer: {
    width: horizontalScale(300),
    marginHorizontal: "auto",
    aspectRatio: 1,
    borderRadius: horizontalScale(300) / 2,
    overflow: "hidden",
  },
  cameraView: {
    flex: 1,
    borderRadius: horizontalScale(300) / 2,
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    pointerEvents: "none",
    borderWidth: 10,
    borderRadius: horizontalScale(300) / 2,
    borderColor: COLORS.transparent_gray,
  },
  instructionText: {
    textAlign: "center",
    marginTop: verticalScale(20),
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.gray["100"],
    padding: horizontalScale(10),
    borderRadius: 50,
  },
  iconButtonDisabled: {
    opacity: 0,
  },
  captureButtonOuter: {
    borderWidth: 3,
    borderColor: COLORS.black,
    padding: horizontalScale(2),
    width: horizontalScale(60),
    aspectRatio: 1,
    borderRadius: 50,
  },
  captureButtonInner: {
    backgroundColor: COLORS.black,
    flex: 1,
    borderRadius: 50,
  },
});
