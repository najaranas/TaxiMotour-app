import React, { useRef, useCallback, useEffect } from "react";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { CustomBottomSheetProps } from "@/types/Types";
import { COLORS } from "@/constants/theme";
import { horizontalScale, verticalScale } from "@/utils/styling";
import { useTheme } from "@/contexts/ThemeContext";

export default function CustomBottomSheetModal({
  snapPoints = [],
  children,
  enablePanDownToClose = false,
  enableOverDrag = false,
  showIndicator = true,
  enableContentPanningGesture = true,
  style,
  onChange,
  onClose,
  onRef,
  isVisible = false,
  zindex = 20,
  showBackdrop = true, // Default to true for backward compatibility
}: CustomBottomSheetProps & { isVisible?: boolean }) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { theme, themeName } = useTheme();

  // Pass the bottom sheet methods to parent component through callback
  useEffect(() => {
    if (onRef && bottomSheetModalRef.current) {
      onRef({
        snapToIndex: (index: number) =>
          bottomSheetModalRef.current?.snapToIndex(index),
        snapToPosition: (position: string | number) =>
          bottomSheetModalRef.current?.snapToPosition(position),
        expand: () => bottomSheetModalRef.current?.expand(),
        collapse: () => bottomSheetModalRef.current?.collapse(),
        close: () => bottomSheetModalRef.current?.close(),
        forceClose: () => bottomSheetModalRef.current?.forceClose(),
        present: () => bottomSheetModalRef.current?.present(),
        dismiss: () => bottomSheetModalRef.current?.dismiss(),
        ref: bottomSheetModalRef.current,
      });
    }
  }, [onRef]);

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      console.log("handleSheetChanges", index);
      onChange?.(index);
    },
    [onChange]
  );

  // Custom backdrop component that appears over tab bar
  const renderBackdrop = useCallback(
    (props: any) => (
      <>
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={themeName === "dark" ? 0.7 : 0.4}
          pressBehavior="close"
        />
      </>
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints.length > 0 ? snapPoints : undefined}
      enableDynamicSizing={snapPoints.length === 0} // Enable dynamic sizing when no snapPoints provided
      onDismiss={onClose}
      style={style}
      containerStyle={{
        zIndex: zindex,
      }}
      backdropComponent={showBackdrop ? renderBackdrop : undefined}
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
        backgroundColor: theme.surface,
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
    </BottomSheetModal>
  );
}
