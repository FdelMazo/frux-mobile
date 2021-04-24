import * as React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { View } from "../components/Themed";
import { Text, Button } from "react-native-magnus";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text>frux</Text>
      <Text>hello world</Text>
      <Button
        mt="lg"
        px="xl"
        py="lg"
        bg="white"
        borderWidth={1}
        borderColor="red500"
        color="red500"
        underlayColor="red100"
        alignSelf="center"
      >
        Button Test
      </Button>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
