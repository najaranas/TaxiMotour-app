import { COLORS } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StatusBar, StyleSheet } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import ScreenWrapper from "@/components/common/ScreenWrapper";

export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        if (isSignedIn) {
          router.replace("/(tabs)/Home");
        } else {
          router.replace("/screens/Auth/Login");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <ScreenWrapper style={styles.container}>
      <Image
        resizeMode="contain"
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />
      <StatusBar barStyle={"light-content"} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },

  logo: {
    height: verticalScale(250),
    aspectRatio: 1,
  },
});
