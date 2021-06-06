import * as React from "react";
import { StyleSheet } from "react-native";

import { View, ScrollView, MainView } from "../components/Themed";
import {
  Icon,
  Input,
  Div,
  Tag,
  Skeleton,
  Text,
  Fab,
  Button,
} from "react-native-magnus";
import { Header } from "../components/Header";
import { TopicContainer } from "../components/TopicContainer";
import ProjectContainer from "../components/ProjectContainer";
import { FlatList, TouchableHighlight } from "react-native-gesture-handler";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import CarouselItem from "react-native-magnus/lib/typescript/src/ui/carousel/item.carousel";

export function Discover({ data, navigation }) {
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
          <Div mt={25} alignItems="center">
            <Div w="65%" flexDir="row" alignItems="center">
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
                  m={5}
                  fontSize="3xl"
                  name={searchLocation ? "location-sharp" : "location-outline"}
                  color="gray900"
                  fontFamily="Ionicons"
                />
              </TouchableHighlight>
            </Div>

            <Div my={15} flexDir="row">
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
                  mx={5}
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
                  mx={5}
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
                  mx={5}
                  bg={progressFilters.complete ? "green300" : "green100"}
                  borderColor="green700"
                  borderWidth={1}
                >
                  Complete
                </Tag>
              </TouchableHighlight>
            </Div>

            <Div w="90%" row my={15} flexWrap="wrap">
              <TopicContainer showName={true} name="Art" />
              <TopicContainer showName={true} name="Books" />
              <TopicContainer showName={true} name="Film" />
              <TopicContainer showName={true} name="Food" />
              <TopicContainer showName={true} name="Games" />
              <TopicContainer showName={true} name="Music" />
              <TopicContainer showName={true} name="Tech" />
              <TopicContainer showName={true} name="Other" />
            </Div>
          </Div>

          <Div w="90%">
            <Div>
              <Text fontSize="xl" fontWeight="bold" mb={5}>
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

export default function RenderDiscover(props) {
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

  if (loading) return null;
  return <Discover data={data} navigation={props.navigation} />;
}
