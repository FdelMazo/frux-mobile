import * as React from "react";

import { View } from "../components/Themed";
import { Button, Input, Div, Text, Skeleton } from "react-native-magnus";
import { signIn, registration, signInWithGithub } from "../auth";
import { Header } from "../components/Header";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { TopicContainer } from "../components/TopicContainer";

const UserScreen = ({ data }: { data?: any }) => {
  return (
    <>
      <Header
        title={data.user.username || data.user.mail}
        icon={data.user.picture}
      />
      <View>
        <Div w="65%" mt={25}>
          <Div mt={15}>
            <Text fontSize="xl">My Topics</Text>
            <Div row flexWrap="wrap">
              <TopicContainer
                name="Tech"
                img="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvectors%2Fcogwheel-gear-mechanism-icon-black-minimalist-icon-isolated-on-white-vector-id858148342%3Fk%3D6%26m%3D858148342%26s%3D170667a%26w%3D0%26h%3D9IjQ2MmVS2a0MS8qNQR-l4Gz5foaX1ILVtlYmp6DMak%3D&f=1&nofb=1"
              />
            </Div>
          </Div>
          <Div mt={15}>
            <Text fontSize="xl">My Projects</Text>
            <Skeleton.Box mt="sm" />
          </Div>
          <Div mt={15}>
            <Text fontSize="xl">My Seedlings</Text>
            <Skeleton.Box mt="sm" />
          </Div>
          <Div mt={15}>
            <Text fontSize="xl">My Favourites</Text>
            <Skeleton.Box mt="sm" />
          </Div>
          <Div mt={15}>
            <Text fontSize="xl">My Location</Text>
            <Skeleton.Box mt="sm" h="15vh" w="50vw" />
          </Div>
        </Div>
        <Div w="65%" justifyContent="space-between" mb={15} flexDir="row">
          <Div>
            <Text>{data.user.mail}</Text>
          </Div>

          <Button p={0} bg={undefined}>
            <Text color="fruxgreen">Change my password</Text>
          </Button>
        </Div>
      </View>
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
      username: "fede-capo",
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
