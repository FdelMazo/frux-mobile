import * as React from "react";
import { StyleSheet } from "react-native";

import { View } from "../components/Themed";
import { Button, Input, Div } from "react-native-magnus";
import { signIn, registration, signInWithGithub } from "../auth";
import { Header } from "../components/Header";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
export default function Profile() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const query = gql`
    query AllUsersQuery {
      allUsers {
        edges {
          node {
            name
          }
        }
      }
    }
  `;

  const Name = ({ data }: { data: any }) => {
    return (
      <>GraphQL Thingy: {JSON.stringify(data.allUsers?.edges[0].node.name)}</>
    );
  };

  const NameWithApo = graphql(query)(Name);

  return (
    <>
      <Header title="Welcome to FRUX" icon="logo" />
      <NameWithApo />
      <View style={styles.container}>
        <Div w="65%" mt={25}>
          <Input
            my={8}
            value={email}
            onChangeText={setEmail}
            placeholder="Mail"
          />

          <Input
            my={8}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />

          <Button
            my={8}
            onPress={() => signIn(email, password)}
            bg="fruxgreen"
            color="white"
            w="100%"
          >
            Login
          </Button>
          <Button
            my={8}
            bg="white"
            onPress={() => registration(email, password)}
            borderColor="fruxgreen"
            color="fruxgreen"
            borderWidth={1}
            w="100%"
          >
            Sign Up
          </Button>
        </Div>
        <Div w="65%">
          <Button
            my={15}
            bg="white"
            onPress={() => signInWithGithub()}
            borderColor="fruxgreen"
            color="fruxgreen"
            borderWidth={1}
            w="100%"
          >
            Sign In with Google
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
    justifyContent: "space-between",
  },
});
