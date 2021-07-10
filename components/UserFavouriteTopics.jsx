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
          <TouchableOpacity onPress={() => setMyTopicsOverlay(true)}>
            <>
              <Div alignSelf="flex-start">
                <Text fontSize="xl" fontWeight="bold">
                  {isViewer ? "My Topics" : "Favourite Topics"}
                </Text>
              </Div>
              <Div row my="md" flexWrap="wrap">
                {myTopics.map((t) => (
                  <TopicContainer showName={true} name={t} key={t} />
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
    ${TopicsOverlay.fragments.allCategories}
    fragment UserFavouriteTopics on CategoryConnection {
      ...TopicsOverlay
    }
  `,
};
