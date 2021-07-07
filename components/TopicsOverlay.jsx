import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import { Button, Div, Overlay } from "react-native-magnus";
import { toggler } from "../services/helpers";
import TopicContainer from "./TopicContainer";

function Component({ visible, setVisible, topics, setTopics, multiple, data }) {
  return (
    <Overlay visible={visible}>
      <Div justifyContent="center" row flexWrap="wrap">
        {data.allCategories.edges.map((item) => (
          <Button
            key={item.node.name}
            bg={undefined}
            p={0}
            underlayColor="fruxgreen"
            onPress={() => {
              multiple
                ? toggler(topics, setTopics, item.node.name)
                : setTopics(item.node.name);
            }}
          >
            <TopicContainer
              active={
                multiple
                  ? topics.includes(item.node.name)
                  : topics === item.node.name
              }
              showName={true}
              name={item.node.name}
            />
          </Button>
        ))}
      </Div>

      <Div my="md" row justifyContent="space-between">
        <Div alignSelf="center"></Div>

        <Div row>
          <Button
            onPress={() => {
              setVisible(false);
            }}
            mx="sm"
            fontSize="sm"
            p="md"
            bg="fruxgreen"
            color="white"
          >
            Done
          </Button>
        </Div>
      </Div>
    </Overlay>
  );
}

export default function Render(props) {
  const query = gql`
    query Topics {
      allCategories {
        edges {
          node {
            name
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  return <Component data={data} {...props} />;
}
