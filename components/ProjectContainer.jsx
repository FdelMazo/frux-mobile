import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Div, Text } from "react-native-magnus";
import { States } from "../constants/Constants";
import { getImageUri } from "../services/media";

function Component({ data, navigation }) {
  const [uriImage, setUriImage] = React.useState(null);

  React.useEffect(() => {
    getImageUri(data.project.uriImage || "nopicture.jpg").then((r) =>
      setUriImage(r)
    );
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ProjectScreen", { dbId: data.project.dbId });
      }}
    >
      <Div my="sm" mr="lg">
        <Div rounded="xl" h={150} w={250} bgImg={{ uri: uriImage }}>
          <Div
            bg={States[data.project.currentState].color + "500"}
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
        <Div mx="sm" row alignItems="center">
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
    </TouchableOpacity>
  );
}

export default function Render(props) {
  const query = gql`
    query ProjectContainer($dbId: Int!) {
      project(dbId: $dbId) {
        dbId
        id
        uriImage
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
