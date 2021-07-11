import { gql } from "@apollo/client";
import * as React from "react";
import { Button, Div, Dropdown, Icon, Input, Text } from "react-native-magnus";
import { UserIcons } from "../constants/Constants";
import { resetPassword } from "../services/user";
import Header from "./Header";
import LocationOverlay from "./LocationOverlay";

export default function Component({ data, isViewer, mutations, navigation }) {
  // Why isn't this component divided in header and dropdown?
  // Because React is a headache to work when trying to pass down refs through props
  const defaultUsername = data.user.username || data.user.email.split("@")[0];
  const [username, setUsername] = React.useState(defaultUsername);
  const [emailSent, setEmailSent] = React.useState(false);
  const dropdownRef = React.createRef();
  const [location, setLocation] = React.useState({
    latitude: data.user.latitude,
    longitude: data.user.longitude,
  });
  const [locationOverlay, setLocationOverlay] = React.useState(false);
  React.useEffect(() => {
    mutations.mutateUpdateUser({
      variables: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  }, [location]);

  return (
    <>
      <Header
        onPress={
          isViewer
            ? () => {
                dropdownRef.current.open();
              }
            : undefined
        }
        navigation={navigation}
        title={defaultUsername}
        icon={data.user.imagePath || "seed"}
      />

      <Dropdown
        ref={dropdownRef}
        title={
          <Div alignSelf="center">
            <Div row justifyContent="space-between">
              <Text mb="sm" fontSize="sm">
                {data.user.email}
              </Text>
              <Text
                mb="sm"
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
              placeholder="Username"
              w="65%"
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
            <Div row justifyContent="flex-end">
              <Button
                py="sm"
                px={0}
                bg={undefined}
                color="blue500"
                underlayColor="blue100"
                fontSize="sm"
                onPress={() => {
                  setLocationOverlay(true);
                }}
                suffix={
                  <Icon
                    name="location-outline"
                    fontFamily="Ionicons"
                    fontSize="xl"
                    color="blue600"
                  />
                }
              >
                {location.longitude ? "Change Location" : "Set Location"}
              </Button>
            </Div>
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
                  item.name === data.user.imagePath ? "fruxgreen" : "black"
                }
                fontSize="2xl"
                fontFamily={item.fontFamily}
              />
            </Button>
          ))}
        </Dropdown.Option>
      </Dropdown>

      <LocationOverlay
        location={location}
        setLocation={setLocation}
        visible={locationOverlay}
        setVisible={setLocationOverlay}
      />
    </>
  );
}

Component.fragments = {
  user: gql`
    fragment UserEditionHeaderAndDropdown on User {
      username
      email
      latitude
      longitude
      imagePath
    }
  `,
};
