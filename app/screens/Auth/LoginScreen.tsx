import { ScrollView, StyleSheet, View } from "react-native";
import PhoneSelector from "@/components/common/PhoneSelector";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Typo from "@/components/common/Typo";
import THEME, { COLORS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Button from "@/components/common/Button";
import {
  AppleIcon,
  FacebookIcon,
  GoolgeIcon,
} from "@/components/common/SvgIcons";

export default function LoginScreen() {
  return (
    <ScreenWrapper safeArea padding={horizontalScale(15)}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.loginContaienr}>
          <Typo
            color={THEME.text.primary}
            variant="h3"
            style={styles.centerText}>
            Enter your number
          </Typo>

          <PhoneSelector />

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
              <AppleIcon
                height={verticalScale(30)}
                width={horizontalScale(30)}
              />
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
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  loginContaienr: {
    gap: verticalScale(15),
    flex: 1,
    justifyContent: "center",
  },
  centerText: { textAlign: "center" },

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
    borderRadius: THEME.borderRadius.pill,
    padding: horizontalScale(15),
    borderWidth: THEME.borderWidth.thin,
    borderColor: COLORS.gray[200],
  },
  footerContainer: {
    alignItems: "center",
    paddingTop: verticalScale(15),
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
});
