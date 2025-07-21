import { View, Image, StyleSheet } from "react-native";
import { horizontalScale, moderateScale } from "@/utils/styling";
import { UserIcon } from "@/components/common/SvgIcons";
import { COLORS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/common/Button";
import { Pencil } from "lucide-react-native";

interface UserProfileImageProps {
  imageUrl?: string;
  hasImage?: boolean;
  onPress?: () => void;
  size?: number;
  showEditIcon?: boolean;
  editable?: boolean;
}

export default function UserProfileImage({
  imageUrl,
  hasImage,
  onPress,
  size = 100,
  showEditIcon = true,
  editable = true,
}: UserProfileImageProps) {
  const { theme } = useTheme();
  const imageSize = horizontalScale(size);

  const content = (
    <View
      style={[
        styles.profileImageWrapper,
        { width: imageSize, height: imageSize },
      ]}>
      {hasImage ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.profileImage,
            {
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.profileImagePlaceholder,
            {
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize / 2,
            },
          ]}>
          <UserIcon
            color={COLORS.gray["600"]}
            bold
            size={horizontalScale(size * 0.7)}
          />
        </View>
      )}
      {showEditIcon && (
        <View
          style={[
            styles.profileEditIconWrapper,
            { backgroundColor: theme.background },
          ]}>
          <View style={styles.profileEditIconInner}>
            <Pencil
              color={COLORS.white}
              strokeWidth={1.5}
              size={moderateScale(size * 0.2)}
            />
          </View>
        </View>
      )}
    </View>
  );

  if (editable && onPress) {
    return <Button onPress={onPress}>{content}</Button>;
  }

  return content;
}

const styles = StyleSheet.create({
  profileImageWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    backgroundColor: COLORS.gray["100"],
    alignItems: "center",
    justifyContent: "center",
  },
  profileImagePlaceholder: {
    backgroundColor: COLORS.gray["100"],
    alignItems: "center",
    justifyContent: "center",
  },
  profileEditIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: -horizontalScale(5),
    borderRadius: 50,
    padding: horizontalScale(3),
  },
  profileEditIconInner: {
    backgroundColor: COLORS.secondary,
    borderRadius: 50,
    padding: horizontalScale(7),
  },
});
