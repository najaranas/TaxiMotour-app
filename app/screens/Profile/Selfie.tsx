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
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  useFocusEffect,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import { setSelfieImage } from "./selfieImageStore";
import { useNavigationState } from "@react-navigation/native";

const AnimatedRefreshCcw = Animated.createAnimatedComponent(RefreshCcw);

export default function Selfie() {
  // useSegments() shows the URL segments, not the navigation stack

  const pathname = usePathname();

  console.log("Current pathname:", pathname);
  const navigationState = useNavigationState((state) => state);
  console.log(navigationState?.routes?.map((r) => r.name)); // Should show the full stack

  const cameraRef = useRef<CameraView>(null);
  const [cameraFace, setCameraFace] = useState<"front" | "back">("front");
  const [isTorchActive, setIsTorchActive] = useState<boolean>(false);
  const [isTakeImgClicked, setIsTakeImgClicked] = useState<boolean>(false);
  const router = useRouter();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const rotate = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotate.value}deg` }],
  }));

  const handleSwitchCamera = () => {
    rotate.value = withTiming(rotate.value + 180, {
      duration: 500,
    });

    setCameraFace((prev) => (prev === "back" ? "front" : "back"));
  };

  const takeSelfie = async () => {
    try {
      setIsTakeImgClicked(true);
      const response = await cameraRef?.current?.takePictureAsync({
        base64: true,
      });
      console.log("starting ");
      if (response) {
        console.log("entered");
        setSelfieImage(response);
        router.navigate("/screens/Profile/CheckSelfie");
        // router.navigate("/screens/Profile/Test");
      } else {
        console.log("aze");
      }
    } catch (error) {
      console.error("Error taking selfie:", error);
    } finally {
      setIsTakeImgClicked(false);
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
          <Button disabled={isTakeImgClicked} onPress={takeSelfie}>
            <View
              style={[
                styles.captureButtonOuter,
                {
                  borderColor: isTakeImgClicked
                    ? COLORS.gray["300"]
                    : COLORS.black,
                },
              ]}>
              <View
                style={[
                  styles.captureButtonInner,
                  {
                    opacity: isTakeImgClicked ? 0 : 1,
                  },
                ]}
              />
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
    padding: horizontalScale(2),
    width: horizontalScale(60),
    aspectRatio: 1,
    borderRadius: "50%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: horizontalScale(50),
    aspectRatio: 1,
    borderRadius: horizontalScale(50) / 2,
    backgroundColor: COLORS.black,
  },
});
