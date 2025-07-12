import React from "react";
import { View, StyleSheet } from "react-native";
import { LocationIcon, TopIcon } from "@/components/common/SvgIcons";
import { COLORS, FONTS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Typo from "@/components/common/Typo";
import Button from "@/components/common/Button";
import { MapTilerFeature } from "@/types/Types";

interface LocationSuggestionItemProps {
  item: MapTilerFeature;
  index: number;
  isLast: boolean;
  onSelect: (item: MapTilerFeature) => void;
  onRefine: (item: MapTilerFeature) => void;
}

export default function LocationSuggestionItem({
  item,
  index,
  isLast,
  onSelect,
  onRefine,
}: LocationSuggestionItemProps) {
  return (
    <Button onPress={() => onSelect(item)}>
      <View
        style={[
          styles.suggestionItem,
          {
            paddingTop: index === 0 ? 0 : verticalScale(20),
            borderBottomWidth: isLast ? 0 : 1,
          },
        ]}>
        <LocationIcon size={horizontalScale(25)} />
        <View style={styles.textContainer}>
          <Typo
            numberOfLines={1}
            color={COLORS.secondary}
            variant="body"
            size={moderateScale(15)}
            fontFamily={FONTS.medium}>
            {item.text}
          </Typo>
          <Typo
            numberOfLines={1}
            color={COLORS.gray["600"]}
            variant="body"
            size={moderateScale(13)}>
            {item.place_name}
          </Typo>
        </View>
        <Button onPress={() => onRefine(item)}>
          <TopIcon size={horizontalScale(25)} />
        </Button>
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
    paddingVertical: verticalScale(20),
    borderBottomColor: COLORS.gray["200"],
  },
  textContainer: {
    flex: 1,
    gap: verticalScale(5),
  },
});
