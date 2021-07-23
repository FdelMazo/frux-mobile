import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Div, Text } from "react-native-magnus";
import { States } from "../constants/Constants";
import { toDollars } from "../services/helpers";
import { getImageUri } from "../services/media";

export default function Component({ project, navigation }) {
  const [uriImage, setUriImage] = React.useState(null);
  const [goalDollars, setGoalDollars] = React.useState(0);
  const [amountCollectedDollars, setAmountCollectedDollars] = React.useState(0);
  React.useEffect(() => {
    async function dollars() {
      let _goalDollars = await toDollars(project.goal);
      let _amountCollectedDollars = await toDollars(project.amountCollected);
      setGoalDollars(_goalDollars);
      setAmountCollectedDollars(_amountCollectedDollars);
    }
    dollars();
  }, [project.goal, project.amountCollected]);

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
      <Div w={250}>
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
              {States[project.currentState].name.toUpperCase()}
            </Text>
          </Div>
        </Div>
        <Div mx="sm" row alignItems="center" justifyContent="space-between">
          <Div mt="sm" maxW="70%">
            <Text fontWeight="bold" lineBreakMode="clip" fontSize="xl">
              {project.name}
            </Text>
            <Text color="gray500" fontSize="sm">
              {project.categoryName}
            </Text>
          </Div>
          {!!project.goal && (
            <Div row alignSelf="flex-start" mt="sm">
              <Text color="fruxgreen" fontWeight="bold" fontSize="2xl">
                {"$"}
                {amountCollectedDollars}
              </Text>
              <Text color="gray500" fontWeight="bold" fontSize="lg">
                {"  /"}
                {goalDollars}
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
      id
      dbId
      uriImage
      name
      currentState
      categoryName
      amountCollected
      goal
    }
  `,
};
