import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import { RefreshControl } from "react-native";
import { Button, Div, Overlay, Text } from "react-native-magnus";
import { MainView, View } from "../components/Themed";
import UserData from "../components/UserData";
import UserEditionHeaderAndDropdown from "../components/UserEditionHeaderAndDropdown";
import UserFavouriteTopics from "../components/UserFavouriteTopics";
import UserProjects from "../components/UserProjects";
import UserSupervisorBanner from "../components/UserSupervisorBanner";
import Colors from "../constants/Colors";
import { loggingOut, useUser } from "../services/user";
import Error from "./Error";
import Loading from "./Loading";

function Screen({ data, navigation, mutations, refetch }) {
  const { user } = useUser();
  const isViewer = React.useMemo(
    () => user && data.user.email === user.email,
    [user]
  );
  const [blockedOverlay, setBlockedOverlay] = React.useState(false);

  React.useEffect(() => {
    setBlockedOverlay(isViewer && data.user.isBlocked);
  }, [data, isViewer]);

  return (
    <View>
      <UserEditionHeaderAndDropdown
        data={data}
        navigation={navigation}
        isViewer={isViewer}
        mutations={mutations}
      />

      <MainView refetch={refetch}>
        <UserData data={data} isViewer={isViewer} mutations={mutations} />
        <UserFavouriteTopics
          data={data}
          isViewer={isViewer}
          mutations={mutations}
        />
        <UserProjects data={data} navigation={navigation} />
        <UserSupervisorBanner
          data={data}
          isViewer={isViewer}
          mutations={mutations}
        />
      </MainView>

      <Overlay visible={blockedOverlay}>
        <Text fontSize="xl" fontWeight="bold" color="fruxred">
          User Blocked
        </Text>
        <Div my="md">
          <Text>
            Your user is blocked. Please contact a{" "}
            <Text color="fruxgreen">Frux</Text> administrator to unblock your
            account.
          </Text>
        </Div>
        <Div row alignSelf="flex-end">
          <Button
            onPress={() => {
              loggingOut();
              setBlockedOverlay(false);
            }}
            mx="sm"
            p="md"
            borderColor="fruxgreen"
            borderWidth={1}
            rounded="sm"
            bg={undefined}
            color="fruxgreen"
          >
            Done
          </Button>
        </Div>
      </Overlay>
    </View>
  );
}

export default function Render(props) {
  const query = gql`
    query User($dbId: Int!) {
      user(dbId: $dbId) {
        dbId
        isBlocked
        id
        email
        ...UserData
        ...UserEditionHeaderAndDropdown
        ...UserProjects
        ...UserSupervisorBanner
        ...UserFavouriteTopics_user
      }
      allCategories {
        ...UserFavouriteTopics_allCategories
      }
    }
    ${UserData.fragments.user}
    ${UserFavouriteTopics.fragments.user}
    ${UserProjects.fragments.user}
    ${UserEditionHeaderAndDropdown.fragments.user}
    ${UserFavouriteTopics.fragments.allCategories}
    ${UserSupervisorBanner.fragments.user}
  `;

  const updateMutation = gql`
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
        ...UserFavouriteTopics_user
        ...UserEditionHeaderAndDropdown
        ...UserData
      }
    }
    ${UserData.fragments.user}
    ${UserFavouriteTopics.fragments.user}
    ${UserEditionHeaderAndDropdown.fragments.user}
  `;

  const createProjectMutation = gql`
    mutation createProjectMutation($description: String!, $name: String!) {
      mutateProject(description: $description, name: $name, goal: 0) {
        id
        dbId
      }
    }
  `;

  const seerMutation = gql`
    mutation seerMutation {
      mutateSetSeer {
        id
        ...UserSupervisorBanner
      }
    }
    ${UserSupervisorBanner.fragments.user}
  `;

  const [mutateUpdateUser, { error: mutateUpdateUserError }] =
    useMutation(updateMutation);

  const [mutateProject, { error: mutateProjectError }] = useMutation(
    createProjectMutation
  );

  const [mutateSetSeer, { error: mutateSetSeerError }] =
    useMutation(seerMutation);

  const { loading, error, data, refetch } = useQuery(query, {
    variables: { dbId: props.dbId || props.route?.params.dbId },
  });

  const errors = [
    error,
    mutateUpdateUserError,
    mutateProjectError,
    mutateSetSeerError,
  ];
  if (errors.some((e) => e)) return <Error errors={errors} />;
  if (loading) return <Loading />;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      mutations={{ mutateUpdateUser, mutateProject, mutateSetSeer }}
      refetch={refetch}
    />
  );
}
