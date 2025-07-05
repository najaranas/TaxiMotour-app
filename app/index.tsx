import { COLORS } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";

export default function Index() {
  const route = useRouter();
  useEffect(() => {
    setTimeout(() => {
      route.replace("/screens/Auth/LoginScreen");
    }, 2000);
  }, [route]);

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        source={require("../assets/images/SplashImage.png")}
        style={styles.logo}
      />
      <StatusBar barStyle={"light-content"} />
    </View>
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
