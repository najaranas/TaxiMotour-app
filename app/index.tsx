import { COLORS } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useAuth, useSession, useUser } from "@clerk/clerk-expo";
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
      const seachedData = driversResponse || passengersResponse;
      if (seachedData) {
        const mappedUserData = {
          id: seachedData?.data?.id,
          email_address: seachedData?.data?.email_address,
          phone_number: seachedData?.data?.phone_number,
          full_name: seachedData?.data?.full_name,
          first_name: seachedData?.data?.first_name,
          last_name: seachedData?.data?.last_name,
          experience_years: seachedData?.data?.experience_years,
          moto_type: seachedData?.data?.moto_type,
          user_type: seachedData?.data?.user_type,
          profile_image_url: seachedData?.data?.imageUrl,
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
