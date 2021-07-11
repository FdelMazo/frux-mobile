import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import DelayInput from "react-native-debounce-input";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Icon, Tag, Text } from "react-native-magnus";
import LocationOverlay from "./LocationOverlay";
import ProjectContainer from "./ProjectContainer";
import TopicContainer from "./TopicContainer";
import { States } from "../constants/Constants";
import { toggler } from "../services/helpers";
import { FlatList } from "react-native";

export default function Component({ data, navigation }) {
  return (
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
              <ProjectContainer navigation={navigation} dbId={item.node.dbId} />
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
  );
}

Component.fragments = {
  allProjects: gql`
    fragment DiscoverSeeds on ProjectConnectionsConnection {
      edges {
        node {
          dbId
        }
      }
    }
  `,
};
