import Button from "./Button";
import { useRouter } from "expo-router";
import { LeftArrowIcon } from "./SvgIcons";
import { horizontalScale, verticalScale } from "@/utils/styling";

export default function BackButton() {
  const route = useRouter();

  return (
    <Button onPress={route.back}>
      <LeftArrowIcon width={horizontalScale(30)} height={verticalScale(30)} />
    </Button>
  );
}
