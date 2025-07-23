import Button from "./Button";
import { useRouter } from "expo-router";
import { moderateScale } from "@/utils/styling";
import { useTheme } from "@/contexts/ThemeContext";
import { I18nManager } from "react-native";
import { ArrowLeft, ArrowRight, X } from "lucide-react-native";

type BackButtonProps = {
  variant?: "arrow" | "close";
  disabled?: boolean;
};

export default function BackButton({
  variant = "arrow",
  disabled = false,
}: BackButtonProps) {
  const route = useRouter();
  const { theme } = useTheme();

  return (
    <Button onPress={route.back} disabled={disabled}>
      {variant === "arrow" ? (
        I18nManager.isRTL ? (
          <ArrowRight
            color={theme.text.primary}
            strokeWidth={1.5}
            size={moderateScale(25)}
          />
        ) : (
          <ArrowLeft
            color={theme.text.primary}
            strokeWidth={1.5}
            size={moderateScale(25)}
          />
        )
      ) : (
        <X
          color={theme.text.primary}
          strokeWidth={1.5}
          size={moderateScale(25)}
        />
      )}
    </Button>
  );
}
