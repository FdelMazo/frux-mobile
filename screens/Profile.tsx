import { StackNavigationProp } from "@react-navigation/stack";
import gql from "graphql-tag";
import * as React from "react";
import { useQuery } from "react-apollo";
import { Button, Div, Icon, Input, Text } from "react-native-magnus";
import {
  registration,
  resetPassword,
  signIn,
  signInWithGithub,
  useGithubAuth,
} from "../auth";
import Header from "../components/Header";
import { MainView, ScrollView, View } from "../components/Themed";
import Loading from "../components/Loading";
import User from "./User";
import { makeRedirectUri } from "expo-auth-session";

type Data = {
  profile: {
    dbId: number;
  };
};

type Navigation = StackNavigationProp<any>;

function Screen({ data, navigation }: { data: Data; navigation: Navigation }) {
  return data?.profile ? (
    <User dbId={data.profile.dbId} navigation={navigation} />
  ) : (
    <WelcomeScreen navigation={navigation} />
  );
}

const WelcomeScreen = ({ navigation }: { navigation: Navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState("");
  const [response, promptAsync] = useGithubAuth();

  React.useEffect(() => {
    // @ts-expect-error
    if (response?.type === "success") {
      signInWithGithub(response);
    }
  }, [response]);

  return (
    <View>
      <Header navigation={navigation} title="Welcome to FRUX" icon="logo" />
      <ScrollView>
        <MainView>
          <Div w="65%" mt="xl">
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Mail"
              editable={!loading}
              autoCompleteType="email"
            />

            <Input
              mt="sm"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              autoCompleteType="password"
              editable={!loading}
              secureTextEntry
            />

            <Text my="md" color="red">
              {errors}
            </Text>
            <Button
              mt="md"
              onPress={async () => {
                setErrors("");
                setLoading(true);
                try {
                  await signIn(email, password);
                } catch (err) {
                  setErrors(err.message);
                }
                setLoading(false);
              }}
              bg="fruxgreen"
              color="white"
              w="100%"
              loading={loading}
            >
              Login
            </Button>

            <Button
              mt="md"
              bg="white"
              onPress={async () => {
                setErrors("");
                setLoading(true);
                try {
                  await registration(email, password);
                } catch (err) {
                  setErrors(err.message);
                }
                setLoading(false);
              }}
              borderColor="fruxgreen"
              color="fruxgreen"
              borderWidth={1}
              disabled={loading}
              w="100%"
            >
              Sign Up
            </Button>
          </Div>

          <Div w="65%" mt="2xl">
            <Button
              block
              bg="white"
              onPress={async () => {
                setErrors("");
                setLoading(true);
                try {
                  // @ts-expect-error
                  await promptAsync({
                    useProxy: true,
                    redirectUri: makeRedirectUri({
                      useProxy: true,
                    }),
                  });
                } catch (err) {
                  setErrors(err.message);
                }
                setLoading(false);
              }}
              borderColor="fruxgreen"
              color="fruxgreen"
              borderWidth={1}
              w="100%"
              disabled={loading}
              suffix={
                <Icon
                  right={8}
                  position="absolute"
                  name="github"
                  fontFamily="AntDesign"
                />
              }
            >
              Sign In with Github
            </Button>

            <Button
              onPress={async () => {
                setErrors("");
                setLoading(true);
                resetPassword(email)
                  .then(() => setErrors("Email Sent!"))
                  .catch((err) => setErrors(err.message));
                setLoading(false);
              }}
              bg="white"
              color="fruxgreen"
              w="100%"
              disabled={loading}
            >
              I forgot my password
            </Button>
          </Div>
        </MainView>
      </ScrollView>
    </View>
  );
};

type Props = {
  dbId: number;
  navigation: Navigation;
};
export default function Render(props: Props) {
  const query = gql`
    query Profile {
      profile {
        dbId
      }
    }
  `;

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId },
  });
  if (loading) return <Loading />;
  return <Screen data={data} navigation={props.navigation} />;
}
