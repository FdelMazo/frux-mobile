import { gql } from "@apollo/client";
import * as React from "react";
import { Button, Div, Dropdown, Icon, Input, Text } from "react-native-magnus";
import { UserIcons } from "../constants/Constants";
import { resetPassword } from "../services/user";
import Header from "./Header";

export default function Component({ data, isViewer, mutations, navigation }) {
  // Why isn't this component divided in header and dropdown?
  // Because React is a headache to work when trying to pass down refs through props
  const defaultUsername = data.user.username || data.user.email.split("@")[0];
  const [username, setUsername] = React.useState(defaultUsername);
  const [emailSent, setEmailSent] = React.useState(false);
  const dropdownRef = React.createRef();

  return (
    <>
      <Header
        viewerId={!!data.profile && data.profile.dbId}
        onPress={
          isViewer
            ? () => {
                dropdownRef.current.open();
              }
            : undefined
        }
        navigation={navigation}
        mutations={mutations}
        title={defaultUsername}
        icon={data.user.imagePath || "seed"}
      />

      <Dropdown
        ref={dropdownRef}
        title={
          <Div w="65%" alignSelf="center">
            <Div mb="sm" row justifyContent="space-between">
              <Text fontSize="sm">{data.user.email}</Text>
              <Text
                onPress={() => {
                  if (emailSent) return;
                  resetPassword(data.user.email).then(() => setEmailSent(true));
                }}
                color={emailSent ? "black" : "fruxgreen"}
                fontSize="sm"
              >
                {emailSent ? "Mail Sent!" : "Reset password"}
              </Text>
            </Div>
            <Input
              maxLength={14}
              placeholder="Username"
              focusBorderColor="blue700"
              value={username}
              onChangeText={setUsername}
              suffix={
                <>
                  {username !== defaultUsername && username !== "" && (
                    <Button
                      bg={undefined}
                      p={0}
                      onPress={() => {
                        mutations.mutateUpdateUser({
                          variables: {
                            username,
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
          </Div>
        }
        showSwipeIndicator={true}
        roundedTop="xl"
      >
        <Dropdown.Option justifyContent="space-evenly">
          {UserIcons.map((item) => (
            <Button
              key={item.name}
              bg={undefined}
              underlayColor="fruxgreen"
              onPress={() => {
                mutations.mutateUpdateUser({
                  variables: { imagePath: item.name },
                });
              }}
            >
              <Icon
                bg="fruxbrown"
                h={40}
                w={40}
                rounded="circle"
                name={item.name}
                color="fruxgreen"
                borderWidth={2}
                borderColor={
                  item.name === data.user.imagePath ||
                  (!data.user.imagePath && item.name === "seed")
                    ? "fruxgreen"
                    : "black"
                }
                fontSize="2xl"
                fontFamily={item.fontFamily}
              />
            </Button>
          ))}
        </Dropdown.Option>
      </Dropdown>
    </>
  );
}

Component.fragments = {
  user: gql`
    fragment UserEditionHeaderAndDropdown_user on User {
      id
      username
      email
      imagePath
    }
  `,
  profile: gql`
    fragment UserEditionHeaderAndDropdown_profile on User {
      id
      dbId
    }
  `,
};
