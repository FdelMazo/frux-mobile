import { gql } from "@apollo/client";
import * as React from "react";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Div, Tag } from "react-native-magnus";
import ProjectContainer from "./ProjectContainer";

export default function Component({ data, navigation, refetch }) {
  const [projectsShown, setProjectsShown] = React.useState(
    (!!data.user.projectInvestments.edges.length &&
      data.user.projectInvestments) ||
      (!!data.user.favoritedProjects.edges.length &&
        data.user.favoritedProjects) ||
      (!!data.user.createdProjects.edges.length && data.user.createdProjects)
  );
  return (
    <Div w="90%" mt="xl">
      <Div row>
        {!!data.user.projectInvestments.edges.length && (
          <TouchableOpacity
            onPress={() => setProjectsShown(data.user.projectInvestments)}
          >
            <Tag
              fontSize="sm"
              rounded="circle"
              mx="sm"
              bg={
                projectsShown === data.user.projectInvestments
                  ? "blue400"
                  : "blue200"
              }
            >
              Seeding
            </Tag>
          </TouchableOpacity>
        )}

        {!!data.user.favoritedProjects.edges.length && (
          <TouchableOpacity
            onPress={() => setProjectsShown(data.user.favoritedProjects)}
          >
            <Tag
              mx="sm"
              rounded="circle"
              fontSize="sm"
              bg={
                projectsShown === data.user.favoritedProjects
                  ? "blue400"
                  : "blue200"
              }
            >
              Favourites
            </Tag>
          </TouchableOpacity>
        )}

        {!!data.user.createdProjects.edges.length && (
          <TouchableOpacity
            onPress={() => setProjectsShown(data.user.createdProjects)}
          >
            <Tag
              fontSize="sm"
              rounded="circle"
              mx="sm"
              bg={
                projectsShown === data.user.createdProjects
                  ? "blue400"
                  : "blue200"
              }
            >
              Created
            </Tag>
          </TouchableOpacity>
        )}
      </Div>

      <Div mt="sm">
        <FlatList
          horizontal
          refreshing={false}
          onRefresh={refetch}
          keyExtractor={(item) => item.node.id}
          data={projectsShown.edges}
          renderItem={({ item }) => (
            <ProjectContainer
              navigation={navigation}
              project={
                projectsShown === data?.user?.createdProjects
                  ? item.node
                  : item.node.project
              }
            />
          )}
        />
      </Div>
    </Div>
  );
}

Component.fragments = {
  user: gql`
    fragment UserProjects on User {
      projectInvestments {
        edges {
          node {
            id
            project {
              ...ProjectContainer
            }
          }
        }
      }
      favoritedProjects {
        edges {
          node {
            id
            project {
              ...ProjectContainer
            }
          }
        }
      }
      createdProjects {
        edges {
          node {
            id
            ...ProjectContainer
          }
        }
      }
    }
    ${ProjectContainer.fragments.project}
  `,
};
