import { gql } from "@apollo/client";
import * as React from "react";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Div, Tag } from "react-native-magnus";
import ProjectContainer from "./ProjectContainer";

export default function Component({ data, navigation }) {
  const [projectsShown, setProjectsShown] = React.useState(
    (!!data.user.createdProjects.edges.length && data.user.createdProjects) ||
      (!!data.user.projectInvestments.edges.length &&
        data.user.projectInvestments) ||
      (!!data.user.favoritedProjects.edges.length &&
        data.user.favoritedProjects) ||
      (!!data.user.seerProjects.edges.length && data.user.seerProjects)
  );
  return (
    <Div>
      <Div my="sm" row justifyContent="center">
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

        {!!data.user.projectInvestments.edges.length && (
          <TouchableOpacity
            onPress={() => setProjectsShown(data.user.projectInvestments)}
          >
            <Tag
              mx="sm"
              rounded="circle"
              fontSize="sm"
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

        {!!data.user.seerProjects.edges.length && (
          <TouchableOpacity
            onPress={() => setProjectsShown(data.user.seerProjects)}
          >
            <Tag
              mx="sm"
              rounded="circle"
              fontSize="sm"
              bg={
                projectsShown === data.user.seerProjects ? "blue400" : "blue200"
              }
            >
              Supervising
            </Tag>
          </TouchableOpacity>
        )}
      </Div>

      <Div my="sm">
        <FlatList
          horizontal
          keyExtractor={(item) => item.node.id}
          data={projectsShown.edges}
          renderItem={({ item }) => (
            <Div mx="sm">
              <ProjectContainer
                navigation={navigation}
                project={
                  projectsShown === data?.user?.createdProjects ||
                  projectsShown === data?.user?.seerProjects
                    ? item.node
                    : item.node.project
                }
              />
            </Div>
          )}
        />
      </Div>
    </Div>
  );
}

Component.fragments = {
  user: gql`
    fragment UserProjects on User {
      id
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
      seerProjects {
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
