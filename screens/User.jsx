import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import { Div, Text } from "react-native-magnus";
import FruxOverlay from "../components/FruxOverlay";
import { MainView, View } from "../components/Themed";
import UserData from "../components/UserData";
import UserEditionHeaderAndDropdown from "../components/UserEditionHeaderAndDropdown";
import UserFavouriteTopics from "../components/UserFavouriteTopics";
import UserProjects from "../components/UserProjects";
import UserSupervisorBanner from "../components/UserSupervisorBanner";
import { loggingOut, useUser } from "../services/user";
import Error from "./Error";
import Loading from "./Loading";

function Screen({ data, navigation, mutations, refetch, user }) {
  const [blockedOverlay, setBlockedOverlay] = React.useState(false);
  const isViewer = React.useMemo(
    () => user && data.user.email === user.email,
    [user]
  );

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
        <Div w="100%" my="md">
          <UserData data={data} isViewer={isViewer} mutations={mutations} />
        </Div>
        <Div w="90%" my="md">
          <UserFavouriteTopics
            data={data}
            isViewer={isViewer}
            mutations={mutations}
          />
        </Div>
        <Div h={235} my="md">
          <UserProjects data={data} navigation={navigation} />
        </Div>
        <Div my="lg">
          <UserSupervisorBanner
            data={data}
            isViewer={isViewer}
            mutations={mutations}
          />
        </Div>
      </MainView>

      <FruxOverlay
        visible={blockedOverlay}
        title="User Blocked"
        body={
          <Text>
            Your user is blocked. Please contact a{" "}
            <Text color="fruxgreen">Frux</Text> administrator to unblock your
            account.
          </Text>
        }
        success={{
          title: "Close",
          action: () => {
            loggingOut();
            setBlockedOverlay(false);
          },
        }}
      />
    </View>
  );
}

export default function Render(props) {
  const query = gql`
    query User($dbId: Int!, $isLogged: Boolean!) {
      profile @include(if: $isLogged) {
        id
        ...UserData_profile
        ...UserEditionHeaderAndDropdown_profile
      }
      user(dbId: $dbId) {
        dbId
        isBlocked
        id
        email
        ...UserData_user
        ...UserEditionHeaderAndDropdown_user
        ...UserProjects
        ...UserSupervisorBanner
        ...UserFavouriteTopics_user
      }
      allCategories {
        ...UserFavouriteTopics_allCategories
      }
    }
    ${UserData.fragments.user}
    ${UserData.fragments.profile}
    ${UserFavouriteTopics.fragments.user}
    ${UserProjects.fragments.user}
    ${UserEditionHeaderAndDropdown.fragments.user}
    ${UserEditionHeaderAndDropdown.fragments.profile}
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
        ...UserEditionHeaderAndDropdown_user
        ...UserData_user
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

  const removeSeerMutation = gql`
    mutation removeSeerMutation {
      mutateRemoveSeer {
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

  const [mutateRemoveSeer, { error: mutateRemoveSeerError }] =
    useMutation(removeSeerMutation);

  const { user } = useUser();

  const { loading, error, data, refetch } = useQuery(query, {
    variables: {
      dbId: props.dbId || props.route?.params.dbId,
      isLogged: !!user,
    },
  });

  const errors = [
    error,
    mutateUpdateUserError,
    mutateProjectError,
    mutateSetSeerError,
    mutateRemoveSeerError,
  ];
  if (loading) return <Loading />;

  if (error?.networkError?.name === "ServerParseError") {
    refetch();
    return <Loading />;
  } else if (errors.some((e) => e))
    return <Error errors={errors} refetch={refetch} />;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      mutations={{
        mutateUpdateUser,
        mutateProject,
        mutateSetSeer,
        mutateRemoveSeer,
      }}
      refetch={refetch}
      user={user}
    />
  );
}
