import { useRef, useState } from "react";
import { TextInput, View, StyleSheet, Keyboard } from "react-native";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Typo from "@/components/common/Typo";
import Button from "@/components/common/Button";
import { CloseIcon, SearchIcon } from "@/components/common/SvgIcons";
import LocationSearchInput from "./LocationSearchInput";
import LocationSuggestionItem from "./LocationSuggestionItem";
import { MapTilerFeature } from "@/types/Types";
import BottomSheetKeyboardAwareScrollView from "../common/BottomSheetKeyboardAwareScrollView";
import { useTranslation } from "react-i18next";
import SkeletonPlaceholder, {
  SkeletonCircle,
  SkeletonRect,
  SkeletonText,
} from "../common/SkeletonPlaceholder";

interface LocationData {
  place?: string;
  lon?: number | null;
  lat?: number | null;
}

interface RideBookingSheetProps {
  activeIndex: number;
  onSnapToIndex: (index: number) => void;
  currentLocation: LocationData | string;
  destinationLocation: LocationData | string;
  onCurrentLocationChange: (location: LocationData) => void;
  onDestinationLocationChange: (location: LocationData) => void;
  onRoadDataChange: (roadData: LocationData[]) => void;
}

export default function RideBookingSheet({
  activeIndex,
  onSnapToIndex,
  currentLocation,
  destinationLocation,
  onCurrentLocationChange,
  onDestinationLocationChange,
  onRoadDataChange,
}: RideBookingSheetProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [locationInputFocused, setLocationInputFocused] = useState(false);
  const [destinationInputFocused, setDestinationInputFocused] = useState(false);
  const [activeInputData, setActiveInputData] = useState<
    "location" | "destination" | null
  >(null);
  const [searchData, setSearchData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean | null>(null);

  const locationInputRef = useRef<TextInput | null>(null);
  const destinationInputRef = useRef<TextInput | null>(null);

  const handleLocationSelect = (item: MapTilerFeature) => {
    Keyboard.dismiss();
    setTimeout(() => {
      const locationData = {
        place: item.text,
        lon: item.geometry.coordinates[0],
        lat: item.geometry.coordinates[1],
      };

      if (activeInputData === "destination") {
        onDestinationLocationChange(locationData);
        // Auto-update road data if both locations are set
        if (currentLocation && typeof currentLocation !== "string") {
          if (currentLocation.place) {
            onRoadDataChange([currentLocation, locationData]);
            onSnapToIndex(0);
            return;
          }
        }

        locationInputRef.current?.focus();
      } else {
        onCurrentLocationChange(locationData);

        if (destinationLocation && typeof destinationLocation !== "string") {
          // Now TypeScript knows destinationLocation is LocationData
          if (destinationLocation.place) {
            onRoadDataChange([locationData, destinationLocation]);
            onSnapToIndex(0);
            return;
          }
        }
        destinationInputRef.current?.focus();

        // Auto-update road data if both locations are set
      }
    }, 100);
  };

  const handleLocationRefine = (item: MapTilerFeature) => {
    const locationData = {
      place: item.text,
      lon: item.geometry.coordinates[0],
      lat: item.geometry.coordinates[1],
    };

    if (activeInputData === "destination") {
      onDestinationLocationChange(locationData);
      destinationInputRef.current?.focus();
    } else {
      onCurrentLocationChange(locationData);
      locationInputRef.current?.focus();
    }
  };

  const handleLocationFocus = (type: "location" | "destination") => {
    setActiveInputData(type);
    if (type === "location") {
      setLocationInputFocused(true);
    } else {
      setDestinationInputFocused(true);
    }
  };

  const handleLocationBlur = (type: "location" | "destination") => {
    if (type === "location") {
      setLocationInputFocused(false);
    } else {
      setDestinationInputFocused(false);
    }
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      onSnapToIndex(0);
    }, 100);
  };

  if (activeIndex === 0) {
    return (
      <BottomSheetView
        key="view1"
        style={{
          gap: 10,
          marginTop: verticalScale(5),
          paddingHorizontal: horizontalScale(15),
          padding: horizontalScale(16),
          backgroundColor: theme.background,
        }}>
        <Animated.View
          entering={FadeInRight.duration(300)}
          exiting={FadeOutLeft}>
          <Typo variant="h3">{t("home.letsGoPlaces")}</Typo>
          <Button
            onPress={() => onSnapToIndex(2)}
            style={[
              styles.searchButton,
              { backgroundColor: theme.input.background },
            ]}>
            <SearchIcon
              color={theme.text.secondary}
              size={horizontalScale(20)}
            />
            <Typo variant="body">{t("home.whereToGo")}</Typo>
          </Button>
        </Animated.View>
      </BottomSheetView>
    );
  }

  return (
    <>
      <Animated.View
        entering={FadeInRight.duration(300)}
        exiting={FadeOutLeft}
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            backgroundColor: theme.background,
            borderBottomColor: theme.input.border,
          },
        ]}>
        <View style={styles.headerContent}>
          <Button onPress={handleClose}>
            <CloseIcon size={horizontalScale(25)} color={theme.text.primary} />
          </Button>
          <Typo variant="h3" color={theme.text.primary}>
            {t("home.takeARide")}
          </Typo>
        </View>

        <View
          style={[
            styles.inputSection,
            { borderBottomColor: theme.input.border },
          ]}>
          <LocationSearchInput
            placeholder={t("placeholders.currentLocation")}
            value={currentLocation}
            onValueChange={onCurrentLocationChange}
            onFocus={() => handleLocationFocus("location")}
            onBlur={() => handleLocationBlur("location")}
            isFocused={locationInputFocused}
            inputRef={locationInputRef}
            onSearchDataChange={setSearchData}
            setIsDataLoading={setIsDataLoading}
          />
          <LocationSearchInput
            placeholder={t("placeholders.destination")}
            value={destinationLocation}
            onValueChange={onDestinationLocationChange}
            onFocus={() => handleLocationFocus("destination")}
            onBlur={() => handleLocationBlur("destination")}
            isFocused={destinationInputFocused}
            inputRef={destinationInputRef}
            onSearchDataChange={setSearchData}
            setIsDataLoading={setIsDataLoading}
          />
        </View>
      </Animated.View>

      <BottomSheetKeyboardAwareScrollView
        key="view2"
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {isDataLoading ? (
          <Animated.View
            style={{ flex: 1, gap: verticalScale(20) }}
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft}>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: horizontalScale(15),
                alignItems: "center",
                gap: horizontalScale(10),
                marginTop: verticalScale(35),
              }}>
              <SkeletonPlaceholder animationType="shimmer">
                <View
                  style={{
                    width: horizontalScale(40),
                    height: verticalScale(40),
                    borderRadius: "50%",
                  }}
                />
              </SkeletonPlaceholder>
              <View style={{ flex: 1, gap: verticalScale(10) }}>
                <SkeletonPlaceholder animationType="shimmer">
                  <View
                    style={{
                      width: "100%",
                      height: verticalScale(20),
                      borderRadius: moderateScale(10),
                    }}
                  />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder animationType="shimmer">
                  <View
                    style={{
                      width: "100%",
                      height: verticalScale(20),
                      borderRadius: moderateScale(10),
                    }}
                  />
                </SkeletonPlaceholder>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: horizontalScale(15),
                alignItems: "center",
                gap: horizontalScale(10),
                marginTop: verticalScale(35),
              }}>
              <SkeletonPlaceholder animationType="shimmer">
                <View
                  style={{
                    width: horizontalScale(40),
                    height: verticalScale(40),
                    borderRadius: "50%",
                  }}
                />
              </SkeletonPlaceholder>
              <View style={{ flex: 1, gap: verticalScale(10) }}>
                <SkeletonPlaceholder animationType="shimmer">
                  <View
                    style={{
                      width: "100%",
                      height: verticalScale(20),
                      borderRadius: moderateScale(10),
                    }}
                  />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder animationType="shimmer">
                  <View
                    style={{
                      width: "100%",
                      height: verticalScale(20),
                      borderRadius: moderateScale(10),
                    }}
                  />
                </SkeletonPlaceholder>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: horizontalScale(15),
                alignItems: "center",
                gap: horizontalScale(10),
                marginTop: verticalScale(35),
              }}>
              <SkeletonPlaceholder animationType="shimmer">
                <View
                  style={{
                    width: horizontalScale(40),
                    height: verticalScale(40),
                    borderRadius: "50%",
                  }}
                />
              </SkeletonPlaceholder>
              <View style={{ flex: 1, gap: verticalScale(10) }}>
                <SkeletonPlaceholder animationType="shimmer">
                  <View
                    style={{
                      width: "100%",
                      height: verticalScale(20),
                      borderRadius: moderateScale(10),
                    }}
                  />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder animationType="shimmer">
                  <View
                    style={{
                      width: "100%",
                      height: verticalScale(20),
                      borderRadius: moderateScale(10),
                    }}
                  />
                </SkeletonPlaceholder>
              </View>
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft}
            style={styles.suggestionsContainer}>
            {searchData?.features?.map(
              (item: MapTilerFeature, index: number) => (
                <LocationSuggestionItem
                  key={index}
                  item={item}
                  index={index}
                  isLast={searchData.features.length - 1 === index}
                  onSelect={handleLocationSelect}
                  onRefine={handleLocationRefine}
                />
              )
            )}
          </Animated.View>
        )}
      </BottomSheetKeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: verticalScale(15),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(15),
    gap: horizontalScale(15),
  },
  inputSection: {
    gap: verticalScale(10),
    borderBottomWidth: 2,
    paddingBottom: verticalScale(15),
    paddingHorizontal: horizontalScale(15),
  },
  searchButton: {
    padding: horizontalScale(15),
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    marginTop: verticalScale(10),
  },
  scrollView: {
    flex: 1,
    marginTop: verticalScale(15),
    backgroundColor: "red",
  },
  scrollContent: {
    flexGrow: 1,
  },
  suggestionsContainer: {
    paddingHorizontal: horizontalScale(15),
  },
});
