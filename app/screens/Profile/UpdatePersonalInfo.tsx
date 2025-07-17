import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import BackButton from "@/components/common/BackButton";
import Typo from "@/components/common/Typo";
import THEME, { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { CircleX } from "lucide-react-native";
import Button from "@/components/common/Button";
import { useRef, useState } from "react";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function UpdatePersonalInfo() {
  const { pageType, title, subTitle } = useLocalSearchParams<{
    pageType?: "name" | "email" | "phone";
    title?: string;
    subTitle?: string;
  }>();

  const { user } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const firstNameRef = useRef<TextInput>(null);
  const LastNameRef = useRef<TextInput>(null);
  if (pageType === "name") {
  }

  const isEnabled =
    (user?.firstName !== firstName || user?.lastName !== lastName) &&
    firstName.trim() !== "" &&
    lastName.trim() !== "";

  const clearInput = (fieldType: "firstName" | "lastName") => {
    if (fieldType === "firstName") {
      setFirstName("");
      firstNameRef.current?.focus();
    } else {
      setLastName("");
      LastNameRef.current?.focus();
    }
  };

  const handleContinue = async () => {
    setIsButtonLoading(true);
    try {
      await user?.update({
        firstName: firstName,
        lastName: lastName,
      });
      router.back();
    } catch (error) {
      console.log("Error updating personal info:", error);
    } finally {
      console.log("finished");
      setIsButtonLoading(false);
    }
  };
  return (
    <ScreenWrapper
      safeArea
      scroll
      padding={horizontalScale(15)}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.screenContent}>
      <BackButton variant="arrow" />

      <View style={styles.mainContent}>
        <Typo variant="h3" style={{ textAlign: "center" }}>
          {title || "Update Personal Info"}
        </Typo>

        <Typo variant="body">
          {subTitle || "Please update your personal information below."}
        </Typo>

        <View style={styles.inputContainer}>
          <View style={styles.inputField}>
            <Typo
              variant="body"
              color={COLORS.gray["600"]}
              size={moderateScale(12)}>
              First Name
            </Typo>

            <TextInput
              ref={firstNameRef}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              style={styles.textInput}
            />
          </View>
          <Button onPress={() => clearInput("firstName")}>
            <CircleX
              color={COLORS.gray["600"]}
              strokeWidth={1.5}
              size={moderateScale(25)}
            />
          </Button>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputField}>
            <Typo
              variant="body"
              color={COLORS.gray["600"]}
              size={moderateScale(12)}>
              Last Name
            </Typo>

            <TextInput
              ref={LastNameRef}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              style={styles.textInput}
            />
          </View>
          <Button onPress={() => clearInput("lastName")}>
            <CircleX
              color={COLORS.gray["600"]}
              strokeWidth={1.5}
              size={moderateScale(25)}
            />
          </Button>
        </View>
      </View>

      <KeyboardStickyView offset={{ closed: 0, opened: verticalScale(50) }}>
        <Button
          loading={isButtonLoading}
          disabled={isButtonLoading || !isEnabled}
          indicatorStyle={{ size: moderateScale(25), color: COLORS.primary }}
          style={[styles.button, { opacity: isButtonLoading ? 0.3 : 1 }]}
          onPress={handleContinue}>
          <Typo
            variant="button"
            size={moderateScale(20)}
            fontFamily={FONTS.medium}
            color={COLORS.white}>
            Continue
          </Typo>
        </Button>
      </KeyboardStickyView>
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
  inputContainer: {
    padding: horizontalScale(10),
    backgroundColor: COLORS.gray["100"],
    borderRadius: THEME.borderRadius.small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: horizontalScale(10),
  },
  inputField: {
    flex: 1,
    gap: verticalScale(5),
  },
  textInput: {
    paddingTop: verticalScale(0),
    paddingBottom: verticalScale(0),
    paddingLeft: verticalScale(5),
    paddingRight: verticalScale(0),
    fontSize: moderateScale(17),
  },
  button: {
    borderRadius: THEME.borderRadius.pill,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    paddingBlock: verticalScale(15),
    minHeight: verticalScale(60),
  },
});
