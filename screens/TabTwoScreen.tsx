import * as React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { Button, Input, Div, Icon } from "react-native-magnus";
import { signIn, registration } from "../auth";

export default function TabTwoScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <View style={styles.container}>
      <Div alignItems="center" flexWrap="wrap">
        <Input value={email} onChangeText={setEmail} placeholder="Mail" />

        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />

        <Button
          onPress={() => signIn(email, password)}
          mt="lg"
          px="xl"
          py="lg"
          bg="green700"
          color="white"
        >
          Login
        </Button>
        <Button
          onPress={() => registration(email, password, "username")}
          mt="lg"
          px="xl"
          py="lg"
          bg="green700"
          color="white"
        >
          Sign Up
        </Button>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </Div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
