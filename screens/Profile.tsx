import * as React from "react";

import { View, ScrollView } from "../components/Themed";
import { Button, Input, Div, Text, Skeleton, Icon } from "react-native-magnus";
import {
  signIn,
  registration,
  signInWithGithub,
  loggingOut,
  useAuth,
} from "../auth";
import { Header } from "../components/Header";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { TopicContainer } from "../components/TopicContainer";

const UserScreen = ({ data }: { data?: any }) => {
  return data.profile ? (
    <View>
      <Header
        title={data.profile.username || data.profile.email}
        icon={data.profile.picture || "seed"}
      />
      <ScrollView>
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
            <Skeleton.Box mt="sm" />
          </Div>
        </Div>
        <Div w="65%" justifyContent="space-between" mb={15} flexDir="row">
          <Div>
            <Text>{data.profile.email}</Text>
          </Div>

          <Button p={0} bg={undefined}>
            <Text color="fruxgreen">Change my password</Text>
          </Button>

          <Button p={0} bg={undefined} onPress={() => loggingOut()}>
            <Text color="red500">Log Out</Text>
          </Button>
        </Div>
      </ScrollView>
    </View>
  ) : (
    <WelcomeScreen />
  );
};
const WelcomeScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <View>
      <Header title="Welcome to FRUX" icon="logo" />
      <ScrollView>
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
          <Button mb={15} bg="white" color="fruxgreen" w="100%">
            I forgot my password
          </Button>
        </Div>
      </ScrollView>
    </View>
  );
};

export default function RenderProfile(props: any) {
  const query = gql`
    query Profile {
      profile {
        id
        email
      }
    }
  `;
  const UserScreenRender = graphql(query)(UserScreen);

  return <UserScreenRender {...props} />;
}
