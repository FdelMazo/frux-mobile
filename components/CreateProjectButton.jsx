import { gql, useMutation } from "@apollo/client";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as React from "react";
import { Button, Div, Icon, Input, Overlay, Text } from "react-native-magnus";
import Colors from "../constants/Colors";
import { formatDateInput } from "../services/helpers";

function Component(props) {
  const { mutations, navigation, data } = props;
  const [createProjectOverlay, setCreateProjectOverlay] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState("");
  const [newProjectDescription, setNewProjectDescription] = React.useState("");
  const [projectError, setProjectError] = React.useState("");
  const [newProjectGoal, setNewProjectGoal] = React.useState(500);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const inOneMonth = new Date();
  inOneMonth.setMonth(inOneMonth.getMonth() + 1);
  const [newFinalizationDate, setNewFinalizationDate] = React.useState(null);
  const [selectDate, setSelectDate] = React.useState(false);

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
          <Button
            block
            w="65%"
            mt="md"
            borderColor={newFinalizationDate ? "gray700" : "gray900"}
            underlayColor="gray200"
            borderWidth={1}
            py="md"
            bg={undefined}
            onPress={() => setSelectDate(true)}
            suffix={
              <Icon
                name="calendar-outline"
                position="absolute"
                right={0}
                color={newFinalizationDate ? "gray700" : "gray900"}
                fontFamily="Ionicons"
                fontSize="lg"
              />
            }
          >
            <Div flex={1}>
              <Text color={newFinalizationDate ? "gray700" : "gray900"}>
                {newFinalizationDate
                  ? formatDateInput(newFinalizationDate)
                  : "Delivered By..."}
              </Text>
            </Div>
          </Button>

          <Div m="md">
            <Text fontSize="5xl" color="fruxgreen">
              {"$"}
              {newProjectGoal}
            </Text>
            <MultiSlider
              selectedStyle={{ backgroundColor: Colors.fruxgreen }}
              markerStyle={{
                backgroundColor: Colors.fruxgreen,
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
          <Text color="fruxred" textAlign="right" m="md">
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
                !newProjectGoal ||
                !newFinalizationDate
              ) {
                return setProjectError("You must specify all fields!");
              }

              setCreateProjectOverlay(false);
              await mutations?.createProject({
                variables: {
                  name: newProjectName,
                  goal: newProjectGoal,
                  description: newProjectDescription,
                  deadline: formatDateInput(newFinalizationDate),
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

        {selectDate && (
          <DateTimePicker
            value={newFinalizationDate || inOneMonth}
            onChange={(e, selectedDate) => {
              setSelectDate(false);
              setNewFinalizationDate(selectedDate);
            }}
            minimumDate={tomorrow}
            display="default"
          />
        )}
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
      $deadline: String!
    ) {
      mutateProject(
        description: $description
        goal: $goal
        name: $name
        deadline: $deadline
      ) {
        dbId
      }
    }
  `;
  const [createProject, { data, loading, error }] = useMutation(
    createProjectMutation
  );

  return <Component mutations={{ createProject }} {...props} data={data} />;
}
