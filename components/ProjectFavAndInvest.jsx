import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Div, Image, Text } from "react-native-magnus";

export default function Component({ data, mutations, created }) {
  const likedByUser = React.useMemo(() => {
    if (!data.profile) return false;
    const ids = data.project.favoritesFrom.edges.map((i) => i.node.userId);
    return ids.includes(data.profile.dbId.toString());
  }, [data.project.favoritesFrom, data.profile]);

  return (
    <Div row my="lg">
      <TouchableOpacity
        onPress={() => {
          likedByUser
            ? mutations.mutateUnfavProject({
                variables: {
                  idProject: data.project.dbId,
                },
              })
            : mutations.mutateFavProject({
                variables: {
                  idProject: data.project.dbId,
                },
              });
        }}
      >
        <Div>
          <Image
            mx="xs"
            w={45}
            h={45}
            source={
              likedByUser
                ? require("../assets/images/heart.png")
                : require("../assets/images/no-heart.png")
            }
          />
          <Text textAlign="center" fontWeight="bold">
            {data.project.favoritesFrom.edges.length || ""}
          </Text>
        </Div>
      </TouchableOpacity>
    </Div>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectFavAndInvest_project on Project {
      id
      dbId
      favoritesFrom {
        edges {
          node {
            userId
          }
        }
      }
    }
  `,
  user: gql`
    fragment ProjectFavAndInvest_user on User {
      dbId
    }
  `,
};
