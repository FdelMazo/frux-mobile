import { gql } from "@apollo/client";
import { useMutation } from "@apollo/react-hooks";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as React from "react";
import { Button, Div, Icon, Input, Overlay, Text } from "react-native-magnus";

function Component(props) {
  const { mutations, navigation, data } = props;
  const [createProjectOverlay, setCreateProjectOverlay] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState("");
  const [newProjectDescription, setNewProjectDescription] = React.useState("");
  const [projectError, setProjectError] = React.useState("");
  const [newProjectGoal, setNewProjectGoal] = React.useState(500);

  React.useEffect(() => {
    if (data?.mutateProject?.dbId)
      navigation.navigate("ProjectScreen", {
        dbId: data.mutateProject.dbId,
      });
  }, [data?.mutateProject?.dbId]);

  return (
    <>
      <Button
        bg="fruxgreen"
        borderColor="black"
        borderWidth={1}
        p="xs"
        mb="sm"
        onPress={() => {
          setCreateProjectOverlay(true);
        }}
      >
        <Icon name="add" color="white" fontFamily="Ionicons" fontSize="2xl" />
      </Button>

      <Overlay visible={createProjectOverlay}>
        <Text fontSize="xl" fontWeight="bold">
          Create New Project
        </Text>
        <Div>
          <Input
            w="65%"
            mt="md"
            value={newProjectName}
            onChangeText={setNewProjectName}
            placeholder="Name"
          />
          <Input
            w="65%"
            mt="md"
            value={newProjectDescription}
            onChangeText={setNewProjectDescription}
            placeholder="Description"
          />

          <Div m="md">
            <Text fontSize="5xl" color="fruxgreen">
              {"$"}
              {newProjectGoal}
            </Text>
            <MultiSlider
              trackStyle={{ backgroundColor: "#bdc3c7" }}
              selectedStyle={{ backgroundColor: "#90B44B" }}
              markerStyle={{
                backgroundColor: "#90B44B",
              }}
              values={[newProjectGoal]}
              sliderLength={200}
              onValuesChange={(v) => {
                setNewProjectGoal(Math.floor(v));
              }}
              step={50}
              max={5000}
            />
          </Div>
        </Div>
        {projectError !== "" && (
          <Text color="red" textAlign="right" m="md">
            {projectError}
          </Text>
        )}
        <Div row alignSelf="flex-end">
          <Button
            mx="sm"
            p="md"
            bg={undefined}
            borderWidth={1}
            borderColor="fruxgreen"
            color="fruxgreen"
            onPress={() => {
              setCreateProjectOverlay(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={async () => {
              if (
                !newProjectName ||
                !newProjectDescription ||
                !newProjectGoal
              ) {
                return setProjectError("You must specify all fields!");
              }

              setCreateProjectOverlay(false);
              await mutations?.createProject({
                variables: {
                  name: newProjectName,
                  goal: newProjectGoal,
                  description: newProjectDescription,
                },
              });
            }}
            mx="sm"
            p="md"
            bg="fruxgreen"
            color="white"
          >
            Create
          </Button>
        </Div>
      </Overlay>
    </>
  );
}

export default function Render(props) {
  const createProjectMutation = gql`
    mutation createProjectMutation(
      $description: String!
      $goal: Int!
      $name: String!
    ) {
      mutateProject(description: $description, goal: $goal, name: $name) {
        dbId
      }
    }
  `;
  const [createProject, { data, loading, error }] = useMutation(
    createProjectMutation
  );

  return <Component mutations={{ createProject }} {...props} data={data} />;
}
