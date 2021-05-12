import * as React from "react";

import { View } from "../components/Themed";
import { Button, Input, Div } from "react-native-magnus";
import { signIn, registration, signInWithGithub } from "../auth";
import { Header } from "../components/Header";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

const UserScreen = ({ data }: { data?: any }) => {
  return (
    <>
      <Header title={data.user.username || data.user.mail} icon="logo" />
      <View></View>
    </>
  );
};
const WelcomeScreen = ({ setLogged }: { setLogged?: any }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <>
      <Header title="Welcome to FRUX" icon="logo" />
      <View>
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
            // onPress={() => signIn(email, password)}
            onPress={() => setLogged(true)}
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
          <Button mb={15} bg="white" color="fruxgreen" w="100%">
            I forgot my password
          </Button>
        </Div>
      </View>
    </>
  );
};

export default function RenderProfile(props: any) {
  const [logged, setLogged] = React.useState(false);
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
  const mockedData = {
    user: {
      username: "Federico",
      mail: "fededm97@hotmail.com",
      picture: "seed",
    },
  };
  // const UserScreenRender = graphql(query)(UserScreen);

  return (
    <>
      {logged ? (
        <UserScreen data={mockedData} {...props} />
      ) : (
        // <UserScreenRender {...props} />
        <WelcomeScreen setLogged={setLogged} />
      )}
    </>
  );

  return;
}
