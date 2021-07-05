import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/react-hooks";
import * as React from "react";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Icon, Input, Tag, Text } from "react-native-magnus";
import Header from "../components/Header";
import Loading from "../components/Loading";
import ProjectContainer from "../components/ProjectContainer";
import { MainView, View } from "../components/Themed";
import TopicContainer from "../components/TopicContainer";
import { States } from "../constants/Constants";
import { toggler } from "../constants/Helpers";

function Screen({ data, refetch, navigation }) {
  const [searchText, setSearchText] = React.useState("");
  const [searchLocation, setSearchLocation] = React.useState(false);
  const [progressFilters, setProgressFilters] = React.useState([]);
  const [topicsFilter, setTopicsFilter] = React.useState([]);
  const [filters, setFilters] = React.useState({});

  React.useEffect(() => {
    topicsFilter.length
      ? setFilters({ categoryNameIn: topicsFilter })
      : setFilters({});
  }, [searchText, searchLocation, progressFilters, topicsFilter]);

  React.useEffect(() => {
    refetch({ filters });
  }, [filters]);

  return (
    <View>
      <Header navigation={navigation} title="Discover" icon="discover" />
      <MainView>
        <Div mt="xl" alignItems="center">
          <Div w="65%" row alignItems="center">
            <Input
              placeholder="Search"
              focusBorderColor="blue700"
              value={searchText}
              onChangeText={setSearchText}
              suffix={
                <Icon name="search" color="gray900" fontFamily="Feather" />
              }
            />
            <TouchableOpacity
              onPress={() => setSearchLocation(!searchLocation)}
            >
              <Icon
                m="sm"
                fontSize="3xl"
                name={searchLocation ? "location-sharp" : "location-outline"}
                color="gray900"
                fontFamily="Ionicons"
              />
            </TouchableOpacity>
          </Div>

          <Div my="lg" flexDir="row">
            {Object.keys(States).map((k) => {
              const { name, color } = States[k];
              return (
                <TouchableOpacity
                  key={name}
                  onPress={() =>
                    toggler(progressFilters, setProgressFilters, name)
                  }
                >
                  <Tag
                    mx="sm"
                    bg={
                      progressFilters.includes(name) ? color + 300 : color + 100
                    }
                    borderColor={color + 700}
                    borderWidth={1}
                  >
                    {name}
                  </Tag>
                </TouchableOpacity>
              );
            })}
          </Div>

          <Div w="90%" row my="md" flexWrap="wrap">
            {data.allCategories.edges.map((item) => (
              <Button
                key={item.node.name}
                bg={undefined}
                p={0}
                underlayColor="fruxgreen"
                onPress={() => {
                  toggler(topicsFilter, setTopicsFilter, item.node.name);
                }}
              >
                <TopicContainer
                  active={topicsFilter.includes(item.node.name)}
                  key={item.node.name}
                  navigation={navigation}
                  showName={true}
                  name={item.node.name}
                />
              </Button>
            ))}
          </Div>
        </Div>

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
      allCategories {
        edges {
          node {
            name
          }
        }
      }
      allProjects(filters: $filters) {
        edges {
          node {
            dbId
          }
        }
      }
    }
  `;

  const [fetchData, { loading, error, data, refetch }] = useLazyQuery(query, {
    variables: {
      filters: {},
    },
  });
  React.useEffect(() => {
    fetchData();
  }, []);
  if (error) alert(JSON.stringify(error));
  if (loading || !data) return <Loading />;
  return <Screen data={data} refetch={refetch} navigation={props.navigation} />;
}
