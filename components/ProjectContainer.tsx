import { gql } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Div, Text } from "react-native-magnus";

type Data = {
  dbId: number;
  project: {
    currentState: string;
    name: string;
    categoryName: string;
    amountCollected: number;
    goal: number;
  };
};
type Navigation = StackNavigationProp<any>;

function Component({
  data,
  navigation,
}: {
  data: Data;
  navigation: Navigation;
}) {
  const stagecolor = {
    CREATED: "pink500",
  };

  return (
    <TouchableHighlight
      onPress={() => {
        navigation.navigate("ProjectScreen", { dbId: data.dbId });
      }}
      underlayColor="white"
    >
      <Div my="sm" mr="lg">
        <Div
          rounded="xl"
          h={150}
          w={250}
          bgImg={require("../assets/images/nopicture.jpg")}
        >
          <Div
            bg={stagecolor[data.project.currentState]}
            rounded="md"
            flexWrap="wrap"
            px="md"
            m="lg"
            alignSelf="flex-start"
          >
            <Text color="white" fontSize="sm">
              {data.project.currentState}
            </Text>
          </Div>
        </Div>
        <Div row alignItems="center">
          <Div flex={1}>
            <Text fontWeight="bold" fontSize="xl" mt="sm">
              {data.project.name}
            </Text>
            <Text color="gray500" fontSize="sm">
              {data.project.categoryName}
            </Text>
          </Div>
          <Div row>
            <Text color="fruxgreen" fontWeight="bold" fontSize="2xl">
              {"$"}
              {data.project.amountCollected}
            </Text>
            <Text color="gray500" fontWeight="bold" fontSize="lg">
              {"  /"}
              {data.project.goal}
            </Text>
          </Div>
        </Div>
      </Div>
    </TouchableHighlight>
  );
}

type Props = {
  navigation: Navigation;
  dbId: number;
};

export default function Render(props: Props) {
  const query = gql`
    query ProjectContainer($dbId: Int!) {
      project(dbId: $dbId) {
        dbId
        id
        name
        currentState
        categoryName
        amountCollected
        goal
      }
    }
  `;
  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  return <Component data={data} navigation={props.navigation} />;
}
