import { CustomDrawerProps } from "@/types/Types";
import { View } from "react-native";
import { Drawer } from "react-native-drawer-layout";
export default function CustomDrawer({
  open,
  onOpen,
  onClose,
  style,
  children,
  ...props
}: CustomDrawerProps) {
  return (
    <Drawer
      {...props}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      renderDrawerContent={() => children}
      style={style}>
      <View />
    </Drawer>
  );
}
