import { useRef, useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import Typo from "@/components/common/Typo";
import Button from "@/components/common/Button";
import { CloseIcon, SearchIcon } from "@/components/common/SvgIcons";
import LocationSearchInput from "./LocationSearchInput";
import LocationSuggestionItem from "./LocationSuggestionItem";
import { MapTilerFeature } from "@/types/Types";

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
  onClose?: () => void;
}

export default function RideBookingSheet({
  activeIndex,
  onSnapToIndex,
  currentLocation,
  destinationLocation,
  onCurrentLocationChange,
  onDestinationLocationChange,
  onRoadDataChange,
  onClose,
}: RideBookingSheetProps) {
  const insets = useSafeAreaInsets();
  const [locationInputFocused, setLocationInputFocused] = useState(false);
  const [destinationInputFocused, setDestinationInputFocused] = useState(false);
  const [activeInputData, setActiveInputData] = useState<
    "location" | "destination" | null
  >(null);
  const [searchData, setSearchData] = useState<any>(null);

  const locationInputRef = useRef<TextInput | null>(null);
  const destinationInputRef = useRef<TextInput | null>(null);

  const handleLocationSelect = (item: MapTilerFeature) => {
    const locationData = {
      place: item.text,
      lon: item.geometry.coordinates[0],
      lat: item.geometry.coordinates[1],
    };

    if (activeInputData === "destination") {
      onDestinationLocationChange(locationData);
      // Auto-update road data if both locations are set
      if (currentLocation && typeof currentLocation !== "string") {
        // Now TypeScript knows currentLocation is LocationData
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

  if (activeIndex === 0) {
    return (
      <BottomSheetView
        key="view1"
        style={{
          gap: 10,
          marginTop: verticalScale(5),
          paddingHorizontal: horizontalScale(15),
          padding: horizontalScale(16),
        }}>
        <Animated.View
          entering={FadeInRight.duration(300)}
          exiting={FadeOutLeft}>
          <Typo variant="h3">Let&apos;s go places.</Typo>
          <Button onPress={() => onSnapToIndex(1)} style={styles.searchButton}>
            <SearchIcon size={horizontalScale(20)} />
            <Typo variant="body">Where to go ?</Typo>
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
        style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <Button onPress={() => onClose?.() || onSnapToIndex(0)}>
            <CloseIcon size={horizontalScale(25)} />
          </Button>
          <Typo variant="h3">Take a ride</Typo>
        </View>

        <View style={styles.inputSection}>
          <LocationSearchInput
            placeholder="Current location"
            value={currentLocation}
            onValueChange={onCurrentLocationChange}
            onFocus={() => handleLocationFocus("location")}
            onBlur={() => handleLocationBlur("location")}
            isFocused={locationInputFocused}
            inputRef={locationInputRef}
            onSearchDataChange={setSearchData}
          />
          <LocationSearchInput
            placeholder="Where to go?"
            value={destinationLocation}
            onValueChange={onDestinationLocationChange}
            onFocus={() => handleLocationFocus("destination")}
            onBlur={() => handleLocationBlur("destination")}
            isFocused={destinationInputFocused}
            inputRef={destinationInputRef}
            onSearchDataChange={setSearchData}
          />
        </View>
      </Animated.View>

      <BottomSheetScrollView
        key="view2"
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          enabled={true}>
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
        </KeyboardAwareScrollView>
      </BottomSheetScrollView>
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
    gap: horizontalScale(5),
  },
  inputSection: {
    gap: verticalScale(10),
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray["200"],
    paddingBottom: verticalScale(15),
    paddingHorizontal: horizontalScale(15),
  },
  searchButton: {
    backgroundColor: COLORS.gray["100"],
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
  },
  scrollContent: {
    flexGrow: 1,
  },
  suggestionsContainer: {
    paddingHorizontal: horizontalScale(15),
  },
});
