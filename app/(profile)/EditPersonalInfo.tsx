import { StyleSheet, View } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import BackButton from "@/components/common/BackButton";
import Typo from "@/components/common/Typo";
import SearchInput from "@/components/common/SearchInput";
import { COLORS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Button from "@/components/common/Button";
import { useState, useRef } from "react";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import { useNavigationState } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

type EditType = "name" | "email" | "phone";
type InputType = "firstName" | "lastName" | "email" | "phone";

export default function EditPersonalInfo() {
  const { editType, title, description } = useLocalSearchParams<{
    editType?: EditType;
    title?: string;
    description?: string;
  }>();

  const { user } = useUser();
  const router = useRouter();
  const { theme } = useTheme();
  const segments = useSegments();
  const { t } = useTranslation();

  const routes = useNavigationState((state) => state.routes);

  console.log("Routes stack:", routes); // All routes in the current navigator

  console.log("segments", segments);

  // Form states
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [phone, setPhone] = useState(
    user?.primaryPhoneNumber?.phoneNumber || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  // Input states
  const [focusedInput, setFocusedInput] = useState<InputType | null>(null);
  const blurTimeoutRef = useRef<number | null>(null);

  // Focus management
  const handleInputFocus = (inputType: InputType) => {
    // Clear any pending blur timeout when focusing a new input
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setFocusedInput(inputType);
  };

  const handleInputBlur = () => {
    // Set a timeout to clear focus, but it can be cancelled by handleInputFocus
    blurTimeoutRef.current = setTimeout(() => {
      setFocusedInput(null);
      blurTimeoutRef.current = null;
    }, 100);
  };

  // Validation logic
  const getIsEnabled = (): boolean => {
    switch (editType) {
      case "name":
        return (
          (user?.firstName !== firstName.trim() ||
            user?.lastName !== lastName.trim()) &&
          firstName.trim() !== "" &&
          lastName.trim() !== ""
        );
      case "email":
        return (
          user?.primaryEmailAddress?.emailAddress !== email.trim() &&
          email.trim() !== ""
        );
      case "phone":
        return (
          user?.primaryPhoneNumber?.phoneNumber !== phone.trim() &&
          phone.trim() !== ""
        );
      default:
        return false;
    }
  };

  // Verification function

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (editType === "name") {
        const updateData: {
          firstName?: string;
          lastName?: string;
        } = {};

        if (firstName.trim() !== user?.firstName) {
          updateData.firstName = firstName.trim();
        }
        if (lastName.trim() !== user?.lastName) {
          updateData.lastName = lastName.trim();
        }

        await user?.update(updateData);
        router.back();
      } else if (editType === "email") {
        console.log("Updating email");
        try {
          const existingEmail = user?.emailAddresses.find(
            (emailAd) => emailAd.emailAddress === email.trim()
          );
          if (existingEmail) {
            if (existingEmail?.verification?.status !== "verified") {
              await existingEmail.prepareVerification({
                strategy: "email_code",
              });
              console.log("Email verification prepared:", existingEmail);
              console.log("About to navigate to confirmation screen");
              router.navigate({
                pathname: "/(common)/ConfirmVerfication",
                params: {
                  contactType: "email",
                  contactValue: email.trim(),
                },
              });
              console.log("Navigation command executed successfully");
            } else {
              // Already verified, set as primary
              await user?.update({
                primaryEmailAddressId: existingEmail.id,
              });
              router.back();
            }
          } else {
            // Create new email address
            const newEmailAddress = await user?.createEmailAddress({
              email: email.trim(),
            });
            if (newEmailAddress) {
              await newEmailAddress.prepareVerification({
                strategy: "email_code",
              });
              console.log("New email verification prepared:", newEmailAddress);
              router.navigate({
                pathname: "/(common)/ConfirmVerfication",
                params: {
                  contactType: "email",
                  contactValue: email.trim(),
                },
              });
            }
          }
        } catch (error) {
          console.log("Error updating email:", error);
          // TODO: Show error alert to user
        }
      } else if (editType === "phone") {
        try {
          // Check if the phone number already exists
          const existingPhone = user?.phoneNumbers.find(
            (phoneNum) => phoneNum.phoneNumber === phone.trim()
          );

          if (existingPhone) {
            // If phone exists but isn't verified, send verification
            if (existingPhone.verification?.status !== "verified") {
              await existingPhone.prepareVerification();
              router.navigate({
                pathname: "/(common)/ConfirmVerfication",
                params: {
                  contactType: "phone",
                  contactValue: phone.trim(),
                },
              });
            } else {
              // If already verified, just set as primary
              await user?.update({
                primaryPhoneNumberId: existingPhone.id,
              });
              console.log("Phone set as primary successfully");
              router.back();
            }
          } else {
            // Create new phone number and send verification
            const phoneNumber = await user?.createPhoneNumber({
              phoneNumber: phone.trim(),
            });

            if (phoneNumber) {
              // Send verification SMS
              await phoneNumber.prepareVerification();
              router.navigate({
                pathname: "/(common)/ConfirmVerfication",
                params: {
                  contactType: "phone",
                  contactValue: phone.trim(),
                },
              });
            }
          }
        } catch (error) {
          console.log("Error updating phone:", error);
          // TODO: Show error alert to user
        }
      }
    } catch (error) {
      console.log("Error updating personal info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderNameInputs = () => (
    <>
      <SearchInput
        label={t("profile.firstName")}
        value={firstName}
        onChangeText={setFirstName}
        placeholder={t("profile.enterFirstName")}
        isFocused={focusedInput === "firstName"}
        onFocus={() => handleInputFocus("firstName")}
        onBlur={handleInputBlur}
      />

      <SearchInput
        label={t("profile.lastName")}
        value={lastName}
        onChangeText={setLastName}
        placeholder={t("profile.enterLastName")}
        isFocused={focusedInput === "lastName"}
        onFocus={() => handleInputFocus("lastName")}
        onBlur={handleInputBlur}
      />
    </>
  );

  const renderEmailInput = () => (
    <SearchInput
      label={t("profile.emailAddress")}
      value={email}
      onChangeText={setEmail}
      placeholder={t("profile.enterEmail")}
      isFocused={focusedInput === "email"}
      onFocus={() => handleInputFocus("email")}
      onBlur={handleInputBlur}
      keyboardType="email-address"
      autoCapitalize="none"
    />
  );

  const renderPhoneInput = () => (
    <SearchInput
      label={t("profile.phoneNumber")}
      value={phone}
      onChangeText={setPhone}
      placeholder={t("profile.enterPhoneNumber")}
      isFocused={focusedInput === "phone"}
      onFocus={() => handleInputFocus("phone")}
      onBlur={handleInputBlur}
      keyboardType="phone-pad"
    />
  );

  const renderInputs = () => {
    switch (editType) {
      case "name":
        return renderNameInputs();
      case "email":
        return renderEmailInput();
      case "phone":
        return renderPhoneInput();
      default:
        return null;
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
        <Typo variant="h3" style={styles.title}>
          {title || t("profile.editPersonalInfo")}
        </Typo>

        <Typo
          variant="body"
          color={theme.text.secondary}
          style={styles.description}>
          {description || t("profile.updateInfoDescription")}
        </Typo>

        {renderInputs()}
      </View>

      <KeyboardStickyView offset={{ closed: 0, opened: verticalScale(50) }}>
        <Button
          loading={isLoading}
          disabled={isLoading || !getIsEnabled()}
          style={[
            styles.saveButton,
            {
              borderRadius: theme.borderRadius.pill,
            },
          ]}
          onPress={handleSave}>
          <Typo variant="button" size={moderateScale(20)} color={COLORS.white}>
            {t("common.saveChanges")}
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
    gap: verticalScale(20),
  },
  title: {
    textAlign: "center",
  },
  description: {
    lineHeight: moderateScale(22),
  },
  inputContainer: {
    paddingInline: horizontalScale(15),
    paddingBlock: horizontalScale(8),
    borderWidth: 1, // Use default borderWidth
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
    fontSize: moderateScale(16),
  },
  saveButton: {
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(15),
    minHeight: verticalScale(60),
  },
});
