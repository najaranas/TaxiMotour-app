import { StyleSheet, View } from "react-native";
import PhoneNumberField from "@/components/common/PhoneNumberField";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Typo from "@/components/common/Typo";
import THEME, { COLORS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Button from "@/components/common/Button";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  AppleIcon,
  FacebookIcon,
  GoolgeIcon,
} from "@/components/common/SvgIcons";

export default function Login() {
  return (
    <ScreenWrapper style={styles.container} padding={20}>
      <View style={styles.loginContaienr}>
        <Typo color={THEME.text.primary} variant="h3" style={styles.title}>
          Enter your number
        </Typo>

        <PhoneNumberField />

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Typo
            color={THEME.text.muted}
            variant="body"
            style={styles.separatorText}>
            Or
          </Typo>
          <View style={styles.separatorLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <Button onPress={() => null} style={styles.socialButtons}>
            <GoolgeIcon
              height={verticalScale(30)}
              width={horizontalScale(30)}
            />
            <Typo variant="body">Sign in with Google</Typo>
          </Button>
          <Button onPress={() => null} style={styles.socialButtons}>
            <AppleIcon height={verticalScale(30)} width={horizontalScale(30)} />
            <Typo variant="body">Sign in with Apple</Typo>
          </Button>
          <Button onPress={() => null} style={styles.socialButtons}>
            <FacebookIcon
              height={verticalScale(30)}
              width={horizontalScale(30)}
            />
            <Typo variant="body">Sign in with Facebook</Typo>
          </Button>
        </View>

        {/* Add after socialButtonsContainer, before closing View */}
      </View>

      <View style={styles.footerContainer}>
        <Typo
          variant="caption"
          color={THEME.text.secondary}
          style={styles.centerText}>
          By continuing, you agree to our secure service.
        </Typo>
        <Typo
          variant="body"
          color={THEME.text.muted}
          style={styles.centerText}
          size={moderateScale(15)}>
          Taximotour - Safe rides across Tunisia
        </Typo>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  loginContaienr: {
    gap: verticalScale(15),
    flex: 1,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
  },
  separatorLine: {
    height: 1,
    flex: 1,
    backgroundColor: COLORS.gray[200],
  },
  separatorText: {
    paddingHorizontal: horizontalScale(10),
  },
  socialButtonsContainer: {
    gap: horizontalScale(10),
  },
  socialButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(30),
    borderRadius: moderateScale(30),
    padding: horizontalScale(15),
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  footerContainer: {
    alignItems: "center",
    paddingTop: verticalScale(15),
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  centerText: { textAlign: "center" },
});
