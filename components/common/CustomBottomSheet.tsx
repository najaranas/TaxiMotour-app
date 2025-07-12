import React, { useRef, useCallback } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { CustomBottomSheetProps } from "@/types/Types";
import { COLORS } from "@/constants/theme";
import { horizontalScale, verticalScale } from "@/utils/styling";

export default function CustomBottomSheet({
  snapPoints,
  children,
  enablePanDownToClose = false,
  enableOverDrag = false,
  showIndicator = true,
  enableContentPanningGesture = true,
  style,
  onChange,
  onRef,
}: CustomBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Pass the bottom sheet methods to parent component through callback
  React.useEffect(() => {
    if (onRef && bottomSheetRef.current) {
      onRef({
        snapToIndex: (index: number) =>
          bottomSheetRef.current?.snapToIndex(index),
        snapToPosition: (position: string | number) =>
          bottomSheetRef.current?.snapToPosition(position),
        expand: () => bottomSheetRef.current?.expand(),
        collapse: () => bottomSheetRef.current?.collapse(),
        close: () => bottomSheetRef.current?.close(),
        forceClose: () => bottomSheetRef.current?.forceClose(),
        ref: bottomSheetRef.current,
      });
    }
  }, [onRef]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      console.log("handleSheetChanges", index);
      onChange?.(index);
    },
    [onChange]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      style={style}
      containerStyle={{ zIndex: 10 }}
      handleIndicatorStyle={
        showIndicator
          ? {
              backgroundColor: COLORS.gray["300"],
              width: horizontalScale(35),
              height: verticalScale(4.5),
            }
          : { display: "none" }
      }
      onChange={handleSheetChanges}
      enableOverDrag={enableOverDrag}
      enableContentPanningGesture={enableContentPanningGesture}
      enablePanDownToClose={enablePanDownToClose}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize">
      {children}
    </BottomSheet>
  );
}
