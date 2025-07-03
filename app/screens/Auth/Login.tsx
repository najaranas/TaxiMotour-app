import PhoneNumberField from "@/components/common/PhoneNumberField";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Typo from "@/components/common/Typo";
import THEME from "@/constants/theme";
import { View } from "react-native";

export default function Login() {
  return (
    <ScreenWrapper padding={20}>
      <View>
        <Typo color={THEME.text.primary} variant="h3">
          Enter you numbers
        </Typo>
        <PhoneNumberField />
      </View>
    </ScreenWrapper>
  );
}
