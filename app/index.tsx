import { COLORS } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useAuth, useClerk, useSession, useUser } from "@clerk/clerk-expo";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { useUserData } from "@/store/userStore";
import StorageManager from "@/utils/storage";
import { getSupabaseClient } from "@/services/supabaseClient";

export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { session } = useSession();
  const { setUserData } = useUserData();
  const { signOut } = useClerk();
  const supabaseClient = getSupabaseClient(session);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(async () => {
        if (isSignedIn && user && session) {
          if (StorageManager.retrieveObject("userData")) {
            setUserData(StorageManager.retrieveObject("userData"));
          } else {
            fechUserData();
          }
          router.replace("/(tabs)/Home");
        } else {
          router.replace("/(auth)/Login");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, router, session, setUserData, user]);

  const fechUserData = async () => {
    try {
      const [driversResponse, passengersResponse] = await Promise.all([
        supabaseClient
          .from("drivers")
          .select("*")
          .eq("user_id", user?.id)
          .single(),
        supabaseClient
          .from("passengers")
          .select("*")
          .eq("user_id", user?.id)
          .single(),
      ]);

      if (driversResponse || passengersResponse) {
        const mappedUserData = {
          email_address: driversResponse?.data?.email_address,
          phone_number: driversResponse?.data?.phone_number,
          full_name: driversResponse?.data?.full_name,
          first_name: driversResponse?.data?.first_name,
          last_name: driversResponse?.data?.last_name,
          experience_years: driversResponse?.data?.experience_years,
          moto_type: driversResponse?.data?.moto_type,
          user_type: driversResponse?.data?.user_type,
          profile_image_url: driversResponse?.data?.imageUrl,
        };

        setUserData(mappedUserData);
        StorageManager.storeObject("userData", mappedUserData);
      } else {
        router.navigate("/(auth)/UserTypeSelection");
      }
    } catch (error) {
      console.log("supabase error : ", error);
    }
  };
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
