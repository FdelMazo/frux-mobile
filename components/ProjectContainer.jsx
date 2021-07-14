import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Div, Text } from "react-native-magnus";
import { States } from "../constants/Constants";
import { getImageUri } from "../services/media";

export default function Component({ project, navigation }) {
  const [uriImage, setUriImage] = React.useState(null);

  React.useEffect(() => {
    getImageUri(project.uriImage || "nopicture.jpg").then((r) =>
      setUriImage(r)
    );
  }, [project.uriImage]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ProjectScreen", { dbId: project.dbId });
      }}
    >
      <Div my="sm" mr="lg">
        <Div rounded="xl" h={150} w={250} bgImg={{ uri: uriImage }}>
          <Div
            bg={States[project.currentState].color + "500"}
            rounded="md"
            flexWrap="wrap"
            px="md"
            m="lg"
            alignSelf="flex-start"
          >
            <Text color="white" fontSize="sm">
              {project.currentState}
            </Text>
          </Div>
        </Div>
        <Div mx="sm" row alignItems="center">
          <Div flex={1}>
            <Text fontWeight="bold" fontSize="xl" mt="sm">
              {project.name}
            </Text>
            <Text color="gray500" fontSize="sm">
              {project.categoryName}
            </Text>
          </Div>
          {!!project.goal && (
            <Div row>
              <Text color="fruxgreen" fontWeight="bold" fontSize="2xl">
                {"$"}
                {project.amountCollected}
              </Text>
              <Text color="gray500" fontWeight="bold" fontSize="lg">
                {"  /"}
                {project.goal}
              </Text>
            </Div>
          )}
        </Div>
      </Div>
    </TouchableOpacity>
  );
}

Component.fragments = {
  project: gql`
    fragment ProjectContainer on Project {
      dbId
      id
      uriImage
      name
      currentState
      categoryName
      amountCollected
      goal
    }
  `,
};
