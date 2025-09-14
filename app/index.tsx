import { COLORS } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useAuth, useSession, useUser } from "@clerk/clerk-expo";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { getSupabaseClient } from "@/services/supabaseClient";
import { useUserData } from "@/store/userStore";

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
          try {
            const supabase = getSupabaseClient(session);

            // Check both drivers and passengers tables for existing user
            const [driversResponse, passengersResponse] = await Promise.all([
              supabase
                .from("drivers")
                .select("*")
                .eq("user_id", user.id)
                .single(),
              supabase
                .from("passengers")
                .select("*")
                .eq("user_id", user.id)
                .single(),
            ]);

            console.log("Drivers response:", driversResponse);
            console.log("Passengers response:", passengersResponse);

            // Check if user exists in either table
            const driverData = driversResponse.data;
            const passengerData = passengersResponse.data;

            if (driverData || passengerData) {
              // User exists - store their data
              const userData = driverData || passengerData;

              setUserData({
                email_address: userData.email_address,
                phone_number: userData.phone_number,
                full_name: userData.full_name,
                first_name: userData.first_name,
                last_name: userData.last_name,
                experience_years: userData.experience_years,
                moto_type: userData.moto_type,
                user_type: userData.user_type,
              });

              console.log("Existing user found, navigating to Home");
              router.replace("/(tabs)/Home");
            } else {
              // New user - redirect to user type selection
              console.log(
                "New user detected, navigating to user type selection"
              );
              router.replace("/(auth)/UserTypeSelection");
            }
          } catch (error) {
            console.error("Error checking user in Supabase:", error);
            // On error, redirect to user type selection as fallback
            router.replace("/(auth)/UserTypeSelection");
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
