import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import BackButton from "@/components/common/BackButton";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Typo from "@/components/common/Typo";
import { Flashlight, RefreshCcw, Zap, ZapOff } from "lucide-react-native";
import THEME, { COLORS } from "@/constants/theme";
import Button from "@/components/common/Button";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraViewRef,
  Camera,
} from "expo-camera";
import { useRef, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedRefreshCcw = Animated.createAnimatedComponent(RefreshCcw);

export default function Selfie() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraFace, setCameraFace] = useState<"front" | "back">("front");
  const [isTorchActive, setIsToarchActive] = useState<boolean>(false);
  const [image, setImage] = useState<string>(
    "https://tse1.mm.bing.net/th/id/OIP.i4gn7MbTOHqpWaaTcenevgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
  );

  const rotate = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotate.value}deg` }],
  }));
  const handlePress = () => {
    rotate.value = withSpring(rotate.value + 360, {
      stiffness: 50, // lower than default (default is 100)
      damping: 40, // higher than default (default is 10)
    });
  };

  const HandleTakeImg = async () => {
    // cameraRef?.current.;
    const response = await cameraRef.current?.takePictureAsync({});

    if (response?.uri) {
      setImage(response?.uri);
    }
  };

  return (
    <ScreenWrapper
      safeArea
      padding={horizontalScale(15)}
      scroll
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
      }}>
      <BackButton variant="close" />

      <Image source={{ uri: image }} style={{ width: 100, aspectRatio: 1 }} />
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <Typo variant="h3" style={{ textAlign: "center" }}>
          Take a selfie
        </Typo>
        <View>
          <View
            style={{
              width: "90%",
              marginInline: "auto",
              aspectRatio: 1,
              borderRadius: "50%",
              overflow: "hidden",
            }}>
            <CameraView
              ref={cameraRef}
              enableTorch={isTorchActive}
              style={{
                flex: 1,
              }}
              facing={cameraFace}
            />
            <View
              style={{
                flex: 1,
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                backgroundColor: "transparent",
                pointerEvents: "none",
                borderWidth: 10,
                borderRadius: "50%",
                borderColor: COLORS.transparent_gray,
              }}
            />
          </View>

          <Typo
            style={{ textAlign: "center", marginTop: verticalScale(20) }}
            variant="body"
            color={THEME.text.secondary}>
            Avoid places with bad lighting , Position your face in the cirlce
            and smile !
          </Typo>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Button
            onPress={() => {
              setCameraFace((prev) => (prev === "back" ? "front" : "back"));
              handlePress();
            }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.gray["100"],
                padding: horizontalScale(10),
                borderRadius: 50,
              }}>
              <AnimatedRefreshCcw
                color={THEME.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
                style={animatedStyles}
              />
            </View>
          </Button>
          <Button onPress={HandleTakeImg}>
            <View
              style={{
                borderWidth: 3,
                borderColor: COLORS.black,
                padding: horizontalScale(2),
                width: horizontalScale(60),
                aspectRatio: 1,
                borderRadius: 50,
              }}>
              <View
                style={{
                  backgroundColor: COLORS.black,
                  flex: 1,
                  borderRadius: 50,
                }}
              />
            </View>
          </Button>

          <Button
            disabled={cameraFace === "front"}
            onPress={() => {
              setIsToarchActive((prev) => !prev);
            }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.gray["100"],
                padding: horizontalScale(10),
                borderRadius: 50,
                opacity: cameraFace === "front" ? 0 : 1,
              }}>
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
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  text: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
