import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import BackButton from "@/components/common/BackButton";
import Typo from "@/components/common/Typo";
import { COLORS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { CircleX } from "lucide-react-native";
import Button from "@/components/common/Button";
import { useRef, useState } from "react";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import ConfirmationCodeField from "@/components/common/ConfirmationCodeField";
import {
  CommonActions,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";

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
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Store verification objects for later use
  const [emailToVerify, setEmailToVerify] = useState<any>(null);
  const [phoneToVerify, setPhoneToVerify] = useState<any>(null);

  // Input states
  const [focusedInput, setFocusedInput] = useState<InputType | null>(null);

  // Input refs
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  // Focus management
  const handleInputFocus = (inputType: InputType) => {
    setFocusedInput(inputType);
  };

  const handleInputBlur = () => {
    // Check after a short delay to avoid race conditions during input switching
    setTimeout(() => {
      const isAnyInputFocused =
        firstNameRef.current?.isFocused() ||
        lastNameRef.current?.isFocused() ||
        emailRef.current?.isFocused() ||
        phoneRef.current?.isFocused();

      if (!isAnyInputFocused) {
        setFocusedInput(null);
      }
    }, 100);
  };

  // Validation logic
  const getIsEnabled = (): boolean => {
    if (verificationSent) {
      // During verification, enable if code is entered
      return verificationCode.length === 6;
    }

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

  const clearInput = (inputType: InputType) => {
    switch (inputType) {
      case "firstName":
        setFirstName("");
        firstNameRef.current?.focus();
        break;
      case "lastName":
        setLastName("");
        lastNameRef.current?.focus();
        break;
      case "email":
        setEmail("");
        emailRef.current?.focus();
        break;
      case "phone":
        setPhone("");
        phoneRef.current?.focus();
        break;
    }
  };

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
              setEmailToVerify(existingEmail);
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
              setEmailToVerify(newEmailAddress);
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
              router.push({
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
              router.push({
                pathname: "/(common)/ConfirmVerfication",
                params: {
                  contactType: "phone",
                  contactValue: phone.trim(),
                },
              });
            }
          }

          if (!verificationSent) {
            router.back();
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

  const focusInput = (inputType: InputType) => {
    setFocusedInput(inputType);

    switch (inputType) {
      case "firstName":
        firstNameRef.current?.focus();
        break;
      case "lastName":
        lastNameRef.current?.focus();
        break;
      case "email":
        emailRef.current?.focus();
        break;
      case "phone":
        phoneRef.current?.focus();
        break;
    }
  };

  const renderNameInputs = () => (
    <>
      <Button activeOpacity={1} onPress={() => focusInput("firstName")}>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor:
                focusedInput === "firstName"
                  ? theme.button.primary
                  : theme.input.border,
              borderRadius: theme.borderRadius.medium,
            },
          ]}
          pointerEvents="box-none">
          <View style={styles.inputField}>
            <Typo
              variant="body"
              color={theme.input.placeholder}
              size={moderateScale(12)}>
              First Name
            </Typo>
            <TextInput
              ref={firstNameRef}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor={theme.input.placeholder}
              onFocus={() => handleInputFocus("firstName")}
              onBlur={handleInputBlur}
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
      </Button>

      <Button activeOpacity={1} onPress={() => focusInput("lastName")}>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor:
                focusedInput === "lastName"
                  ? COLORS.secondary
                  : COLORS.gray["200"],
              borderRadius: theme.borderRadius.medium,
            },
          ]}>
          <View style={styles.inputField}>
            <Typo
              variant="body"
              color={COLORS.gray["600"]}
              size={moderateScale(12)}>
              Last Name
            </Typo>
            <TextInput
              ref={lastNameRef}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor={theme.input.placeholder}
              onFocus={() => handleInputFocus("lastName")}
              onBlur={handleInputBlur}
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
      </Button>
    </>
  );

  const renderEmailInput = () => (
    <Button activeOpacity={1} onPress={() => focusInput("email")}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor:
              focusedInput === "email" ? COLORS.secondary : COLORS.gray["200"],
            borderRadius: theme.borderRadius.medium,
          },
        ]}>
        <View style={styles.inputField}>
          <Typo
            variant="body"
            color={COLORS.gray["600"]}
            size={moderateScale(12)}>
            Email Address
          </Typo>
          <TextInput
            ref={emailRef}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.input.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => handleInputFocus("email")}
            onBlur={handleInputBlur}
            style={styles.textInput}
          />
        </View>
        <Button onPress={() => clearInput("email")}>
          <CircleX
            color={COLORS.gray["600"]}
            strokeWidth={1.5}
            size={moderateScale(25)}
          />
        </Button>
      </View>
    </Button>
  );

  const renderPhoneInput = () => (
    <Button activeOpacity={1} onPress={() => focusInput("phone")}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor:
              focusedInput === "phone" ? COLORS.secondary : COLORS.gray["200"],
            borderRadius: theme.borderRadius.medium,
          },
        ]}>
        <View style={styles.inputField}>
          <Typo
            variant="body"
            color={COLORS.gray["600"]}
            size={moderateScale(12)}>
            Phone Number
          </Typo>
          <TextInput
            ref={phoneRef}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor={theme.input.placeholder}
            keyboardType="phone-pad"
            onFocus={() => handleInputFocus("phone")}
            onBlur={handleInputBlur}
            style={styles.textInput}
          />
        </View>
        <Button onPress={() => clearInput("phone")}>
          <CircleX
            color={COLORS.gray["600"]}
            strokeWidth={1.5}
            size={moderateScale(25)}
          />
        </Button>
      </View>
    </Button>
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

  const navigation = useNavigation();

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
          {title || "Edit Personal Info"}
        </Typo>

        <Typo
          variant="body"
          color={COLORS.gray["600"]}
          style={styles.description}>
          {description || "Please update your information below."}
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
              opacity: isLoading ? 0.3 : 1,
            },
          ]}
          onPress={handleSave}>
          <Typo variant="button" size={moderateScale(20)} color={COLORS.white}>
            Save Changes
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
    backgroundColor: COLORS.gray["100"],
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
