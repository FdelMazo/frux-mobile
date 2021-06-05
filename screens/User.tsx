import gql from "graphql-tag";
import * as React from "react";
import { useMutation, useQuery } from "react-apollo";
import { FlatList } from "react-native-gesture-handler";
import { Button, Div, Dropdown, Icon, Input, Text } from "react-native-magnus";
import { resetPassword } from "../auth";
import { Header } from "../components/Header";
import { MainView, ScrollView, View } from "../components/Themed";

const User = ({ data, mutations }) => {
  const defaultName = data.user.name || data.user.email.split("@")[0];
  const [name, setName] = React.useState(defaultName);
  const [emailSent, setEmailSent] = React.useState(false);
  const dropdownRef = React.createRef();

  return (
    <View>
      <Header
        onPress={() => dropdownRef.current.open()}
        title={defaultName}
        icon={data.user.picture || "seed"}
      />

      <ScrollView>
        <MainView></MainView>
      </ScrollView>

      <Dropdown
        ref={dropdownRef}
        title={
          <Div alignSelf="center">
            <Input
              placeholder="Username"
              w="65%"
              focusBorderColor="blue700"
              value={name}
              onChangeText={setName}
              suffix={
                <>
                  {name !== defaultName && (
                    <Button
                      bg={undefined}
                      p={0}
                      onPress={() => {
                        mutations.mutateName({
                          variables: {
                            name: name,
                          },
                        });
                      }}
                    >
                      <Icon name="check" color="gray900" fontFamily="Feather" />
                    </Button>
                  )}
                </>
              }
            />
            <Div flexDir="row" justifyContent="space-between">
              <Text mt={10} fontSize="sm">
                {data.user.email}
              </Text>
              <Text
                mt={10}
                onPress={() => {
                  if (emailSent) return;
                  resetPassword(data.user.email).then(() => setEmailSent(true));
                }}
                textAlign="right"
                color={emailSent ? "black" : "fruxgreen"}
                fontSize="sm"
              >
                {emailSent ? "Mail Sent!" : "Reset password"}
              </Text>
            </Div>
          </Div>
        }
        showSwipeIndicator={true}
        roundedTop="xl"
      >
        <Dropdown.Option justifyContent="space-evenly">
          <Button bg={undefined}>
            <Icon
              bg="fruxbrown"
              h={40}
              w={40}
              rounded="circle"
              name={"seed-outline"}
              color="fruxgreen"
              borderWidth={2}
              borderColor="fruxgreen"
              fontSize="2xl"
              fontFamily={"MaterialCommunityIcons"}
            />
          </Button>
          <Button bg={undefined}>
            <Icon
              bg="fruxbrown"
              h={40}
              w={40}
              rounded="circle"
              name={"seedling"}
              color="fruxgreen"
              borderWidth={2}
              fontSize="2xl"
              fontFamily={"FontAwesome5"}
            />
          </Button>
          <Button bg={undefined}>
            <Icon
              bg="fruxbrown"
              h={40}
              w={40}
              rounded="circle"
              name={"tree"}
              color="fruxgreen"
              borderWidth={2}
              fontSize="2xl"
              fontFamily={"Entypo"}
            />
          </Button>
          <Button bg={undefined}>
            <Icon
              bg="fruxbrown"
              h={40}
              w={40}
              rounded="circle"
              name={"seed"}
              color="fruxgreen"
              borderWidth={2}
              fontSize="2xl"
              fontFamily={"MaterialCommunityIcons"}
            />
          </Button>
          <Button bg={undefined}>
            <Icon
              bg="fruxbrown"
              h={40}
              w={40}
              rounded="circle"
              name={"tree-outline"}
              color="fruxgreen"
              borderWidth={2}
              fontSize="2xl"
              fontFamily={"MaterialCommunityIcons"}
            />
          </Button>
        </Dropdown.Option>
      </Dropdown>
    </View>
  );
};

export default function RenderUser(props) {
  const query = gql`
    query User($dbId: Int!) {
      user(dbId: $dbId) {
        id
        name
        email
      }
    }
  `;

  const updateNameMutation = gql`
    mutation mutateUpdateUser($name: String) {
      mutateUpdateUser(name: $name) {
        id
        name
      }
    }
  `;
  const [mutateName] = useMutation(updateNameMutation);

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.data.profile.dbId },
  });

  if (loading) return null;
  return <User data={data} mutations={{ mutateName }} />;
}
