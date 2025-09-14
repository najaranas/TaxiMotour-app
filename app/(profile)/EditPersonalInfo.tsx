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
import { useUser, useSession } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import { useNavigationState } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { getSupabaseClient } from "@/services/supabaseClient";
import { useUserData } from "@/store/userStore";

type EditType = "name" | "email" | "phone" | "motoType" | "experience";
type InputType =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "motoType"
  | "experience";

export default function EditPersonalInfo() {
  const { editType, title, description } = useLocalSearchParams<{
    editType?: EditType;
    title?: string;
    description?: string;
  }>();

  const { user } = useUser();
  const { session } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const segments = useSegments();
  const { t } = useTranslation();
  const { userData, updateUserData } = useUserData();

  const routes = useNavigationState((state) => state.routes);

  console.log("Routes stack:", routes); // All routes in the current navigator

  console.log("segments", segments);

  // Form states
  const [firstName, setFirstName] = useState(userData?.first_name || "");
  const [lastName, setLastName] = useState(userData?.last_name || "");
  const [email, setEmail] = useState(userData?.email_address || "");
  const [phone, setPhone] = useState(userData?.phone_number || "");
  const [motoType, setMotoType] = useState(userData?.moto_type || "");
  const [experience, setExperience] = useState(
    userData?.experience_years || ""
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
          (userData?.first_name !== firstName.trim() ||
            userData?.last_name !== lastName.trim()) &&
          firstName.trim() !== "" &&
          lastName.trim() !== ""
        );
      case "email":
        return userData?.email_address !== email.trim() && email.trim() !== "";
      case "phone":
        return userData?.phone_number !== phone.trim() && phone.trim() !== "";
      case "motoType":
        return (
          userData?.moto_type !== motoType.trim() && motoType.trim() !== ""
        );
      case "experience":
        return (
          String(userData?.experience_years) !== String(experience).trim() &&
          String(experience).trim() !== ""
        );
      default:
        return false;
    }
  };

  // Verification function

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseClient(session);

      if (editType === "name") {
        const updateData: {
          firstName?: string;
          lastName?: string;
        } = {};

        if (firstName.trim() !== userData?.first_name) {
          updateData.firstName = firstName.trim();
        }
        if (lastName.trim() !== userData?.last_name) {
          updateData.lastName = lastName.trim();
        }

        // Update Clerk first
        await user?.update(updateData);

        // Then update Supabase
        try {
          const fullName = `${firstName.trim()} ${lastName.trim()}`;
          const { error } = await supabase
            .from(userData?.user_type === "driver" ? "drivers" : "passengers")
            .update({
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            })
            .eq("user_id", user?.id);

          if (error) {
            console.log("Error updating name in Supabase:", error);
          } else {
            // Update local user store
            updateUserData({
              full_name: fullName,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            });
            console.log("Name updated successfully in both Clerk and Supabase");
          }
        } catch (error) {
          console.log("Error updating name in Supabase:", error);
        }

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
                  // Note: Supabase update will happen in ConfirmVerification screen after successful verification
                },
              });
              console.log("Navigation command executed successfully");
            } else {
              // Already verified, set as primary
              await user?.update({
                primaryEmailAddressId: existingEmail.id,
              });

              // Update Supabase with the verified email
              try {
                const { error } = await supabase
                  .from(
                    userData?.user_type === "driver" ? "drivers" : "passengers"
                  )
                  .update({ email_address: email.trim() })
                  .eq("user_id", user?.id);

                if (error) {
                  console.log("Error updating email in Supabase:", error);
                } else {
                  // Update local user store
                  updateUserData({ email_address: email.trim() });
                  console.log(
                    "Email updated successfully in both Clerk and Supabase"
                  );
                }
              } catch (error) {
                console.log("Error updating email in Supabase:", error);
              }

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
                  // Note: Supabase update will happen in ConfirmVerification screen after successful verification
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
                  // Note: Supabase update will happen in ConfirmVerification screen after successful verification
                },
              });
            } else {
              // If already verified, just set as primary
              await user?.update({
                primaryPhoneNumberId: existingPhone.id,
              });

              // Update Supabase with the verified phone
              try {
                const { error } = await supabase
                  .from(
                    userData?.user_type === "driver" ? "drivers" : "passengers"
                  )
                  .update({ phone_number: phone.trim() })
                  .eq("user_id", user?.id);

                if (error) {
                  console.log("Error updating phone in Supabase:", error);
                } else {
                  // Update local user store
                  updateUserData({ phone_number: phone.trim() });
                  console.log(
                    "Phone updated successfully in both Clerk and Supabase"
                  );
                }
              } catch (error) {
                console.log("Error updating phone in Supabase:", error);
              }

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
                  // Note: Supabase update will happen in ConfirmVerification screen after successful verification
                },
              });
            }
          }
        } catch (error) {
          console.log("Error updating phone:", error);
          // TODO: Show error alert to user
        }
      } else if (editType === "motoType") {
        try {
          const { error } = await supabase
            .from(userData?.user_type === "driver" ? "drivers" : "passengers")
            .update({ moto_type: motoType.trim() })
            .eq("user_id", user?.id);

          if (error) {
            console.log("Error updating moto type:", error);
            // TODO: Show error alert to user
          } else {
            // Update local user store
            updateUserData({ moto_type: motoType.trim() });
            console.log("Moto type updated successfully");
            router.back();
          }
        } catch (error) {
          console.log("Error updating moto type:", error);
          // TODO: Show error alert to user
        }
      } else if (editType === "experience") {
        try {
          const { error } = await supabase
            .from(userData?.user_type === "driver" ? "drivers" : "passengers")
            .update({ experience_years: experience.trim() })
            .eq("user_id", user?.id);

          if (error) {
            console.log("Error updating experience:", error);
            // TODO: Show error alert to user
          } else {
            // Update local user store
            updateUserData({ experience_years: experience.trim() });
            console.log("Experience updated successfully");
            router.back();
          }
        } catch (error) {
          console.log("Error updating experience:", error);
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

  const renderMotoTypeInput = () => (
    <SearchInput
      label={t("profile.motoType")}
      value={motoType}
      onChangeText={setMotoType}
      placeholder={t("profile.enterMotoType")}
      isFocused={focusedInput === "motoType"}
      onFocus={() => handleInputFocus("motoType")}
      onBlur={handleInputBlur}
    />
  );

  const renderExperienceInput = () => (
    <SearchInput
      label={t("profile.experienceYears")}
      value={String(experience)}
      onChangeText={setExperience}
      placeholder={t("profile.enterExperience")}
      isFocused={focusedInput === "experience"}
      onFocus={() => handleInputFocus("experience")}
      onBlur={handleInputBlur}
      keyboardType="numeric"
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
      case "motoType":
        return renderMotoTypeInput();
      case "experience":
        return renderExperienceInput();
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
