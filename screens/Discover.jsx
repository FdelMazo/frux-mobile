import { gql, useMutation, useQuery } from "@apollo/client";
import throttle from "lodash.throttle";
import * as React from "react";
import DiscoverFilters from "../components/DiscoverFilters";
import DiscoverSeeds from "../components/DiscoverSeeds";
import Header from "../components/Header";
import { MainView, View } from "../components/Themed";
import { notificationHandshake } from "../services/notifications";
import { useUser } from "../services/user";
import Error from "./Error";
import Loading from "./Loading";

function Screen({ data, refetch, navigation, isLogged, mutations }) {
  const refetchSeeds = React.useCallback(
    throttle((f) => refetch({ filters: f }), 1500),
    []
  );

  React.useEffect(() => {
    if (!data.profile) return;
    notificationHandshake(data.profile.dbId);
  }, [data.profile]);

  return (
    <View>
      <Header
        data={data}
        navigation={navigation}
        title="Discover"
        icon="discover"
        mutations={mutations}
      />
      <MainView refetch={refetch}>
        <DiscoverFilters
          refetchSeeds={refetchSeeds}
          data={data}
          isLogged={isLogged}
        />
        <DiscoverSeeds data={data} navigation={navigation} />
      </MainView>
    </View>
  );
}

export default function Render(props) {
  const query = gql`
    query Discover($filters: ProjectFilter, $isLogged: Boolean!) {
      allProjects(filters: $filters) {
        ...DiscoverSeeds
      }
      allCategories {
        ...DiscoverFilters_allCategories
      }
      profile @include(if: $isLogged) {
        id
        dbId
        ...DiscoverFilters_user
      }
    }
    ${DiscoverSeeds.fragments.allProjects}
    ${DiscoverFilters.fragments.allCategories}
    ${DiscoverFilters.fragments.user}
  `;

  const createProjectMutation = gql`
    mutation createProjectMutation(
      $description: String!
      $name: String!
      $deadline: String!
    ) {
      mutateProject(
        description: $description
        name: $name
        deadline: $deadline
        goal: 0
      ) {
        id
        dbId
      }
    }
  `;

  const [mutateProject, { error: mutateProjectError }] = useMutation(
    createProjectMutation
  );

  const { user } = useUser();
  const isLogged = !!user;
  const { loading, error, data, refetch } = useQuery(query, {
    variables: {
      filters: {},
      isLogged,
    },
  });

  const errors = [error, mutateProjectError];
  if (errors.some((e) => e)) return <Error errors={errors} />;
  if (loading) return <Loading />;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      refetch={refetch}
      mutations={{ mutateProject }}
      isLogged={isLogged}
    />
  );
}
