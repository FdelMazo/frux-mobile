import { gql, useMutation, useQuery } from "@apollo/client";
import throttle from "lodash.throttle";
import * as React from "react";
import { Div } from "react-native-magnus";
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
        viewerId={!!data.profile && data.profile.dbId}
        data={data}
        navigation={navigation}
        title="Discover"
        icon="discover"
        mutations={mutations}
      />

      <MainView refetch={refetch}>
        <Div my="md">
          <DiscoverFilters
            refetchSeeds={refetchSeeds}
            data={data}
            isLogged={isLogged}
          />
        </Div>
        <Div
          borderBottomColor="fruxgreen"
          borderBottomWidth={1}
          w="80%"
          my="xl"
        />
        <Div h={220}>
          <DiscoverSeeds data={data} navigation={navigation} />
        </Div>
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
  if (loading) return <Loading />;
  if (errors.some((e) => e)) return <Error errors={errors} refetch={refetch} />;
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
