import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import DiscoverFilters from "../components/DiscoverFilters";
import DiscoverSeeds from "../components/DiscoverSeeds";
import Header from "../components/Header";
import { MainView, View } from "../components/Themed";
import { useUser } from "../services/user";
import Error from "./Error";
import Loading from "./Loading";

function Screen({
  data,
  refetch,
  navigation,
  filters,
  setFilters,
  isLogged,
  mutations,
}) {
  const refetchSeeds = React.useCallback(() => {
    refetch({ filters });
  }, [filters]);

  React.useEffect(() => {
    refetchSeeds();
  }, [filters]);

  return (
    <View>
      <Header
        data={data}
        navigation={navigation}
        title="Discover"
        icon="discover"
        mutations={mutations}
      />
      <MainView>
        <DiscoverFilters
          data={data}
          setFilters={setFilters}
          isLogged={isLogged}
        />
        <DiscoverSeeds
          data={data}
          navigation={navigation}
          refetchSeeds={refetchSeeds}
        />
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

  const [filters, setFilters] = React.useState({});
  const { user } = useUser();
  const isLogged = !!user;
  const { loading, error, data, refetch } = useQuery(query, {
    variables: {
      filters,
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
      filters={filters}
      mutations={{ mutateProject }}
      setFilters={setFilters}
      isLogged={isLogged}
    />
  );
}
