import { gql } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Div, Icon, Input, Tag, Text } from "react-native-magnus";
import Header from "../components/Header";
import ProjectContainer from "../components/ProjectContainer";
import { MainView, ScrollView, View } from "../components/Themed";
import TopicContainer from "../components/TopicContainer";
import { Topics } from "../constants/Constants";

type Data = {
  allProjects: {
    edges: { node: { dbId: number } }[];
  };
  allCategories: {
    edges: { node: { name: string } }[];
  };
};

type Navigation = StackNavigationProp<any>;

function Screen({ data, navigation }: { data: Data; navigation: Navigation }) {
  const [searchLocation, setSearchLocation] = React.useState(false);
  const [progressFilters, setProgressFilters] = React.useState({
    inProgress: false,
    almostDone: false,
    complete: false,
  });

  return (
    <View>
      <Header navigation={navigation} title="Discover" icon="discover" />
      <ScrollView>
        <MainView>
          <Div mt="xl" alignItems="center">
            <Div w="65%" row alignItems="center">
              <Input
                placeholder="Search"
                focusBorderColor="blue700"
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
              <TouchableOpacity
                onPress={() =>
                  setProgressFilters({
                    inProgress: !progressFilters.inProgress,
                    almostDone: progressFilters.almostDone,
                    complete: progressFilters.complete,
                  })
                }
              >
                <Tag
                  mx="sm"
                  bg={progressFilters.inProgress ? "pink300" : "pink100"}
                  borderColor="pink700"
                  borderWidth={1}
                >
                  In Progress
                </Tag>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setProgressFilters({
                    inProgress: progressFilters.inProgress,
                    almostDone: !progressFilters.almostDone,
                    complete: progressFilters.complete,
                  })
                }
              >
                <Tag
                  mx="sm"
                  bg={progressFilters.almostDone ? "blue300" : "blue100"}
                  borderColor="blue700"
                  borderWidth={1}
                >
                  Almost Done!
                </Tag>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setProgressFilters({
                    inProgress: progressFilters.inProgress,
                    almostDone: progressFilters.almostDone,
                    complete: !progressFilters.complete,
                  })
                }
              >
                <Tag
                  mx="sm"
                  bg={progressFilters.complete ? "green300" : "green100"}
                  borderColor="green700"
                  borderWidth={1}
                >
                  Complete
                </Tag>
              </TouchableOpacity>
            </Div>

            <Div w="90%" row my="md" flexWrap="wrap">
              {data.allCategories.edges.map((item) => (
                <TopicContainer
                  key={item.node.name}
                  navigation={navigation}
                  showName={true}
                  name={item.node.name}
                />
              ))}
            </Div>
          </Div>

          <Div w="90%">
            <Div>
              <Text fontSize="xl" fontWeight="bold">
                Recommended Seeds
              </Text>
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
            </Div>
          </Div>
        </MainView>
      </ScrollView>
    </View>
  );
}

type Props = {
  navigation: Navigation;
};

export default function Render(props: Props) {
  const query = gql`
    query Discover {
      allCategories {
        edges {
          node {
            name
          }
        }
      }
      allProjects {
        edges {
          node {
            dbId
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(query);
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  return <Screen data={data} navigation={props.navigation} />;
}
