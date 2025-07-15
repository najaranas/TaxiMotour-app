import Button from "./Button";
import { useRouter } from "expo-router";
import { LeftArrowIcon } from "./SvgIcons";
import { horizontalScale } from "@/utils/styling";
import THEME from "@/constants/theme";
import React from "react";
import { Text } from "react-native";

// Placeholder for CloseIcon; replace with your actual icon if available
const CloseIcon = (props: { color: string; size: number }) => (
  <Text style={{ color: props.color, fontSize: props.size }}>×</Text>
);

type BackButtonProps = {
  variant?: "arrow" | "close";
};

export default function BackButton({ variant = "arrow" }: BackButtonProps) {
  const route = useRouter();

  return (
    <Button onPress={route.back}>
      {variant === "arrow" ? (
        <LeftArrowIcon color={THEME.text.primary} size={horizontalScale(30)} />
      ) : (
        <CloseIcon color={THEME.text.primary} size={horizontalScale(30)} />
      )}
    </Button>
  );
}
