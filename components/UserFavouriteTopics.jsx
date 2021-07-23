import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Text } from "react-native-magnus";
import TopicContainer from "./TopicContainer";
import TopicsOverlay from "./TopicsOverlay";

export default function Component({ data, isViewer, mutations }) {
  const [myTopics, setMyTopics] = React.useState(
    data.user.interests.edges.map((n) => n.node.name) || []
  );
  const [myTopicsOverlay, setMyTopicsOverlay] = React.useState(false);

  React.useEffect(() => {
    mutations.mutateUpdateUser({
      variables: {
        interests: myTopics,
      },
    });
  }, [myTopics]);

  return (
    <>
      <Div w="90%" mt="xl">
        {myTopics.length ? (
          <TouchableOpacity
            activeOpacity={isViewer ? 0.2 : 1}
            onPress={isViewer ? () => setMyTopicsOverlay(true) : undefined}
          >
            <>
              <Div alignSelf="flex-start">
                <Text fontSize="xl" fontWeight="bold">
                  {isViewer ? "My Topics" : "Favourite Topics"}
                </Text>
              </Div>
              <Div row my="md" flexWrap="wrap">
                {myTopics.map((t) => (
                  <Div key={t} m="sm">
                    <TopicContainer showName={true} name={t} />
                  </Div>
                ))}
              </Div>
            </>
          </TouchableOpacity>
        ) : (
          <>
            {isViewer && (
              <Div row alignItems="center">
                <TopicContainer active showName={false} name="Other" />
                <Button
                  bg="white"
                  fontWeight="bold"
                  color="fruxgreen"
                  alignSelf="center"
                  onPress={() => {
                    setMyTopicsOverlay(true);
                  }}
                >
                  Choose Your Favourite Topics
                </Button>
              </Div>
            )}
          </>
        )}
      </Div>
      <TopicsOverlay
        topics={myTopics}
        setTopics={setMyTopics}
        visible={myTopicsOverlay}
        setVisible={setMyTopicsOverlay}
        multiple={true}
        data={data}
      />
    </>
  );
}

Component.fragments = {
  allCategories: gql`
    fragment UserFavouriteTopics_allCategories on CategoryConnection {
      ...TopicsOverlay
    }
    ${TopicsOverlay.fragments.allCategories}
  `,
  user: gql`
    fragment UserFavouriteTopics_user on User {
      interests {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `,
};
