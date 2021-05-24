import * as React from "react";

import { View, ScrollView, MainView } from "../components/Themed";
import { Button, Input, Div, Text, Skeleton, Icon } from "react-native-magnus";
import {
  signIn,
  registration,
  signInWithGoogle,
  useGoogleAuth,
  resetPassword,
} from "../auth";
import { Header } from "../components/Header";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import User from "./User";

const Profile = ({ data }: { data?: any }) => {
  return data.profile ? <User data={data} /> : <WelcomeScreen />;
};

const WelcomeScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState("");
  const [response, googleSignIn] = useGoogleAuth();

  React.useEffect(() => {
    if (response?.type === "success") {
      signInWithGoogle(response);
    }
  }, [response]);

  return (
    <View>
      <Header title="Welcome to FRUX" icon="logo" />
      <ScrollView>
        <MainView>
          <Div w="65%" mt={25}>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Mail"
              editable={!loading}
              autoCompleteType="email"
            />

            <Input
              mt={8}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              autoCompleteType="password"
              editable={!loading}
              secureTextEntry
            />

            <Text my={8} color="red">
              {errors}
            </Text>
            <Button
              mt={8}
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
              mt={8}
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

          <Div w="65%" mt={25}>
            <Button
              block
              bg="white"
              onPress={async () => {
                setErrors("");
                setLoading(true);
                try {
                  await googleSignIn();
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
                  name="google"
                  fontFamily="AntDesign"
                />
              }
            >
              Sign In with Google
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

export default function RenderProfile(props: any) {
  const query = gql`
    query Profile {
      profile {
        id
      }
    }
  `;
  const ProfileScreenRenderer = graphql(query)(Profile);

  return <ProfileScreenRenderer {...props} />;
}
