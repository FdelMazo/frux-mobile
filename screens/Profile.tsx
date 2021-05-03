import * as React from "react";
import { StyleSheet } from "react-native";

import { View } from "../components/Themed";
import { Button, Input, Div, Icon } from "react-native-magnus";
import { signIn, registration } from "../auth";
import { Header } from "../components/Header";

export default function Profile() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <>
      <Header title="Welcome to FRUX" icon="logo" />
      <View style={styles.container}>
        <Div alignItems="center">
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
            bg="#006442"
            color="white"
          >
            Login
          </Button>
          <Button
            onPress={() => registration(email, password)}
            mt="lg"
            px="xl"
            py="lg"
            bg="#006442"
            color="white"
          >
            Sign Up
          </Button>
        </Div>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
