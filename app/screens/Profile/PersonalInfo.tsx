import { StyleSheet, View } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import BackButton from "@/components/common/BackButton";
import { useRouter } from "expo-router";
import Typo from "@/components/common/Typo";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import Button from "@/components/common/Button";
import { useUser } from "@clerk/clerk-expo";
import UserProfileImage from "@/components/common/UserProfileImage";
import { Mail, User } from "lucide-react-native";

export default function CheckSelfie() {
  const { user } = useUser();
  const router = useRouter();
  return (
    <ScreenWrapper
      safeArea
      padding={horizontalScale(15)}
      scroll
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.screenContent}>
      <BackButton variant="arrow" />
      <View style={styles.mainContent}>
        <Typo variant="h3" style={{ textAlign: "center" }}>
          Personal Info
        </Typo>
        <View
          style={{
            borderWidth: THEME.borderWidth.thin,
            borderColor: COLORS.gray["200"],
            padding: horizontalScale(20),
            justifyContent: "center",
            alignItems: "center",
            gap: verticalScale(10),
          }}>
          <UserProfileImage
            imageUrl={user?.imageUrl}
            hasImage={user?.hasImage}
            onPress={() => router.push("/screens/Profile/Selfie")}
            size={60}
            showEditIcon={true}
            editable={true}
          />
          <Typo
            variant="body"
            // size={moderateScale(20)}
            style={{ textAlign: "center" }}>
            {user?.hasImage
              ? "Change yout profile photo "
              : "Add a profile photo so driver can recogniz you "}
          </Typo>
        </View>
        <View style={styles.menuContainer}>
          {/* Personal Info */}
          <Button
            style={styles.menuItem}
            onPress={() =>
              router.push({
                pathname: "/screens/Profile/UpdatePersonalInfo",
                params: {
                  pageType: "name",
                  title: "Update your name",
                  subTitle:
                    "Please enter your name exactly as it appears on your ID or Passport.",
                },
              })
            }>
            <View style={styles.menuItemContent}>
              <User
                color={THEME.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
              <Typo
                variant="body"
                style={{ flexShrink: 1 }}
                size={moderateScale(17)}
                color={THEME.text.primary}>
                {user?.fullName}
              </Typo>
              <View style={{ flex: 1, alignItems: "flex-end" }}></View>
              <Typo
                variant="body"
                size={moderateScale(17)}
                fontFamily={FONTS.medium}
                color={COLORS.secondary}>
                Edit
              </Typo>
            </View>
          </Button>

          {/* email*/}

          <Button
            style={styles.menuItem}
            onPress={() =>
              router.push({
                pathname: "/screens/Profile/UpdatePersonalInfo",
                params: {
                  pageType: "email",
                  title: "Update your email",
                  subTitle:
                    "Please enter your email address. It will be used for notifications and account recovery.",
                },
              })
            }>
            <View style={styles.menuItemContent}>
              <Mail
                color={THEME.text.primary}
                strokeWidth={1.5}
                size={moderateScale(25)}
              />
              <Typo
                variant="body"
                style={{ flexShrink: 1 }}
                size={moderateScale(17)}
                color={THEME.text.primary}>
                {user?.primaryEmailAddress?.emailAddress}
              </Typo>
              <View style={{ flex: 1, alignItems: "flex-end" }}></View>
              <Typo
                variant="body"
                size={moderateScale(17)}
                fontFamily={FONTS.medium}
                color={COLORS.secondary}>
                Edit
              </Typo>
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
    gap: horizontalScale(20),
  },
  menuContainer: {},
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray["100"],
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(12),
  },
});
