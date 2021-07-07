import { gql, useQuery } from "@apollo/client";
import { makeRedirectUri, startAsync } from "expo-auth-session";
import * as React from "react";
import { Button, Div, Icon, Input, Text } from "react-native-magnus";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { MainView, View } from "../components/Themed";
import { useGithubAuth } from "../services/oauth";
import { registration, resetPassword, signIn, useUser } from "../services/user";
import { OAUTH_CLIENT_ID } from "@env";
import User from "./User";

function Screen({ data, navigation }) {
  return data?.profile ? (
    <User dbId={data.profile.dbId} navigation={navigation} />
  ) : (
    <WelcomeScreen navigation={navigation} />
  );
}

const WelcomeScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState("");
  const [githubResponse, redirectToGithub] = useGithubAuth();

  React.useEffect(() => {
    // setLoading(true);
    // signInWithGithub(githubResponse);
    // setLoading(false);
  }, [githubResponse]);

  return (
    <View>
      <Header navigation={navigation} title="Welcome to FRUX" icon="logo" />
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
                setLoading(false);
              }
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
                setLoading(false);
              }
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
              let r = null;
              try {
                r = await startAsync({
                  authUrl: `https://github.com/login/oauth/authorize?client_id=${OAUTH_CLIENT_ID}&scope=identity&redirect_uri=${makeRedirectUri(
                    {
                      scheme: "frux",
                      path: "oauth",
                    }
                  )}`,
                  returnUrl: makeRedirectUri({
                    scheme: "frux",
                    path: "oauth",
                  }),
                });
              } catch (err) {
                setErrors(err.message);
              }
              // if (r.type === "dismiss") {
              // setErrors("Sign in dismissed");
              setErrors(JSON.stringify(r));
              // }
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
    </View>
  );
};

export default function Render(props) {
  const query = gql`
    query Profile {
      profile {
        dbId
      }
    }
  `;

  const { loading, error, data } = useQuery(query);
  const { token } = useUser();
  if (token && error) alert(JSON.stringify(error));
  if (loading) return <Loading />;
  return <Screen data={data} navigation={props.navigation} />;
}
