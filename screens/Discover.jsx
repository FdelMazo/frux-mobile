import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import { FlatList } from "react-native-gesture-handler";
import { Div, Text } from "react-native-magnus";
import DiscoverFilters from "../components/DiscoverFilters";
import Header from "../components/Header";
import Loading from "../components/Loading";
import ProjectContainer from "../components/ProjectContainer";
import { MainView, View } from "../components/Themed";

function Screen({ data, refetch, navigation }) {
  const [filters, setFilters] = React.useState({});

  React.useEffect(() => {
    refetch({ filters });
  }, [filters]);

  return (
    <View>
      <Header navigation={navigation} title="Discover" icon="discover" />
      <MainView>
        <DiscoverFilters setFilters={setFilters} />
        <Div w="90%">
          <Div>
            <Text fontSize="xl" fontWeight="bold">
              Seeds
            </Text>
            {data.allProjects.edges?.length ? (
              <FlatList
                horizontal
                data={data.allProjects.edges}
                keyExtractor={(item) => item.node.dbId.toString()}
                renderItem={({ item }) => (
                  <ProjectContainer
                    navigation={navigation}
                    dbId={item.node.dbId}
                  />
                )}
              />
            ) : (
              <Div my="sm" mr="lg">
                <Div
                  rounded="xl"
                  h={150}
                  w={250}
                  borderWidth={1}
                  borderStyle="dashed"
                  borderColor="gray500"
                />
                <Div mx="sm">
                  <Text color="gray500" fontSize="sm">
                    We couldn't find any seeds
                  </Text>
                  <Text color="gray500" fontSize="sm">
                    Try a different set of filters!
                  </Text>
                </Div>
              </Div>
            )}
          </Div>
        </Div>
      </MainView>
    </View>
  );
}

export default function Render(props) {
  const query = gql`
    query Discover($filters: ProjectFilter) {
      allProjects(filters: $filters) {
        edges {
          node {
            dbId
          }
        }
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(query, {
    variables: {
      filters: {},
    },
  });
  if (error) alert(JSON.stringify(error));
  if (loading || !data) return <Loading />;
  return <Screen data={data} refetch={refetch} navigation={props.navigation} />;
}
