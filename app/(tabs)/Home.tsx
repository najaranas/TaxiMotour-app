import { Button, StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import Map from "@/components/common/Map";
import { Drawer } from "react-native-drawer-layout";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <ScreenWrapper safeArea={false} style={styles.container}>
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderDrawerContent={() => {
          return <Text>Drawer content</Text>;
        }}>
        <Map />
        <View style={{ backgroundColor: "red", flex: 1 }}></View>
        <Button
          onPress={() => setOpen((prevOpen) => !prevOpen)}
          title={`${open ? "Close" : "Open"} drawer`}
        />
      </Drawer>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
