import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import BackButton from "@/components/common/BackButton";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Typo from "@/components/common/Typo";
import { Flashlight, RefreshCcw, Zap } from "lucide-react-native";
import THEME, { COLORS } from "@/constants/theme";
import Button from "@/components/common/Button";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

export default function Selfie() {
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
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <Typo variant="h3" style={{ textAlign: "center" }}>
          Take a selfie
        </Typo>
        <View>
          <CameraView
            style={{ width: 300, height: 300, flex: 1 }}
            facing={"front"}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
          <Typo
            style={{ textAlign: "center" }}
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
          <Button onPress={() => {}}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.gray["100"],
                padding: horizontalScale(10),
                borderRadius: 50,
              }}>
              <RefreshCcw
                color={THEME.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
            </View>
          </Button>
          <Button onPress={() => {}}>
            <View
              style={{
                borderWidth: 3,
                borderColor: COLORS.black,
                padding: horizontalScale(2),
                width: horizontalScale(60),
                height: verticalScale(60),
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

          <Button onPress={() => {}}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.gray["100"],
                padding: horizontalScale(10),
                borderRadius: 50,
              }}>
              <Zap
                color={THEME.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
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
