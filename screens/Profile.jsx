import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import { Button, Div, Icon, Input, Text } from "react-native-magnus";
import Header from "../components/Header";
import { MainView, View } from "../components/Themed";
import { redirectToGithub, signInWithGithub } from "../services/oauth";
import { registration, resetPassword, signIn, useUser } from "../services/user";
import Loading from "./Loading";
import User from "./User";

const WelcomeScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState("");

  return (
    <View>
      <Header navigation={navigation} title="Welcome to FRUX" icon="logo" />
      <MainView>
        <Div></Div>
        <Div w="65%">
          <Input
            my="xs"
            value={email}
            onChangeText={setEmail}
            placeholder="Mail"
            editable={!loading}
            autoCompleteType="email"
          />

          <Input
            my="xs"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            autoCompleteType="password"
            editable={!loading}
            secureTextEntry
          />

          <Text my="md" color="fruxred">
            {errors}
          </Text>

          <Div my="md">
            <Button
              my="xs"
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
              my="xs"
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
        </Div>

        <Div w="65%" my="lg">
          <Button
            block
            my="xs"
            bg="white"
            onPress={async () => {
              setErrors("");
              try {
                setLoading(true);
                const response = await redirectToGithub();
                await signInWithGithub(response);
              } catch (err) {
                setErrors(err.message);
                setLoading(false);
              }
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
            my="xs"
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
    query Profile($isLogged: Boolean!) {
      profile @include(if: $isLogged) {
        id
        dbId
      }
    }
  `;

  const { user } = useUser();
  const { loading, error, data } = useQuery(query, {
    variables: { isLogged: !!user },
  });
  // if (error) return <Error errors={[error]} />;
  if (loading) return <Loading />;
  return !!data?.profile ? (
    <User dbId={data.profile.dbId} navigation={props.navigation} />
  ) : (
    <WelcomeScreen navigation={props.navigation} />
  );
}
