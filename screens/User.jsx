import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import { MainView, View } from "../components/Themed";
import UserBecomeSupervisorButton from "../components/UserBecomeSupervisorButton";
import UserData from "../components/UserData";
import UserEditionHeaderAndDropdown from "../components/UserEditionHeaderAndDropdown";
import UserFavouriteTopics from "../components/UserFavouriteTopics";
import UserProjects from "../components/UserProjects";
import { useUser } from "../services/user";
import Error from "./Error";
import Loading from "./Loading";

function Screen({ data, navigation, mutations, refetch }) {
  const { user } = useUser();
  const isViewer = React.useMemo(
    () => user && data.user.email === user.email,
    [user]
  );

  return (
    <View>
      <UserEditionHeaderAndDropdown
        data={data}
        navigation={navigation}
        isViewer={isViewer}
        mutations={mutations}
      />

      <MainView>
        <UserData data={data} isViewer={isViewer} mutations={mutations} />
        <UserFavouriteTopics
          data={data}
          isViewer={isViewer}
          mutations={mutations}
        />
        <UserProjects data={data} navigation={navigation} refetch={refetch} />
        <UserBecomeSupervisorButton data={data} isViewer={isViewer} />
      </MainView>
    </View>
  );
}

export default function Render(props) {
  const query = gql`
    query User($dbId: Int!) {
      user(dbId: $dbId) {
        dbId
        id
        email
        ...UserData
        ...UserEditionHeaderAndDropdown
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
    ${UserEditionHeaderAndDropdown.fragments.user}
    ${UserFavouriteTopics.fragments.allCategories}
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

  const [mutateUpdateUser, { error: mutateUpdateUserError }] =
    useMutation(updateMutation);

  const [mutateProject, { error: mutateProjectError }] = useMutation(
    createProjectMutation
  );

  const { loading, error, data, refetch } = useQuery(query, {
    variables: { dbId: props.dbId || props.route?.params.dbId },
  });

  const errors = [error, mutateUpdateUserError, mutateProjectError];
  if (errors.some((e) => e)) return <Error errors={errors} />;
  if (loading) return <Loading />;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      mutations={{ mutateUpdateUser, mutateProject }}
      refetch={refetch}
    />
  );
}
