import { gql } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { FlatList, TouchableHighlight } from "react-native-gesture-handler";
import { Div, Icon, Input, Tag, Text } from "react-native-magnus";
import Header from "../components/Header";
import ProjectContainer from "../components/ProjectContainer";
import { MainView, ScrollView, View } from "../components/Themed";
import TopicContainer from "../components/TopicContainer";

type Data = {
  allProjects: {
    edges: { node: { dbId: number } }[];
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
              <TouchableHighlight
                underlayColor="white"
                onPress={() => setSearchLocation(!searchLocation)}
              >
                <Icon
                  m="sm"
                  fontSize="3xl"
                  name={searchLocation ? "location-sharp" : "location-outline"}
                  color="gray900"
                  fontFamily="Ionicons"
                />
              </TouchableHighlight>
            </Div>

            <Div my="lg" flexDir="row">
              <TouchableHighlight
                underlayColor="white"
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
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="white"
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
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="white"
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
              </TouchableHighlight>
            </Div>

            <Div w="90%" row my="md" flexWrap="wrap">
              <TopicContainer
                navigation={navigation}
                showName={true}
                name="Art"
              />
              <TopicContainer
                navigation={navigation}
                showName={true}
                name="Books"
              />
              <TopicContainer
                navigation={navigation}
                showName={true}
                name="Film"
              />
              <TopicContainer
                navigation={navigation}
                showName={true}
                name="Food"
              />
              <TopicContainer
                navigation={navigation}
                showName={true}
                name="Games"
              />
              <TopicContainer
                navigation={navigation}
                showName={true}
                name="Music"
              />
              <TopicContainer
                navigation={navigation}
                showName={true}
                name="Tech"
              />
              <TopicContainer
                navigation={navigation}
                showName={true}
                name="Other"
              />
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
