import React, { useRef, useCallback, useEffect } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { CustomBottomSheetProps } from "@/types/Types";
import { COLORS } from "@/constants/theme";
import { horizontalScale, verticalScale } from "@/utils/styling";
import { useTheme } from "@/contexts/ThemeContext";

export default function CustomBottomSheet({
  snapPoints,
  children,
  enablePanDownToClose = false,
  enableOverDrag = false,
  showIndicator = true,
  enableContentPanningGesture = true,
  style,
  onChange,
  onClose,
  onRef,
  index,
  zindex,
}: CustomBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { theme } = useTheme();

  useEffect(() => {
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
      onClose={onClose}
      style={style}
      index={index}
      containerStyle={{
        zIndex: zindex,
      }}
      handleIndicatorStyle={
        showIndicator
          ? {
              backgroundColor: COLORS.gray["300"],
              width: horizontalScale(35),
              height: verticalScale(4.5),
            }
          : { display: "none" }
      }
      backgroundStyle={{
        backgroundColor: theme.background,
        borderRadius: theme.borderRadius.pill,
      }}
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
