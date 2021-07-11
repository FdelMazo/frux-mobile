import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import DiscoverFilters from "../components/DiscoverFilters";
import DiscoverSeeds from "../components/DiscoverSeeds";
import Header from "../components/Header";
import { MainView, View } from "../components/Themed";
import Error from "./Error";
import Loading from "./Loading";

function Screen({ data, refetch, navigation, filters, setFilters }) {
  React.useEffect(() => {
    refetch({ filters });
  }, [filters]);

  return (
    <View>
      <Header navigation={navigation} title="Discover" icon="discover" />
      <MainView>
        <DiscoverFilters data={data} setFilters={setFilters} />
        <DiscoverSeeds data={data} navigation={navigation} />
      </MainView>
    </View>
  );
}

export default function Render(props) {
  const query = gql`
    query Discover($filters: ProjectFilter) {
      allProjects(filters: $filters) {
        ...DiscoverSeeds
      }
      allCategories {
        ...DiscoverFilters
      }
    }
    ${DiscoverSeeds.fragments.allProjects}
    ${DiscoverFilters.fragments.allCategories}
  `;

  const [filters, setFilters] = React.useState({});
  const { loading, error, data, refetch } = useQuery(query, {
    variables: {
      filters,
    },
  });

  if (error) return <Error errors={[error]} />;
  if (loading) return <Loading />;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      refetch={refetch}
      filters={filters}
      setFilters={setFilters}
    />
  );
}
