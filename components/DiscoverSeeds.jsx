import { gql } from "@apollo/client";
import * as React from "react";
import { FlatList } from "react-native";
import { Div, Text } from "react-native-magnus";
import ProjectContainer from "./ProjectContainer";

export default function Component({ data, navigation }) {
  return (
    <>
      <Div px="xs">
        <FlatList
          horizontal
          refreshing={false}
          data={data.allProjects.edges}
          keyExtractor={(item) => item.node.dbId.toString()}
          ListEmptyComponent={
            <Div>
              <Div
                rounded="xl"
                h={150}
                w={250}
                borderWidth={1}
                bg="gray100"
                borderStyle="dashed"
                borderColor="gray500"
              />
              <Div mx="sm">
                <Text color="gray500" fontSize="sm">
                  We couldn't find any seseds
                </Text>
                <Text color="gray500" fontSize="sm">
                  Try a different set of filters!
                </Text>
              </Div>
            </Div>
          }
          renderItem={({ item }) => (
            <Div mx="sm">
              <ProjectContainer navigation={navigation} project={item.node} />
            </Div>
          )}
        />
      </Div>
    </>
  );
}

Component.fragments = {
  allProjects: gql`
    fragment DiscoverSeeds on ProjectConnectionsConnection {
      edges {
        node {
          id
          dbId
          ...ProjectContainer
        }
      }
    }
    ${ProjectContainer.fragments.project}
  `,
};
