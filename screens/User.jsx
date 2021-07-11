import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import { Button, Div, Dropdown, Icon, Input, Text } from "react-native-magnus";
import Header from "../components/Header";
import LocationOverlay from "../components/LocationOverlay";
import { MainView, View } from "../components/Themed";
import UserBecomeSupervisorButton from "../components/UserBecomeSupervisorButton";
import UserData from "../components/UserData";
import UserFavouriteTopics from "../components/UserFavouriteTopics";
import UserProjects from "../components/UserProjects";
import { UserIcons } from "../constants/Constants";
import { resetPassword, useUser } from "../services/user";
import Error from "./Error";
import Loading from "./Loading";

function Screen({ data, navigation, mutations }) {
  const { user } = useUser();
  const isViewer = user && data.user.email === user.email; // convertime en useMemo

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
    <View>
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

      <MainView>
        <UserData data={data} isViewer={isViewer} mutations={mutations} />
        <UserFavouriteTopics
          data={data}
          isViewer={isViewer}
          mutations={mutations}
        />
        <UserProjects data={data} navigation={navigation} />
        <UserBecomeSupervisorButton data={data} isViewer={isViewer} />
      </MainView>

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
    </View>
  );
}

export default function Render(props) {
  const query = gql`
    query User($dbId: Int!) {
      user(dbId: $dbId) {
        ...UserData
        dbId
        id
        username
        email
        imagePath
        latitude
        longitude
        ...UserProjects
        ...UserFavouriteTopics_user
      }
      allCategories {
        ...UserFavouriteTopics_allCategories
      }
    }
    ${UserData.fragments.user}
    ${UserFavouriteTopics.fragments.user}
    ${UserProjects.fragments.user}
    ${UserFavouriteTopics.fragments.allCategories}
  `;

  const updateMutation = gql`
    ${UserData.fragments.user}
    mutation updateMutation(
      $username: String
      $imagePath: String
      $latitude: String
      $longitude: String
      $firstName: String
      $lastName: String
      $description: String
      $interests: [String]
    ) {
      mutateUpdateUser(
        username: $username
        imagePath: $imagePath
        latitude: $latitude
        longitude: $longitude
        interests: $interests
        firstName: $firstName
        lastName: $lastName
        description: $description
      ) {
        id
        username
        imagePath
        latitude
        ...UserData
        longitude
        interests {
          edges {
            node {
              name
            }
          }
        }
      }
    }
  `;

  const [mutateUpdateUser, { error: mutateUpdateUserError }] =
    useMutation(updateMutation);

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId || props.route?.params.dbId },
  });
  const errors = [error, mutateUpdateUserError];

  if (errors.some((e) => e)) return <Error errors={errors} />;
  if (loading) return <Loading />;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      mutations={{ mutateUpdateUser }}
    />
  );
}
