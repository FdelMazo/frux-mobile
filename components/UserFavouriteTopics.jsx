import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Text } from "react-native-magnus";
import { toggler } from "../services/helpers";
import FruxOverlay from "./FruxOverlay";
import TopicContainer from "./TopicContainer";

export default function Component({ data, isViewer, mutations }) {
  const [myTopics, setMyTopics] = React.useState(
    data.user.interests.edges.map((n) => n.node.name) || []
  );
  const [myTopicsOverlay, setMyTopicsOverlay] = React.useState(false);

  return (
    <>
      <Div>
        {myTopics.length ? (
          <TouchableOpacity
            activeOpacity={isViewer ? 0.2 : 1}
            onPress={isViewer ? () => setMyTopicsOverlay(true) : undefined}
          >
            <>
              <Div>
                <Text fontSize="xl" fontWeight="bold">
                  {isViewer ? "My Topics" : "Favourite Topics"}
                </Text>
              </Div>
              <Div row flexWrap="wrap">
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
              <Div row>
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

      <FruxOverlay
        visible={myTopicsOverlay}
        title="My Favourite Topics"
        body={
          <Div justifyContent="center" row flexWrap="wrap">
            {data.allCategories.edges.map((item) => (
              <Button
                key={item.node.name}
                bg={undefined}
                p={0}
                underlayColor="fruxgreen"
                onPress={() => {
                  toggler(myTopics, setMyTopics, item.node.name);
                }}
                m="sm"
              >
                <TopicContainer
                  active={myTopics.includes(item.node.name)}
                  showName={true}
                  name={item.node.name}
                />
              </Button>
            ))}
          </Div>
        }
        success={{
          title: "Done",
          action: () => {
            mutations.mutateUpdateUser({
              variables: {
                interests: myTopics,
              },
            });
            setMyTopicsOverlay(false);
          },
        }}
      />
    </>
  );
}

Component.fragments = {
  allCategories: gql`
    fragment UserFavouriteTopics_allCategories on CategoryConnection {
      edges {
        node {
          id
          name
        }
      }
    }
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
