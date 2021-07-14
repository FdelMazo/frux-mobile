import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Div, Image, Text } from "react-native-magnus";

export default function Component({ data, mutations }) {
  const likedByUser = React.useMemo(() => {
    if (!data.profile) return false;
    const ids = data.project.favoritesFrom.edges.map((i) => i.node.userId);
    return ids.includes(data.profile.dbId.toString());
  }, [data.project.favoritesFrom, data.profile]);

  const investedByUser = React.useMemo(() => {
    if (!data.profile) return false;
    const ids = data.project.investors.edges.map((i) => i.node.userId);
    return ids.includes(data.profile.dbId.toString());
  }, [data.project.investors, data.profile]);

  return (
    <Div row my="lg">
      <TouchableOpacity
        activeOpacity={data.profile ? 0.2 : 1}
        onPress={
          data.profile
            ? () => {
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
              }
            : undefined
        }
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
      {data.project.currentState !== "CREATED" && (
        <TouchableOpacity
          activeOpacity={data.profile ? 0.2 : 1}
          onPress={
            data.profile
              ? () => {
                  investedByUser ? null : null;
                }
              : undefined
          }
        >
          <Div>
            <Image
              mx="xs"
              w={45}
              h={45}
              source={
                likedByUser
                  ? require("../assets/images/wallet.png")
                  : require("../assets/images/no-wallet.png")
              }
            />
            <Text textAlign="center" fontWeight="bold">
              {data.project.investors.edges.length || ""}
            </Text>
          </Div>
        </TouchableOpacity>
      )}
    </Div>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectFavAndInvest_project on Project {
      id
      dbId
      currentState
      favoritesFrom {
        edges {
          node {
            userId
          }
        }
      }
      investors {
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
