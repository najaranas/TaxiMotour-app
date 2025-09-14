import { COLORS } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useAuth, useSession, useUser } from "@clerk/clerk-expo";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { useUserData } from "@/store/userStore";
import StorageManager from "@/utils/storage";

export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { session } = useSession();
  const { setUserData } = useUserData();

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(async () => {
        if (isSignedIn && user && session) {
          if (StorageManager.retrieveBoolean("signUpCompleted") === false) {
            router.replace("/(auth)/UserTypeSelection");
          } else {
            router.replace("/(tabs)/Home");
          }
        } else {
          router.replace("/(auth)/Login");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, router, session, setUserData, user]);

  return (
    <ScreenWrapper
      safeArea={false}
      systemBarsStyle="light"
      statusBarStyle="light-content">
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>
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
